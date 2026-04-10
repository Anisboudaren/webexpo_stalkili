import type { AdvisorFitResult, NormalizedPaper, ResearchField } from './types';

type ScoreInput = {
  papers: NormalizedPaper[];
  researchFields: ResearchField[];
  studentInterests: string[];
  currentYear?: number;
  recentWindowYears?: number;
};

function clamp100(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function overlapScore(researchFields: ResearchField[], studentInterests: string[]): number {
  if (!studentInterests.length || !researchFields.length) {
    return 30;
  }

  const interests = studentInterests.map((item) => item.toLowerCase().trim()).filter(Boolean);
  const matched = researchFields.filter((field) =>
    interests.some((interest) => field.field.toLowerCase().includes(interest) || interest.includes(field.field.toLowerCase()))
  );
  if (!matched.length) {
    return 20;
  }

  const confidenceAvg =
    matched.reduce((sum, field) => sum + field.confidence, 0) / Math.max(1, matched.length);
  return clamp100(50 + confidenceAvg * 50);
}

function recentActivityScore(papers: NormalizedPaper[], currentYear: number, windowYears: number): number {
  if (!papers.length) {
    return 20;
  }
  const recentCutoff = currentYear - windowYears;
  const withYear = papers.filter((paper) => typeof paper.year === 'number');
  if (!withYear.length) {
    return 40;
  }
  const recentCount = withYear.filter((paper) => (paper.year ?? 0) >= recentCutoff).length;
  return clamp100((recentCount / withYear.length) * 100);
}

function impactScore(papers: NormalizedPaper[]): number {
  if (!papers.length) {
    return 20;
  }
  const cites = papers
    .map((paper) => paper.citedByTotal ?? 0)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a);
  if (!cites.length) {
    return 30;
  }

  const topThree = cites.slice(0, 3);
  const avgTop = topThree.reduce((sum, n) => sum + n, 0) / topThree.length;
  return clamp100(Math.min(100, avgTop / 20));
}

function publicationBreadthScore(papers: NormalizedPaper[]): number {
  if (!papers.length) {
    return 20;
  }
  const venues = new Set(
    papers.map((paper) => paper.journalOrVenue?.toLowerCase().trim()).filter((value): value is string => Boolean(value))
  );
  const score = (venues.size / Math.max(1, Math.min(8, papers.length))) * 100;
  return clamp100(score);
}

export function scoreAdvisorFit(input: ScoreInput): AdvisorFitResult {
  const currentYear = input.currentYear ?? new Date().getFullYear();
  const recentWindowYears = input.recentWindowYears ?? 5;

  const topicAlignment = overlapScore(input.researchFields, input.studentInterests);
  const recentActivity = recentActivityScore(input.papers, currentYear, recentWindowYears);
  const impactSignal = impactScore(input.papers);
  const publicationBreadth = publicationBreadthScore(input.papers);

  const weights = {
    topicAlignment: 0.4,
    recentActivity: 0.25,
    impactSignal: 0.2,
    publicationBreadth: 0.15,
  } as const;

  const breakdown = [
    {
      metric: 'topicAlignment' as const,
      score: topicAlignment,
      weight: weights.topicAlignment,
      weightedScore: clamp100(topicAlignment * weights.topicAlignment),
      reason: 'Measures overlap between student interests and inferred advisor research fields.',
    },
    {
      metric: 'recentActivity' as const,
      score: recentActivity,
      weight: weights.recentActivity,
      weightedScore: clamp100(recentActivity * weights.recentActivity),
      reason: 'Estimates how actively the advisor publishes in recent years.',
    },
    {
      metric: 'impactSignal' as const,
      score: impactSignal,
      weight: weights.impactSignal,
      weightedScore: clamp100(impactSignal * weights.impactSignal),
      reason: 'Uses citation levels as a rough proxy for impact and recognition.',
    },
    {
      metric: 'publicationBreadth' as const,
      score: publicationBreadth,
      weight: weights.publicationBreadth,
      weightedScore: clamp100(publicationBreadth * weights.publicationBreadth),
      reason: 'Checks diversity across venues/topics to indicate research breadth.',
    },
  ];

  const fitScore = clamp100(
    topicAlignment * weights.topicAlignment +
      recentActivity * weights.recentActivity +
      impactSignal * weights.impactSignal +
      publicationBreadth * weights.publicationBreadth
  );

  const fitLevel: AdvisorFitResult['fitLevel'] =
    fitScore >= 75 ? 'high' : fitScore >= 50 ? 'medium' : 'low';

  const pros: string[] = [];
  const risks: string[] = [];

  if (topicAlignment >= 70) pros.push('Strong topical overlap with your declared interests.');
  else risks.push('Limited clear overlap with your declared interests.');

  if (recentActivity >= 60) pros.push('Publication record appears active in recent years.');
  else risks.push('Recent publication activity seems limited.');

  if (impactSignal >= 60) pros.push('Citation profile suggests notable research impact.');
  else risks.push('Citation signal is modest from available data.');

  if (publicationBreadth >= 50) pros.push('Research appears across multiple venues/topics.');
  else risks.push('Research may be concentrated in a narrow set of venues/topics.');

  return {
    fitScore,
    fitLevel,
    scoreBreakdown: breakdown,
    pros,
    risks,
    nextQuestions: [
      'Is the advisor currently accepting new doctoral students?',
      'How often does the advisor publish with students as first authors?',
      'Do recent projects match your preferred methodology and career goals?',
    ],
  };
}
