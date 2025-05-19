import mongoose from 'mongoose'

const waveHeightSchema = new mongoose.Schema({
    Timestamp: {
    type: Date,
    default: Date.now
  },
    Datetime: {
    type: Date,
    required: true
  },
    Wave_Category: {
    type: String,
    required: true
  },
    Wave_Height: {
    type: String,
    required: true
  },
})

export default mongoose.model('WaveHeight', waveHeightSchema)
