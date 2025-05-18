import cron from 'node-cron'
import { fetchAndStoreDataDirectWeather } from '../controllers/WeatherController.js'
import { fetchAndStoreDataPerairanDirect } from '../controllers/PerairanController.js'
import { fetchAndStoreDataPressureDirect } from '../controllers/SurfaceController.js'
import { fetchAndStoreDataTideDirect } from '../controllers/TideController.js'

cron.schedule('0 20 * * *', () => {
  console.log('⏰ CRON: Memanggil fetchAndStoreDataDirect()')
  fetchAndStoreDataDirectWeather()
  fetchAndStoreDataPerairanDirect()
  fetchAndStoreDataPressureDirect()
  fetchAndStoreDataTideDirect()
}, {
  timezone: 'Asia/Jakarta'
})