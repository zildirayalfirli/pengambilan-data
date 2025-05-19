import mongoose from 'mongoose'

const weatherSchema = new mongoose.Schema({
  Timestamp: {
    type: Date,
    default: Date.now
  },
  Datetime: {
    type: Date,
    required: true
  },
  Weathers_Category: {
    type: String,
    required: true
  },
    Air_Humidity: {
    type: Number,
    required: true
  },
    Temperature: {
    type: Number,
    required: true
  }
})

export default mongoose.model('Weather', weatherSchema)
