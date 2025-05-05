import 'dotenv/config'
import { connectDB } from '../db/mongodb.js'
import { fetchAndStoreDataDirect } from '../controllers/WeatherController.js'

const main = async () => {
  await connectDB()
  await fetchAndStoreDataDirect()
  process.exit()
}

main()
