
export interface Company {
  id: number;
  name: string;
  industry: string;
  website?: string;
  description?: string;
  logo?: string;
  address?: string;
  createdDate: Date;
}

export const mockCompanies: Company[] = [
  {
    id: 1,
    name: "TechVision",
    industry: "Công nghệ",
    website: "https://techvision.com",
    description: "Công ty phát triển phần mềm và giải pháp công nghệ",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    createdDate: new Date('2025-01-15')
  },
  {
    id: 2,
    name: "DataSolutions",
    industry: "Phân tích dữ liệu",
    website: "https://datasolutions.com",
    description: "Chuyên về giải pháp dữ liệu và AI",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    createdDate: new Date('2025-02-10')
  },
  {
    id: 3,
    name: "CloudSecure",
    industry: "Bảo mật",
    website: "https://cloudsecure.com",
    description: "Giải pháp bảo mật đám mây cho doanh nghiệp",
    address: "789 Điện Biên Phủ, Quận 3, TP.HCM",
    createdDate: new Date('2025-02-20')
  }
];
