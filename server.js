const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let isMaintenance = false;

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

// Trang admin đơn giản
app.get("/admin", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Trang Admin</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 2rem;
          background-color: #f5f5f5;
        }
        .admin-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
          margin-bottom: 2rem;
          text-align: center;
        }
        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        form {
          margin: 0;
        }
        button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }
        .maintenance-btn {
          background-color: #dc3545;
          color: white;
        }
        .maintenance-btn:hover {
          background-color: #c82333;
        }
        .resume-btn {
          background-color: #28a745;
          color: white;
        }
        .resume-btn:hover {
          background-color: #218838;
        }
      </style>
    </head>
    <body>
      <div class="admin-container">
        <h1>Quản lý trạng thái Website</h1>
        <div class="button-group">
          <form method="POST" action="/maintenance">
            <button type="submit" class="maintenance-btn">🔒 Bảo trì web</button>
          </form>
          <form method="POST" action="/resume">
            <button type="submit" class="resume-btn">✅ Mở lại web</button>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Bật bảo trì
app.post("/maintenance", (req, res) => {
  isMaintenance = true;
  res.redirect("/admin");
});

// Mở lại
app.post("/resume", (req, res) => {
  isMaintenance = false;
  res.redirect("/admin");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server đang chạy tại port ${port}`);
});
