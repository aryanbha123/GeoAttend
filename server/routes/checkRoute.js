const express = require('express');
const { isPointWithinRadius } = require('geolib');
const Attendance = require('./models/Attendance');
const app = express();
app.use(express.json());
app.use(require('cors')());


const geofenceCenter = {
  latitude: 28.7041,
  longitude: 77.1025,
};
const geofenceRadius = 500;

app.post('/mark-attendance', async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const insideGeofence = isPointWithinRadius(
    { latitude, longitude },
    geofenceCenter,
    geofenceRadius
  );

  if (insideGeofence) {
    const attendance = new Attendance({
      userId,
      coordinates: { latitude, longitude }
    });

    try {
      await attendance.save();
      return res.json({ success: true, message: 'Attendance marked successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save attendance.' });
    }
  } else {
    return res.status(403).json({ error: 'You are not within the geofence area.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
