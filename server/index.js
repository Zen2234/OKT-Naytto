require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const statsRoutes = require('./routes/stats')

const app = express()
app.use(cors())
app.use(express.json())

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err))

app.use('/api/auth', authRoutes)
app.use('/api/stats', statsRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})