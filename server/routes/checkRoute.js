const express = require('express');
const { isPointWithinRadius } = require('geolib');
const Attendance = require('../models/Attendance');
const router = express.Router();
const cors = require('cors');

router.use(express.json());
router.use(cors());

const geofenceCenter = {
  latitude: 30.012,
  longitude: 77.88
};
const geofenceRadius = 300000;


router.post('/mark-attendance', async (req, res) => {
  const { userId, latitude, longitude, checkinTime } = req.body;

  if (!userId || !latitude || !longitude || !checkinTime) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }


  const insideGeofence = isPointWithinRadius(
    { latitude, longitude },
    geofenceCenter,
    geofenceRadius
  );

  if (insideGeofence) {

    const today = new Date().setHours(0, 0, 0, 0);
    let attendance = await Attendance.findOne({ date: today });

    if (!attendance) {

      attendance = new Attendance({
        date: today,
        data: [{ userId, status: 'present', checkin: checkinTime, checkout: null }],
      });
    } else {

      const existingEntry = attendance.data.find(entry => entry.userId.toString() === userId.toString());


      if (existingEntry) {
        return res.status(200).json({ success: true, message: 'Attendance already marked for today.' });
      }
      attendance.data.push({ userId, status: 'present', checkin: checkinTime, checkout: null });
    }

    try {
      await attendance.save();
      return res.json({ success: true, message: 'Attendance marked successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to save attendance.' });
    }
  } else {
    return res.status(403).json({ message: 'You are not within the geofence area.' });
  }
});


router.post('/mark-checkout', async (req, res) => {
  const { userId, checkoutTime } = req.body;

  if (!userId || !checkoutTime) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const today = new Date().setHours(0, 0, 0, 0);

  try {
    const attendance = await Attendance.findOne({ date: today });

    if (!attendance) {
      return res.status(404).json({ error: 'No attendance record found for today.' });
    }

    const existingEntry = attendance.data.find(entry => entry.userId.toString() === userId.toString());
    if (!existingEntry) {
      return res.status(404).json({ error: 'Attendance entry not found for user.' });
    }
    if(existingEntry.checkout){
      return res.status(200).json({ success: true, message: 'Checkout has already marked successfully!' });
    }
    existingEntry.checkout = checkoutTime;
    await attendance.save();
    return res.json({ success: true, message: 'Checkout marked successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to mark checkout.' });
  }
});

module.exports = router;
