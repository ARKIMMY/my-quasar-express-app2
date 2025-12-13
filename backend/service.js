const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// สร้างโฟลเดอร์ logs ถ้ายังไม่มี (สำหรับ volume demo)
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Endpoint demo: Return info และ log request
app.get('/api/demo', (req, res) => {
  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
  try {
    fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage, { encoding: 'utf8' });
  } catch (err) {
    console.error('Failed to write access log:', err);
  }

  res.json({
    name: 'Arnada Kaeopaphan',
    student_id: '6604101401',
  });
});

// root route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Error handling (ต้องมี 4 arguments เพื่อให้ Express รู้จัก middleware นี้เป็น error handler)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});