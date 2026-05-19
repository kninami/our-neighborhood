export type Candidate = {
  id: string;
  name: string;
  party: string;
  district: string;
  candidateType: string;
  region: string;
  donationInfo: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  blogUrl: string;
  slogan: string;
  pledges: string[];
  photoUrl: string;
};

export type CandidatePolicy = {
  region: string;
  localArea: string;
  candidateName: string;
  title: string;
  content: string;
};

export type RegionalAgenda = {
  region: string;
  localArea: string;
  category: string;
  title: string;
  content: string;
  relatedPolicy: string;
};
