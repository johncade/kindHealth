import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventModel = new Schema({
  date: {
    type: Date
  },
  user: {
    type: String
  },
  type: {
    type: String
  },
  message: {
    type: String
  },
  otheruser: {
    type: String
  }
}, {
  versionKey: false
})
export default mongoose.model('events', eventModel)