import mongoose from 'mongoose'

const humiditySchema = new mongoose.Schema({
  Timestamp: {
    type: Date,
    default: Date.now
  },
  Datetime: {
    type: Date,
    required: true
  },
  Air_Humidity: {
    type: Number,
    required: true
  }
})

export default mongoose.model('Humidity', humiditySchema)
