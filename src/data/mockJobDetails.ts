
export interface JobDetail {
  id: number;
  title: string;
  companyId: number;
  projectId: number;
  location: string;
  jobType: string;
  salary?: string;
  requirements: string[];
  description: string;
  responsibilities: string[];
  createdDate: Date;
  deadline?: Date;
  status: 'Đang tuyển' | 'Đã đóng' | 'Tạm dừng';
}

export const mockJobDetails: JobDetail[] = [
  {
    id: 1,
    title: "Frontend Developer",
    companyId: 1,
    projectId: 1,
    location: "TP.HCM",
    jobType: "Full-time",
    salary: "1000 - 2000 USD",
    requirements: [
      "Có ít nhất 2 năm kinh nghiệm với React",
      "Thành thạo JavaScript/TypeScript",
      "Hiểu biết về responsive design và CSS frameworks",
      "Kinh nghiệm với state management như Redux hoặc Context API"
    ],
    description: "Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm để phát triển giao diện người dùng cho các ứng dụng web của công ty.",
    responsibilities: [
      "Phát triển và duy trì giao diện người dùng",
      "Tối ưu hóa ứng dụng để đạt hiệu suất tối đa",
      "Hợp tác với team backend để tích hợp API",
      "Review code và đảm bảo chất lượng"
    ],
    createdDate: new Date('2025-03-01'),
    deadline: new Date('2025-04-15'),
    status: 'Đang tuyển'
  },
  {
    id: 2,
    title: "Backend Developer",
    companyId: 1,
    projectId: 2,
    location: "TP.HCM",
    jobType: "Full-time",
    salary: "1500 - 2500 USD",
    requirements: [
      "Có ít nhất 3 năm kinh nghiệm với Node.js",
      "Thành thạo MongoDB và SQL",
      "Hiểu biết về cloud services (AWS hoặc Azure)",
      "Kinh nghiệm với microservices architecture"
    ],
    description: "Chúng tôi đang tìm kiếm Backend Developer có kinh nghiệm để phát triển và duy trì các API và dịch vụ backend.",
    responsibilities: [
      "Thiết kế và phát triển API",
      "Tối ưu hóa database",
      "Triển khai và duy trì hệ thống trên cloud",
      "Đảm bảo bảo mật và hiệu suất cho ứng dụng"
    ],
    createdDate: new Date('2025-03-05'),
    deadline: new Date('2025-04-20'),
    status: 'Đang tuyển'
  },
  {
    id: 3,
    title: "Data Analyst",
    companyId: 2,
    projectId: 3,
    location: "Hà Nội",
    jobType: "Full-time",
    salary: "1200 - 2200 USD",
    requirements: [
      "Có ít nhất 2 năm kinh nghiệm với phân tích dữ liệu",
      "Thành thạo SQL, Python và công cụ phân tích",
      "Kinh nghiệm với data visualization",
      "Hiểu biết về machine learning là một lợi thế"
    ],
    description: "Chúng tôi đang tìm kiếm Data Analyst có kinh nghiệm để phân tích dữ liệu và tạo ra insights cho doanh nghiệp.",
    responsibilities: [
      "Phân tích dữ liệu và báo cáo",
      "Xây dựng và duy trì dashboards",
      "Hợp tác với các bộ phận khác để hiểu nhu cầu dữ liệu",
      "Đề xuất giải pháp dựa trên phân tích dữ liệu"
    ],
    createdDate: new Date('2025-03-10'),
    deadline: new Date('2025-04-25'),
    status: 'Đang tuyển'
  }
];
