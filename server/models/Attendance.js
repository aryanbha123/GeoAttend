const mongoose = require('mongoose');

// Define the attendance schema
const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now  
  },
  data: [
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
      },
      status: {
        type: String,
        default: 'present'  
      },
      checkin: {
        type: String,
        required: true
      },
      checkout: {
        type: String, 
        default: null  
      }
    }
  ]
});

// Export the model
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
