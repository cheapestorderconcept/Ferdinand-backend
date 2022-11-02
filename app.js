require('dotenv').config()
const express = require('express');
const res = require('express/lib/response');
const { databaseAuthentication } = require('./config/database');
const app = express();
const cors = require('cors');
const appRouter = require('./routes/routes');

const adminRoutes = require('./routes/admin-routes');

app.use(express.json());
app.set("view engine", "ejs");
app.use(cors());
app.use('/api/v1/admin/',adminRoutes)
app.use('/api/v1/client', appRouter)


app.use((error,req,res,next)=>{
  if (res.headerSent) {
      return next(error)
  } else {
     if (error.code=='LIMIT_FILE_SIZE') {
      res.status(400).json({response_message:'The file exceed the permited size'});
     }else{
      res.status(error.status_code || 500).json({ status_code: error.status_code, response_message: error.response_message || 'An unknown error occured' });  
     }
    
  }
});

databaseAuthentication().then(()=>{
console.log('database connected');
}).catch((err)=>{
  console.log(err);
});



app.use((req,res)=>{
  res.status(404).json({responseMessage: 'The routes you requested does not exists on this server. Check routes or your request method'})
})
app.listen(process.env.PORT||4900,()=>{
  console.log('server started on port 4900');
})