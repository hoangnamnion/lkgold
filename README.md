# Website với tính năng bảo trì

Website được xây dựng bằng Node.js và Express, có tính năng quản lý trạng thái bảo trì.

## Tính năng

- Trang chủ hiển thị nội dung website
- Trang admin để quản lý trạng thái bảo trì
- Hệ thống đăng nhập bảo mật
- Giao diện responsive và thân thiện với người dùng

## Cài đặt

1. Cài đặt Node.js (phiên bản 14 trở lên)
2. Clone repository này về máy
3. Mở terminal và di chuyển vào thư mục dự án
4. Chạy lệnh sau để cài đặt dependencies:
```bash
npm install
```

## Chạy ứng dụng

### Môi trường development
```bash
npm run dev
```

### Môi trường production
```bash
npm start
```

## Thông tin đăng nhập admin

- Username: admin
- Password: 123456

## Cấu trúc thư mục

```
├── public/          # Chứa các file tĩnh (CSS, JS, images)
├── views/           # Chứa các file template HTML
├── server.js        # File chính của ứng dụng
├── package.json     # File cấu hình project
└── README.md        # File hướng dẫn
```

## Bảo mật

- Sử dụng CSRF token để bảo vệ các form
- Session được mã hóa và có thời hạn
- Cookie được cấu hình bảo mật
- Mật khẩu nên được thay đổi trong môi trường production 