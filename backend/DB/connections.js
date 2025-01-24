
const mongoose = require('mongoose')

const connection_string = process.env.connection_string;

mongoose.connect(connection_string).then(()=>{
    console.log("MongoDB Atlas Connected Successfully to Learning Management System");
    
}).catch((err)=>{
    console.log("MongoDB connection failed",err);
    
})








