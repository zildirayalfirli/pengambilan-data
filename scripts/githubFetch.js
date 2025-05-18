import 'dotenv/config'
import { connectDB } from '../db/mongodb.js'
import { fetchAndStoreDataDirectWeather } from '../controllers/WeatherController.js'
import { fetchAndStoreDataPerairanDirect } from '../controllers/PerairanController.js'
import { fetchAndStoreDataPressureDirect } from '../controllers/SurfaceController.js'
import { fetchAndStoreDataTideDirect } from '../controllers/TideController.js'

const main = async () => {
  await connectDB()
  await fetchAndStoreDataDirectWeather()
  await fetchAndStoreDataPerairanDirect()
  await fetchAndStoreDataPressureDirect()
  await fetchAndStoreDataTideDirect()
  process.exit()
}

main()
