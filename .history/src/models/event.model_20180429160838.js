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
  }
})