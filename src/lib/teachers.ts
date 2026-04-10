export type TeacherDetail = {
  id: string;
  name: string;
  subject: string;
  university: string;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  tags: string[];
  email: string;
  phone: string;
  office: string;
  yearsExperience: number;
  publications: number;
  students: number;
  about: string;
  education: { degree: string; institution: string; year: number }[];
  courses: string[];
  researchInterests: string[];
};

export const allTeachers: TeacherDetail[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    subject: 'Machine Learning',
    university: 'MIT',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Leading researcher in deep learning and neural architecture search with 15+ years of experience.',
    tags: ['AI', 'Deep Learning', 'Neural Networks'],
    email: 's.chen@mit.edu',
    phone: '+1 (617) 555-0142',
    office: 'Stata Center, Room 32-G574',
    yearsExperience: 16,
    publications: 94,
    students: 23,
    about:
      'Dr. Sarah Chen is a tenured professor at MIT specializing in deep learning, neural architecture search, and scalable AI systems. Her lab has produced breakthrough research in self-supervised learning and efficient inference methods adopted by leading tech companies. She is passionate about mentoring the next generation of AI researchers and has supervised 23 PhD students to completion.',
    education: [
      { degree: 'PhD Computer Science', institution: 'Stanford University', year: 2008 },
      { degree: 'MSc Artificial Intelligence', institution: 'University of Edinburgh', year: 2004 },
      { degree: 'BSc Mathematics', institution: 'Peking University', year: 2002 },
    ],
    courses: ['Advanced Deep Learning', 'Neural Architecture Search', 'Probabilistic Machine Learning', 'AI Ethics & Society'],
    researchInterests: ['Self-supervised learning', 'Neural architecture search', 'Efficient deep learning', 'AI for scientific discovery'],
  },
  {
    id: '2',
    name: 'Prof. James Miller',
    subject: 'Quantum Computing',
    university: 'Stanford',
    rating: 4.8,
    reviews: 96,
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Pioneering work in quantum error correction and fault-tolerant quantum computation.',
    tags: ['Quantum Physics', 'Computing', 'Mathematics'],
    email: 'j.miller@stanford.edu',
    phone: '+1 (650) 555-0198',
    office: 'Varian Physics Building, Room 204',
    yearsExperience: 20,
    publications: 112,
    students: 31,
    about:
      'Prof. James Miller is a world-renowned quantum computing researcher whose work on error correction codes has laid the foundation for fault-tolerant quantum processors. He leads the Stanford Quantum Information Lab and collaborates with Google Quantum AI and IBM Research. His teaching style emphasizes intuitive understanding alongside rigorous mathematics.',
    education: [
      { degree: 'PhD Physics', institution: 'Caltech', year: 2004 },
      { degree: 'MPhil Quantum Information', institution: 'University of Cambridge', year: 2000 },
      { degree: 'BSc Physics', institution: 'MIT', year: 1998 },
    ],
    courses: ['Quantum Computing Fundamentals', 'Quantum Error Correction', 'Quantum Algorithms', 'Advanced Quantum Mechanics'],
    researchInterests: ['Fault-tolerant quantum computation', 'Topological quantum codes', 'Quantum simulation', 'Quantum machine learning'],
  },
  {
    id: '3',
    name: 'Dr. Maria Alvarez',
    subject: 'Climate Science',
    university: 'Oxford',
    rating: 4.7,
    reviews: 112,
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Expert in climate modelling and environmental policy with publications in Nature and Science.',
    tags: ['Climate', 'Environmental Science', 'Policy'],
    email: 'm.alvarez@ox.ac.uk',
    phone: '+44 1865 555 023',
    office: 'Environmental Change Institute, Room 312',
    yearsExperience: 14,
    publications: 78,
    students: 18,
    about:
      'Dr. Maria Alvarez bridges the gap between climate science and actionable policy. Her research group develops next-generation Earth system models and collaborates directly with IPCC working groups. She has been instrumental in shaping EU climate adaptation strategy and is a sought-after speaker on the intersection of science and governance.',
    education: [
      { degree: 'PhD Earth Sciences', institution: 'ETH Zurich', year: 2010 },
      { degree: 'MSc Environmental Policy', institution: 'LSE', year: 2006 },
      { degree: 'BSc Environmental Science', institution: 'University of Barcelona', year: 2004 },
    ],
    courses: ['Climate System Dynamics', 'Earth System Modelling', 'Science-Policy Interface', 'Environmental Data Analysis'],
    researchInterests: ['Climate tipping points', 'Earth system modelling', 'Climate policy analysis', 'Carbon cycle feedback'],
  },
  {
    id: '4',
    name: 'Prof. David Park',
    subject: 'Neuroscience',
    university: 'Harvard',
    rating: 4.9,
    reviews: 145,
    image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Renowned neuroscientist studying the neural basis of consciousness and decision-making.',
    tags: ['Neuroscience', 'Cognitive Science', 'Psychology'],
    email: 'd.park@harvard.edu',
    phone: '+1 (617) 555-0267',
    office: 'William James Hall, Room 860',
    yearsExperience: 22,
    publications: 156,
    students: 35,
    about:
      'Prof. David Park is one of the leading voices in consciousness research. His lab uses advanced neuroimaging techniques including fMRI, MEG, and invasive recordings to understand how the brain constructs subjective experience. He has mentored 35 doctoral students and is the founding editor of the Journal of Consciousness Studies.',
    education: [
      { degree: 'PhD Neuroscience', institution: 'Johns Hopkins University', year: 2002 },
      { degree: 'MD', institution: 'Seoul National University', year: 1998 },
      { degree: 'BSc Biology', institution: 'Seoul National University', year: 1994 },
    ],
    courses: ['Cognitive Neuroscience', 'The Neural Basis of Consciousness', 'Decision Neuroscience', 'Advanced Neuroimaging Methods'],
    researchInterests: ['Neural correlates of consciousness', 'Decision-making under uncertainty', 'Prefrontal cortex function', 'Brain-computer interfaces'],
  },
  {
    id: '5',
    name: 'Dr. Emily Watson',
    subject: 'Robotics',
    university: 'Carnegie Mellon',
    rating: 4.6,
    reviews: 87,
    image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Specialist in human-robot interaction and autonomous systems with multiple patents.',
    tags: ['Robotics', 'AI', 'Autonomous Systems'],
    email: 'e.watson@cmu.edu',
    phone: '+1 (412) 555-0334',
    office: 'Newell-Simon Hall, Room 4503',
    yearsExperience: 12,
    publications: 64,
    students: 14,
    about:
      'Dr. Emily Watson designs robots that collaborate seamlessly with humans. Her research spans manipulation, perception, and social robotics, with applications in healthcare and manufacturing. She holds 8 patents and her work on assistive robotics has been featured in IEEE Spectrum and Wired.',
    education: [
      { degree: 'PhD Robotics', institution: 'Carnegie Mellon University', year: 2012 },
      { degree: 'MSc Mechanical Engineering', institution: 'Georgia Tech', year: 2008 },
      { degree: 'BEng Mechatronics', institution: 'University of Tokyo', year: 2006 },
    ],
    courses: ['Introduction to Robotics', 'Human-Robot Interaction', 'Robot Perception', 'Autonomous Mobile Robots'],
    researchInterests: ['Human-robot collaboration', 'Assistive robotics', 'Robotic manipulation', 'Social robotics'],
  },
  {
    id: '6',
    name: 'Prof. Ahmed Hassan',
    subject: 'Data Science',
    university: 'ETH Zurich',
    rating: 4.8,
    reviews: 103,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Expert in large-scale data analytics, statistical learning, and information retrieval.',
    tags: ['Data Science', 'Statistics', 'Big Data'],
    email: 'a.hassan@ethz.ch',
    phone: '+41 44 555 06 78',
    office: 'CAB Building, Room F52.1',
    yearsExperience: 17,
    publications: 89,
    students: 26,
    about:
      'Prof. Ahmed Hassan leads the Data Analytics group at ETH Zurich, where he develops scalable algorithms for extracting insights from massive, heterogeneous datasets. His work spans recommendation systems, causal inference, and fairness in machine learning. He has consulted for the WHO and the World Bank on data-driven policy.',
    education: [
      { degree: 'PhD Statistics', institution: 'University of Oxford', year: 2007 },
      { degree: 'MSc Computer Science', institution: 'EPFL', year: 2003 },
      { degree: 'BSc Mathematics', institution: 'Cairo University', year: 2001 },
    ],
    courses: ['Statistical Learning Theory', 'Large-Scale Data Processing', 'Causal Inference', 'Fairness in Machine Learning'],
    researchInterests: ['Causal inference at scale', 'Algorithmic fairness', 'Recommendation systems', 'Privacy-preserving analytics'],
  },
  {
    id: '7',
    name: 'Dr. Lisa Thompson',
    subject: 'Bioinformatics',
    university: 'UC Berkeley',
    rating: 4.7,
    reviews: 91,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Bridging biology and computation to solve genomics and proteomics challenges.',
    tags: ['Bioinformatics', 'Genomics', 'Computational Biology'],
    email: 'l.thompson@berkeley.edu',
    phone: '+1 (510) 555-0421',
    office: 'Stanley Hall, Room 308B',
    yearsExperience: 11,
    publications: 53,
    students: 12,
    about:
      'Dr. Lisa Thompson develops computational tools that accelerate biological discovery. Her lab focuses on single-cell RNA sequencing analysis, protein structure prediction, and multi-omics data integration. She collaborates closely with the Innovative Genomics Institute and has received an NIH Director\'s New Innovator Award.',
    education: [
      { degree: 'PhD Computational Biology', institution: 'MIT', year: 2013 },
      { degree: 'MSc Bioinformatics', institution: 'University of Michigan', year: 2009 },
      { degree: 'BSc Biochemistry', institution: 'UC San Diego', year: 2007 },
    ],
    courses: ['Computational Genomics', 'Algorithms in Bioinformatics', 'Single-Cell Analysis', 'Protein Structure Prediction'],
    researchInterests: ['Single-cell genomics', 'Multi-omics integration', 'Protein structure prediction', 'Spatial transcriptomics'],
  },
  {
    id: '8',
    name: 'Prof. Robert Kim',
    subject: 'Cybersecurity',
    university: 'Georgia Tech',
    rating: 4.5,
    reviews: 78,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Leading authority on network security, cryptography, and privacy-preserving computation.',
    tags: ['Cybersecurity', 'Cryptography', 'Networks'],
    email: 'r.kim@gatech.edu',
    phone: '+1 (404) 555-0589',
    office: 'Klaus Advanced Computing Building, Room 3337',
    yearsExperience: 19,
    publications: 101,
    students: 28,
    about:
      'Prof. Robert Kim is a leading cybersecurity researcher whose work on zero-knowledge proofs and privacy-preserving protocols has been adopted in industry-standard systems. He directs the Georgia Tech Cybersecurity Research Center and advises the US National Security Agency. His courses are among the highest rated at Georgia Tech.',
    education: [
      { degree: 'PhD Computer Science', institution: 'UC Berkeley', year: 2005 },
      { degree: 'MSc Cryptography', institution: 'Technion', year: 2001 },
      { degree: 'BSc Computer Engineering', institution: 'KAIST', year: 1999 },
    ],
    courses: ['Network Security', 'Applied Cryptography', 'Privacy-Preserving Computation', 'Secure Systems Design'],
    researchInterests: ['Zero-knowledge proofs', 'Post-quantum cryptography', 'Network intrusion detection', 'Secure multi-party computation'],
  },
];
