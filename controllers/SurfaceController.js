import axios from 'axios';
import nodemailer from 'nodemailer';
import SurfacePressure from '../models/surfacePressure.js';

export const fetchAndStoreDataPressureDirect = async () => {
  try {
    console.log('🟢 [Direct] Mulai fetch data surface pressure dari API');
    const response = await axios.get(process.env.API_URL_PRESSURE);

    const times = response.data.hourly.time;
    const pressures = response.data.hourly.surface_pressure;

    if (!Array.isArray(times) || !Array.isArray(pressures) || times.length !== pressures.length) {
      throw new Error('Data surface pressure tidak valid atau kosong');
    }

    await SurfacePressure.deleteMany({});
    console.log('🗑️ Semua data lama surface pressure lama berhasil dihapus');

    const entries = times.map((time, index) => {
    const originalTime = new Date(time);
    const correctedTime = new Date(originalTime.getTime() + (7 * 60 * 60 * 1000));

    return {
        Timestamp: new Date(),
        Datetime: correctedTime,
        Surface_Pressure: pressures[index]
    };
    });

    await SurfacePressure.insertMany(entries);
    console.log(`✅ Berhasil menyimpan ${entries.length} data surface pressure`);

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
      subject: 'Surface Pressure Data Updated',
      text: `Data surface pressure sebanyak ${entries.length} berhasil diperbarui dan disimpan ke MongoDB.`
    });

    console.log('📧 [Direct] Email notifikasi surface pressure berhasil dikirim');
  } catch (err) {
    console.error('❌ [Direct] Gagal fetch/simpan surface pressure:', err.message);
  }
};
