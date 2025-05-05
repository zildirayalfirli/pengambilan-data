import mongoose from 'mongoose'

const temperatureSchema = new mongoose.Schema({
  Timestamp: {
    type: Date,
    default: Date.now
  },
  Datetime: {
    type: Date,
    required: true
  },
  Temperature: {
    type: Number,
    required: true
  }
})

export default mongoose.model('Temperature', temperatureSchema)
