import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/mongodb.js'
import { fetchAndStoreDataDirect } from './controllers/WeatherController.js'

dotenv.config()
const app = express()
app.use(express.json())

connectDB().then(() => {
  console.log('🟢 Memulai fetchAndStoreData saat server start')
  fetchAndStoreDataDirect()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
