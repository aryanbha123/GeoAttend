const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = 3000;
const URI = "mongodb+srv://aryanbhandari4077:qHiT2RmS7y343QC7@cluster0.wqexvgn.mongodb.net/geo?retryWrites=true&w=majority&appName=Cluster0"


const allowedOrigins = ['http://localhost:3001','https://employee-geo-tracking.vercel.app/'];

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

// app.get('/', (req, res) => {
//     res.send("Server Live");
// });

app.listen(port, () => {
    console.log("Server Running")
})
mongoose.connect(URI).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => console.log(err));


