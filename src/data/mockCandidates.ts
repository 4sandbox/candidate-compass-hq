
export type CandidateStatus = 'Tất cả' | 'Tiềm năng' | 'Không phù hợp';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience?: number;
  education?: string;
  status: 'Tiềm năng' | 'Không phù hợp';
  matchScore?: number;
  resumeUrl?: string;
  appliedDate: Date;
  emailSent?: boolean;
}

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a.nguyen@gmail.com",
    phone: "0912345678",
    skills: ["React", "TypeScript", "Node.js", "MongoDB"],
    experience: 3,
    education: "Đại học Bách Khoa Hà Nội",
    status: "Tiềm năng",
    matchScore: 85,
    appliedDate: new Date('2025-03-15'),
    emailSent: true
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b.tran@gmail.com",
    phone: "0909876543",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    experience: 5,
    education: "Đại học Quốc gia TP.HCM",
    status: "Tiềm năng",
    matchScore: 75,
    appliedDate: new Date('2025-03-18'),
    emailSent: false
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c.le@gmail.com",
    phone: "0978123456",
    skills: ["Java", "Spring Boot", "MySQL"],
    experience: 2,
    education: "Đại học FPT",
    status: "Không phù hợp",
    matchScore: 45,
    appliedDate: new Date('2025-03-10'),
    emailSent: true
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "d.pham@gmail.com",
    skills: ["JavaScript", "Vue.js", "Firebase"],
    experience: 1,
    education: "Cao đẳng FPT",
    status: "Tiềm năng",
    matchScore: 68,
    appliedDate: new Date('2025-03-22'),
    emailSent: false
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "e.hoang@gmail.com",
    phone: "0918765432",
    skills: ["React", "Redux", "Node.js", "MongoDB", "AWS"],
    experience: 4,
    education: "Đại học Công nghệ - ĐHQGHN",
    status: "Tiềm năng",
    matchScore: 90,
    appliedDate: new Date('2025-03-05'),
    emailSent: true
  },
  {
    id: 6,
    name: "Đỗ Thị F",
    email: "f.do@gmail.com",
    phone: "0987654321",
    skills: ["PHP", "Laravel", "MySQL", "Docker"],
    experience: 3,
    education: "Đại học RMIT",
    status: "Không phù hợp",
    matchScore: 50,
    appliedDate: new Date('2025-03-25'),
    emailSent: false
  },
  {
    id: 7,
    name: "Vũ Văn G",
    email: "g.vu@gmail.com",
    skills: ["Angular", "TypeScript", ".NET", "Azure"],
    experience: 6,
    education: "Đại học Bách Khoa Đà Nẵng",
    status: "Tiềm năng",
    matchScore: 82,
    appliedDate: new Date('2025-03-12'),
    emailSent: true
  },
  {
    id: 8,
    name: "Trương Thị H",
    email: "h.truong@gmail.com",
    phone: "0932145678",
    skills: ["React Native", "Firebase", "GraphQL"],
    experience: 2,
    education: "Đại học Khoa học Tự nhiên - ĐHQGHN",
    status: "Không phù hợp",
    matchScore: 55,
    appliedDate: new Date('2025-03-28'),
    emailSent: false
  }
];
