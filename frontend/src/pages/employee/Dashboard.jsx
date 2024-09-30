import React, { useState } from 'react';
import axios from 'axios';

function Attendance() {
  const [status, setStatus] = useState('');

  const markAttendance = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const username = 'USER123';

        try {
          const response = await axios.post('http://localhost:5000/mark-attendance', {
            username,
            latitude,
            longitude,
          });

          if (response.data.success) {
            setStatus('Attendance marked successfully.');
          } else {
            setStatus('Error: ' + response.data.error);
          }
        } catch (error) {
          setStatus('Failed to mark attendance.');
        }
      });
    } else {
      setStatus('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <h1>Geofence Attendance System</h1>
      <button className='bg-black px-2 py-1 text-white shadow-md ' onClick={markAttendance}>Mark Attendance</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default Attendance;
