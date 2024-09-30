import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

function Attendance() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout ,user } = useAuth();

  const markAttendance = () => {
    if (navigator.geolocation) {
      setIsSubmitting(true); // Disable button while submitting
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const userId = `${user.userId}`; // Ideally, get this from the authenticated user

          try {
            const response = await axios.post('http://localhost:3000/mark-attendance', {
              // userId:userId,
              // latitude: 30.342764,
              // longitude: 77.888023,
              // checkinTime: new Date().toLocaleTimeString() // Get the current time dynamically
              userId:"66fa87be716c7ce9a774248c",
              latitude: "30.342764",
              longitude: "77.888023",
              checkinTime : "9:00 A.M"
            });

            if (response.data.success) {
              setStatus("aTTEND");
            } else {
              setStatus('Error: ' + response.data.message);
            }
          } catch (error) {
            setStatus('Failed to mark attendance.');
          } finally {
            setIsSubmitting(false); // Re-enable button after submission
          }
        },
        (error) => {
          setStatus('Failed to retrieve location.');
          setIsSubmitting(false);
        }
      );
    } else {
      setStatus('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <h1>Geofence Attendance System</h1>
      <button
        className='bg-black px-2 py-1 text-white shadow-md'
        onClick={markAttendance}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Marking...' : 'Mark Attendance'}
      </button>
      {status && <p>{status}</p>}

      <button onClick={logout} className='mt-4'>Logout</button>
    </div>
  );
}

export default Attendance;
