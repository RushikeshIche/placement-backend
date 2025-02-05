const express = require("express");
require("dotenv").config()
const cors = require("cors")
const app = express()
const http = require("http"); 
const passport = require('passport');
require('./config/passport');  // Import passport configuration

app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(passport.initialize());


const dbconnection = require("./config/database")
const router = require("./routes/router")
const PORT= process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const adminRouter = require("./routes/adminAuthRouter");

app.use(cookieParser());

dbconnection();

app.use("/api",router);
app.use("/api/admin",adminRouter)

app.all('*',(req,res,next)=>{
  const err = new Error(`Cant fint ${req.originalUrl} on the server `)
  err.statusCode = 404
  err.message = 'Not Found'
  next(err)
})

const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });

};

// Use the global error handler
app.use(errorHandler);


app.get('/',()=>{

  app.use(express.static(path.resolve(__dirname,'my-app','build')))
  res.sendFile(path.resolve(__dirname,'my-app','build','index.html'))

})


app.get("/", (req, res) => {
  res.send("API is working");
});



// Create HTTP server and initialize Socket.io
const server = http.createServer(app);


init(server);



server.listen(PORT,()=>{
    console.log("app is listening on port no. ",PORT)
})

