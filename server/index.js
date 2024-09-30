const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = 3000;
const URI = "mongodb+srv://aryanbhandari4077:qHiT2RmS7y343QC7@cluster0.wqexvgn.mongodb.net/geo?retryWrites=true&w=majority&appName=Cluster0"


const corsOptions = {
    origin: 'https://geo-attend-client.vercel.app/', // The origin of your frontend app
    credentials: true, // Allow cookies and credentials to be sent
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());
app.use(require('./routes/auth'));
app.use(require('./routes/userRoutes'));
app.get('/', (req, res) => {
    res.send("Server Live");
});

app.listen(port, () => {
    console.log("Server Running")
})
mongoose.connect(URI).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => console.log(err));


