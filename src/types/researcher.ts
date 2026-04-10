/** Card + profile UI shape; also returned by GET /api/search (Flask-backed). */
export type Researcher = {
  id: string;
  name: string;
  title: string;
  university: string;
  location: string;
  image: string;
  topics: string[];
  matchScore: number;
  publications: number;
  summary: string;
};
