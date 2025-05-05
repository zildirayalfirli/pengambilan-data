import mongoose from 'mongoose'

const windSchema = new mongoose.Schema({
  Timestamp: {
    type: Date,
    default: Date.now
  },
  Datetime: {
    type: Date,
    required: true
  },
  Degrees_Wind: {
    type: Number,
    required: true
  },
  Wind_From: {
    type: String,
    required: true
  },
  Wind_To: {
    type: String,
    required: true
  },
  Wind_Speed: {
    type: Number,
    required: true
  }
})

export default mongoose.model('Wind', windSchema)
