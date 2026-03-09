const mongoose = require('mongoose')

const MealSchema = new mongoose.Schema({
    type: { type: String, required: true },
    count: { type: Number, default: 0 },
    note: { type: String, default: "" }
})

const UnitSchema = new mongoose.Schema({
    unitName: { type: String, required: true },
    meals: [MealSchema]
})

const DailyStatSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    isHoliday: { type: Boolean, default: false },
    units: [UnitSchema]
})

module.exports = mongoose.model('DailyStat', DailyStatSchema)