
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
}

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Mời phỏng vấn",
    subject: "Mời tham gia phỏng vấn vị trí {Vị trí ứng tuyển} tại Công ty ABC",
    body: `Chào {Tên},

Cảm ơn bạn đã ứng tuyển vào vị trí {Vị trí ứng tuyển} tại Công ty ABC.

Chúng tôi rất ấn tượng với CV của bạn và muốn mời bạn tham gia buổi phỏng vấn trực tuyến để tìm hiểu thêm.

Xin vui lòng phản hồi email này với thời gian phù hợp cho bạn trong tuần tới.

Trân trọng,
Đội ngũ tuyển dụng Công ty ABC`
  },
  {
    id: 2,
    name: "Từ chối ứng viên",
    subject: "Thông báo kết quả ứng tuyển vị trí {Vị trí ứng tuyển} tại Công ty ABC",
    body: `Chào {Tên},

Cảm ơn bạn đã dành thời gian ứng tuyển vào vị trí {Vị trí ứng tuyển} tại Công ty ABC.

Sau khi xem xét kỹ lưỡng hồ sơ của bạn, chúng tôi rất tiếc phải thông báo rằng chúng tôi sẽ không tiếp tục quá trình tuyển dụng với bạn tại thời điểm này.

Chúng tôi rất trân trọng sự quan tâm của bạn đến Công ty ABC và khuyến khích bạn ứng tuyển cho các vị trí phù hợp trong tương lai.

Chúc bạn thành công!

Trân trọng,
Đội ngũ tuyển dụng Công ty ABC`
  },
  {
    id: 3,
    name: "Xác nhận đã nhận CV",
    subject: "Xác nhận đã nhận CV ứng tuyển vị trí {Vị trí ứng tuyển}",
    body: `Chào {Tên},

Cảm ơn bạn đã ứng tuyển vào vị trí {Vị trí ứng tuyển} tại Công ty ABC.

Email này xác nhận chúng tôi đã nhận được CV của bạn và sẽ xem xét trong thời gian sớm nhất.

Nếu hồ sơ của bạn phù hợp với yêu cầu của vị trí này, chúng tôi sẽ liên hệ để thảo luận về các bước tiếp theo.

Trân trọng,
Đội ngũ tuyển dụng Công ty ABC`
  }
];
