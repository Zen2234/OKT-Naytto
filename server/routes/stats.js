const express = require('express')
const router = express.Router()
const DailyStat = require('../models/DailyStat')
const authToken = require('../middleware/auth')

router.get('/', async (req, res) => {
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

router.post('/daily', authToken, async (req, res) => {
    try {
        const newDay = new DailyStat(req.body)
        await newDay.save()
        res.status(201).json(newDay)
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Day already exists or invalid data' })
    }
})

// This should update just one meal in case of mistakes, instead of having to overwrite the entire day
router.patch('/update-count', authToken, async (req, res) => {
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
                $set: { "units.$[u].meals.$[m].count": newCount }
            },
            {
                arrayFilters: [{ "u.unitName": unitName }, { "m.type": mealType }],
                new: true,
                runValidators: true
            }
        )

        if (!updated) return res.status(404).json({ error: 'Record not found' })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router