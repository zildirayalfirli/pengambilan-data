import cron from 'node-cron'
import { fetchAndStoreDataDirect } from '../controllers/WeatherController.js'

cron.schedule('0 20 * * *', () => {
  console.log('⏰ CRON: Memanggil fetchAndStoreDataDirect()')
  fetchAndStoreDataDirect()
}, {
  timezone: 'Asia/Jakarta'
})