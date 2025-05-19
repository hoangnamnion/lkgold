const express = require("express");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");

const app = express();
const port = 3000;

// Đăng nhập cố định cho demo
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Nam2005@";

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: crypto.randomBytes(32).toString('hex'), // Tạo secret key ngẫu nhiên
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 giờ
  }
}));

let isMaintenance = false;

// Middleware để thêm CSRF token
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

// Middleware để kiểm tra CSRF token
const checkCsrf = (req, res, next) => {
  if (req.method === 'POST') {
    if (req.body._csrf !== req.session.csrfToken) {
      return res.status(403).send('CSRF token không hợp lệ');
    }
  }
  next();
};

// Trang chính
app.get("/", (req, res) => {
  if (isMaintenance) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Website đang bảo trì</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f8f9fa;
          }
          .maintenance-container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #dc3545;
            margin-bottom: 1rem;
          }
          p {
            color: #6c757d;
            font-size: 1.1rem;
          }
        </style>
      </head>
      <body>
        <div class="maintenance-container">
          <h1>🚧 WEB LOCKET HOÀNG NAM ĐANG BẢO TRÌ 🚧</h1>
          <p>Website đang trong quá trình bảo trì. Vui lòng quay lại sau.</p>
          <p style="color: #dc3545; font-weight: bold;">
            Muốn nâng gold thì liên hệ Cao Văn Nam - Giá 59k/vĩnh viễn.
          </p>
        </div>
      </body>
      </html>
    `);
  } else {
    res.sendFile(path.join(__dirname, "public/index.html"));
  }
});

// Trang đăng nhập
app.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/admin");
  } else {
    res.sendFile(path.join(__dirname, "views/login.html"));
  }
});

// Xử lý đăng nhập
app.post("/login", checkCsrf, (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect("/admin");
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Đăng nhập thất bại</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f8f9fa;
          }
          .error-container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h3 {
            color: #dc3545;
            margin-bottom: 1rem;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h3>❌ Sai tài khoản hoặc mật khẩu!</h3>
          <a href='/login'>Thử lại</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Middleware bảo vệ trang admin
function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Trang admin
app.get("/admin", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin.html"));
});

// Bật bảo trì
app.post("/maintenance", requireLogin, checkCsrf, (req, res) => {
  isMaintenance = true;
  res.redirect("/admin?status=maintenance");
});

// Mở lại
app.post("/resume", requireLogin, checkCsrf, (req, res) => {
  isMaintenance = false;
  res.redirect("/admin?status=resume");
});

// Đăng xuất
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
