import mongoose from 'mongoose'

const tideHeightSchema = new mongoose.Schema({
    Timestamp: {
        type: Date,
        default: Date.now
  },
    Datetime: {
        type: Date,
        required: true
  },
    Tide_Height: {
        type: Number,
        required: true
  }
})

export default mongoose.model('TideHeight', tideHeightSchema)
