const express=require("express");
const dotenv=require('dotenv')
const path=require('path')
const mongoose = require('mongoose')
const morgan=require('morgan')
//a middleware whic will help us logging with diff level
const  exphbs=require('express-handlebars');
const passport=require('passport');
const session=require('express-session')
const MongoStore = require("connect-mongo")

const connectDB=require('./config/db')



// Load config
dotenv.config({path:'./config/config.env'})


//passport config
require('./config/passport')(passport)

// call conectdatabase function to connect the data base
connectDB();


const app=express();

//Body parser
app.use(express.urlencoded({extended:false}));
//this one is to take the data in json formate but we are not gonna use here
app.use(express.json());
//logging

app.use(express.static(path.join(__dirname,'public')))
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}


//handelbar helper
const {formatDate,stripTags,truncate,editIcon}=require('./helpers/hbs')


//expres-handelbares
app.engine('.hbs', exphbs({ helpers:{formatDate,stripTags,truncate,editIcon,},defaultLayout:'main', extname:'.hbs'}));
app.set('view engine', '.hbs');

//session  
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongooseConnection : mongoose.connection }),
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI  //(URI FROM.env file)
      })
})
)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//inroder to work with session we need to imoprt installed express session middleware


// Set gloabal user

app.use(function(req , res,next){
    res.locals.user=req.user || null
    next()
})



//Routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));

const PORT=process.env.PORT ||5000;
app.listen(PORT,console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
