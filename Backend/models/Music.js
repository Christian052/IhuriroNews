// models/Music.js
const mongoose = require('mongoose')

const MusicSchema = new mongoose.Schema({
  youtubeUrl: { type: String, required: true }
})

const Music = mongoose.model('Music', MusicSchema)

module.exports = Music
