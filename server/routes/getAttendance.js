const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();

router.get('/attendance/:date', async (req, res) => {
    const { date } = req.params;

    try {
        // Convert the date string to a Date object
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1); // Set endDate to the next day

        // Find attendance records within the date range
        const attendanceRecords = await Attendance.findOne({
            date: { $gte: startDate, $lt: endDate },
        })

        console.log(attendanceRecords);

        // Respond with the records
        res.json({attendanceRecords});
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
