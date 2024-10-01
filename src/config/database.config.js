// import third pary liabery 
import mongoose from "mongoose";


// Database connection
export default async function connectDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/chatterApp');
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}