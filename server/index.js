const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = 3000;
// const URI = "mongodb+srv://aryanbhandari4077:qHiT2RmS7y343QC7@cluster0.wqexvgn.mongodb.net/geo?retryWrites=true&w=majority&appName=Cluster0"
// const URI = "mongodb+srv://tonsvalleyeducationtrustorg:tI9MbnL0xrVtketb@cluster0.ym6ob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const URI = "mongodb+srv://tonsvalleyeducationtrustorg:tI9MbnL0xrVtketb@cluster0.ym6ob.mongodb.net/"

const path = require('path');

const allowedOrigins = ['http://localhost:3001'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware setup
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/checkRoute'));
app.use(require('./routes/getAttendance'))
// app.get('/', (req, res) => {
//     res.send("Server Live");
// });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      res.status(err.status).end();
    }
  });
});

app.get('/:id',(req,res)=>{
  const id = req.params.id;
  
})
app.listen(port, () => {
  console.log("Server Running")
})
mongoose.connect(URI).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => console.log(err));


