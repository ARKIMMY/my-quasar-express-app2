import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import taskRoutes from './routes/task.routes'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000

// ===== Middlewares =====
app.use(cors())               // ให้ Quasar เรียก API ได้
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())       // สำคัญมาก (รับ JSON จาก frontend)

// ===== Logs directory =====
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// ===== Demo endpoint (Lab 1.2) =====
app.get('/api/demo', (req, res) => {
  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`
  fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage)

  res.json({
    git: {
      title: 'Advanced Git Workflow',
      detail:
        'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge',
    },
    docker: {
      title: 'Advanced Docker',
      detail:
        'ใช้ multi-stage build, healthcheck และ orchestration',
    },
  })
})

// ===== Health check =====
app.get('/', (_req, res) => {
  res.json({
    message: 'API พร้อมใช้งาน',
    timestamp: new Date().toISOString(),
  })
})

// ===== Task API (Lab 2.1) =====
app.use('/api/tasks', taskRoutes)

// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).json({
    message: 'ไม่พบเส้นทาง',
    path: req.originalUrl,
  })
})

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

