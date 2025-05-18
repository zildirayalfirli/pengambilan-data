import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './db/mongodb.js'
import { fetchAndStoreDataDirectWeather } from './controllers/WeatherController.js'
import { fetchAndStoreDataPerairanDirect } from './controllers/PerairanController.js'
import { fetchAndStoreDataPressureDirect } from './controllers/SurfaceController.js'
import { fetchAndStoreDataTideDirect } from './controllers/TideController.js'

dotenv.config()
const app = express()
app.use(express.json())

connectDB().then(() => {
  console.log('🟢 Memulai fetchAndStoreData saat server start')
  fetchAndStoreDataDirectWeather()
  fetchAndStoreDataPerairanDirect()
  fetchAndStoreDataPressureDirect()
  fetchAndStoreDataTideDirect()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
