import axios from 'axios';
import nodemailer from 'nodemailer';
import TideHeight from '../models/tideHeight.js';

export const fetchAndStoreDataTideDirect = async () => {
  try {
    console.log('🟢 [Direct] Mulai fetch data tide height dari API');
    const response = await axios.get(process.env.API_URL_TIDE);

    const times = response.data.hourly.time;
    const tides = response.data.hourly.sea_level_height_msl;

    if (!Array.isArray(times) || !Array.isArray(tides) || times.length !== tides.length) {
      throw new Error('Data tide height tidak valid atau kosong');
    }

    await TideHeight.deleteMany({});
    console.log('🗑️ Semua data lama tide height lama berhasil dihapus');

    const entries = times.map((time, index) => {
    const originalTime = new Date(time);
    const correctedTime = new Date(originalTime.getTime() + (7 * 60 * 60 * 1000));

    return {
        Timestamp: new Date(),
        Datetime: correctedTime,
        Tide_Height: tides[index]
    };
    });

    await TideHeight.insertMany(entries);
    console.log(`✅ Berhasil menyimpan ${entries.length} data tide height`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: 'Tide Height Data Updated',
      text: `Data tide height sebanyak ${entries.length} berhasil diperbarui dan disimpan ke MongoDB.`
    });

    console.log('📧 [Direct] Email notifikasi tide height berhasil dikirim');
  } catch (err) {
    console.error('❌ [Direct] Gagal fetch/simpan tide height:', err.message);
  }
};
