
const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema({
    CallId: {
        type: String, required: true
    },
    CreatorEmail: {
        type: String, required: true
    },
    CreatorUsername: {
        type: String, required: true
    },
    ReceiverEmail: {
        type: String,
    },
    ReceiverUsername: {
        type: String,
    },
    CallStatus: {
        type: String, required: true
    },
    ChannelName: {
        type: String, required: true
    },
    CreateDate: { 
        type: String, required: true 
    },
    ReceiveDate: {
        type: String
    }
});
//we dont export model because we only 
//need to run this code only single time.
mongoose.model("CallLog" , callLogSchema);