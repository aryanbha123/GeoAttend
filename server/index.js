const express = require('express');
const app = express();
const mongoose =  require('mongoose')
const port = 3000;
const URI = "mongodb+srv://aryanbhandari4077:qHiT2RmS7y343QC7@cluster0.wqexvgn.mongodb.net/geo?retryWrites=true&w=majority&appName=Cluster0"



app.get('/' , (req,res)=>{
    res.send("Server Live");
});

app.listen(port,()=>{
    console.log("Server Running")
})
mongoose.connect(URI).then(()=>{
    console.log('Connected to MongoDB')
}).catch(err=>console.log(err));


