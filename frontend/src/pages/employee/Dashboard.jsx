import React, { useState } from 'react';
import axios from 'axios';

function Attendance() {
  const [status, setStatus] = useState('');

  const markAttendance = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude,longitude);
        const userId = '66fa87be716c7ce9a774248c';
        console.log(userId);
        // {
        //     "userId": "66fa87be716c7ce9a774248c",
        //     "latitude" :"30.342764",
        //     "longitude" : "77.888023",
        //     "checkinTime":"9:00 A.M"
        // }

        try {
          const response = await axios.post('http://localhost:3000/mark-attendance', {
            
                userId: "66fa87be716c7ce9a774248c",
                latitude :"30.342764",
                longitude : "77.888023",
                checkinTime:"9:00 A.M"
            
          });

          if (response.data.success) {
            setStatus('Attendance marked successfully.');
          } else {
            setStatus('Error: ' + response.data.message);
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
