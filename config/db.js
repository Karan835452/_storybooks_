const mongoose=require('mongoose');
// this file is ffor making db connection

//  async is like mongoose.connect....
const connectDB = async()=>{
    try {
        // first argument as the connection string from config,env
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            //The keyword await before a function makes the function wait for a promise
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
            // this above three second argument is to avoid any warning in console
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err);
        process.exit(1);
        //stop the process after here   
    }
}
module.exports=connectDB
// exporting this connectDB bcz of which we can use it in appjs file