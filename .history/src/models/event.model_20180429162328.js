import mongoose from 'mongoose'

const Schema = mongoose.Schema

export default new Schema({
  date: {
    type: Date
  },
  user: {
    type: String
  },
  type: {
    type: String
  },
  comment: {
    type: String
  },
  otheruser: {
    type: String
  }
})