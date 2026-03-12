require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const DailyStat = require('./models/DailyStat')

const app = express()

app.use(cors())
app.use(express.json())

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err))

app.get('/api/stats', async (req, res) => {
    const { startDate, endDate } = req.query
    try {
        let query = {}

        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate }
        }

        const stats = await DailyStat.find(query).sort({ date: 1 })
        res.json(stats)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/daily', async (req, res) => {
    try {
        const newDay = new DailyStat(req.body)
        await newDay.save()
        res.status(201).json(newDay)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Day already exists or invalid data' })
    }
})

// This should update just one meal in case of mistakes, instead of overwriting the entire day
app.patch('/api/update-count', async (req, res) => {
    let { date, unitName, mealType, newCount } = req.body

    const parsedCount = Number(newCount)

    if (isNaN(parsedCount) || parsedCount < 0) {
        return res.status(400).json({
            error: "Virheellinen syöte. Ole hyvä ja syötä vain numeroita."
        })
    }

    try {
        const updated = await DailyStat.findOneAndUpdate(
            {
                date: date,
                "units.unitName": unitName,
                "units.meals.type": mealType
            },
            {
                $set: { "units.$[u].meals$[m].count": newCount }
            },
            {
                arrayFilters: [{ "u.unitName": unitName }, { "m.type": mealType }],
                new: True,
                runValidators: true
            }
        )

        if (!updated) return res.status(404).json({ error: 'Record not found' })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})