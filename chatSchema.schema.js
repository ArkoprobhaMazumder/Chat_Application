import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    message: String,
    timeStamp: {
        type: Date,
        defaults: new Date()
    }
})

const chatModel = mongoose.model('Chat', chatSchema);
export default chatModel;