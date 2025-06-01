import axios from 'axios'
import nodemailer from 'nodemailer'
import Humidity from '../models/humidity.js'
import Temperature from '../models/temperature.js'
import Weather from '../models/weather.js'
import Wind from '../models/wind.js'

export const fetchAndStoreDataDirectWeather = async () => {
  try {
    console.log('🟢 [Direct] Mulai fetch data cuaca dari API')
    const response = await axios.get(process.env.API_URL)

    const cuaca = response.data.data[0]?.cuaca?.flat()
    if (!cuaca || cuaca.length === 0) throw new Error('Data cuaca tidak valid atau kosong')

    const gmt7OffsetMs = 7 * 60 * 60 * 1000
    const newDatetime = new Date(new Date(cuaca[0].datetime).getTime() + gmt7OffsetMs)

    const existingData = await Humidity.findOne()

    if (existingData && new Date(existingData.Datetime).getTime() === newDatetime.getTime()) {
      console.log('⏹️ Data cuaca belum berubah, tidak dilakukan pembaruan')
      return
    }

    await Promise.all([
      Humidity.deleteMany({}),
      Temperature.deleteMany({}),
      Weather.deleteMany({}),
      Wind.deleteMany({})
    ])
    console.log('🗑️ Data lama cuaca dihapus karena ada pembaruan')

    let successCount = 0

    for (const item of cuaca) {
      const common = {
        Timestamp: new Date(),
        Datetime: new Date(new Date(item.datetime).getTime() + gmt7OffsetMs)
      }

      await Promise.all([
        Humidity.create({ ...common, Air_Humidity: item.hu }),
        Temperature.create({ ...common, Temperature: item.t }),
        Weather.create({ ...common, Weathers_Category: item.weather_desc }),
        Wind.create({
          ...common,
          Degrees_Wind: item.wd_deg,
          Wind_From: item.wd,
          Wind_To: item.wd_to,
          Wind_Speed: item.ws
        })
      ])
      successCount++
    }

    console.log(`✅ Berhasil menyimpan ${successCount} data cuaca`)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: 'Weather Data Updated',
      text: `Data cuaca sebanyak ${successCount} berhasil diperbarui dan disimpan ke MongoDB.`
    })

    console.log('📧 [Direct] Email notifikasi cuaca berhasil dikirim')
  } catch (err) {
    console.error('❌ [Direct] Gagal fetch/simpan cuaca:', err.message)
  }
}
