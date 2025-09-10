import mongoose from 'mongoose'

const userRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
    unique: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  aadharNumber: {
    type: String,
    required: true,
    match: /^[0-9]{12}$/,
    unique: true
  },
  photoUrl: {
    type: String, // Google Cloud Storage URL
    required: true, // Made required since photo capture is mandatory
  },
  embedding: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true
})

// userRegistrationSchema.index({ mobile: 1 })
// userRegistrationSchema.index({ aadharNumber: 1 })
userRegistrationSchema.index({ createdAt: -1 })

export const User = mongoose.models.User || mongoose.model('User', userRegistrationSchema)