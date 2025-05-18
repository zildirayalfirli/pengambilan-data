import mongoose from 'mongoose'

const surfacePressureSchema = new mongoose.Schema({
    Timestamp: {
        type: Date,
        default: Date.now
    },
    Datetime: {
        type: Date,
        required: true
    },
    Surface_Pressure: {
        type: Number,
        required: true
    }
})

export default mongoose.model('SurfacePressure', surfacePressureSchema)
