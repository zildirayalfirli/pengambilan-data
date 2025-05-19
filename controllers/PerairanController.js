import axios from 'axios'
import nodemailer from 'nodemailer'
import Warning from '../models/warning.js'
import WaveHeight from '../models/waveHeight.js'

export const fetchAndStoreDataPerairanDirect = async () => {
  try {
    console.log('🟢 [Direct] Mulai fetch data perairan dari API')
    const response = await axios.get(process.env.API_URL_PERAIRAN);

    const perairan = response.data.data;
    if (!Array.isArray(perairan) || perairan.length === 0) {
    throw new Error('Data perairan tidak valid atau kosong');
    }

    await Promise.all([
      Warning.deleteMany({}),
      WaveHeight.deleteMany({}),
    ])
    console.log('🗑️ Semua data lama perairan berhasil dihapus')

    const gmt7OffsetMs = 7 * 60 * 60 * 1000;
    let successCount = 0;

    for (const item of perairan) {
      const common = {
        Timestamp: new Date(),
        Datetime: new Date(new Date(item.valid_from).getTime() + gmt7OffsetMs)
      };

      await Promise.all([
        Warning.create({ ...common, Warning_Desc: item.warning_desc }),
        WaveHeight.create({
          ...common,
          Wave_Category: item.wave_cat,
          Wave_Height: item.wave_desc,
        })
      ]);
      successCount++;
    }

    console.log(`✅ Berhasil menyimpan ${successCount} data perairan`);

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
      subject: 'Perairan Data Updated',
      text: `Data perairan sebanyak ${successCount} berhasil diperbarui dan disimpan ke MongoDB.`
    });

    console.log('📧 [Direct] Email notifikasi perairan berhasil dikirim')
  } catch (err) {
    console.error('❌ [Direct] Gagal fetch/simpan perairan:', err.message)
  }
}
