import axios from 'axios'
import nodemailer from 'nodemailer'
import Humidity from '../models/humidity.js'
import Temperature from '../models/temperature.js'
import Weather from '../models/weather.js'
import Wind from '../models/wind.js'

export const fetchAndStoreDataDirect = async () => {
  try {
    console.log('🟢 [Direct] Mulai fetch dari API')
    const response = await axios.get(process.env.API_URL)

    const cuaca = response.data.data[0]?.cuaca?.flat()
    if (!cuaca) throw new Error('Data cuaca kosong')

    await Promise.all([
      Humidity.deleteMany({}),
      Temperature.deleteMany({}),
      Weather.deleteMany({}),
      Wind.deleteMany({})
    ])
    console.log('🗑️ Semua data lama berhasil dihapus')

    for (const item of cuaca) {
      const common = {
        Timestamp: new Date(),
        Datetime: new Date(item.datetime)
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
    }

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
      text: `Data cuaca berhasil diperbarui dan disimpan ke MongoDB.`
    })

    console.log('📧 [Direct] Email berhasil dikirim')
  } catch (err) {
    console.error('❌ [Direct] Gagal fetch & simpan:', err.message)
  }
}
