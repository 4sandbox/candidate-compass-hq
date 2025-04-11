
export interface Project {
  id: number;
  name: string;
  description?: string;
  position: string;
  candidateCount: number;
  createdDate: Date;
}

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "Frontend Developer Recruitment",
    description: "Tuyển dụng Frontend Developer cho dự án thương mại điện tử",
    position: "Frontend Developer",
    candidateCount: 15,
    createdDate: new Date('2025-03-01')
  },
  {
    id: 2,
    name: "Backend Engineer 2025",
    description: "Tuyển Backend Developer cho team Product",
    position: "Backend Developer",
    candidateCount: 8,
    createdDate: new Date('2025-03-10')
  },
  {
    id: 3,
    name: "Fullstack Developer Q2/2025",
    description: "Tuyển Fullstack Developer cho dự án mới",
    position: "Fullstack Developer",
    candidateCount: 5,
    createdDate: new Date('2025-03-15')
  },
  {
    id: 4,
    name: "UX/UI Designer",
    description: "Tuyển UX/UI Designer cho team Product",
    position: "UX/UI Designer",
    candidateCount: 3,
    createdDate: new Date('2025-03-20')
  }
];
