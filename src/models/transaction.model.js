const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a from account"],
        index: true
        
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a to account"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED" , "reversed"],
            message: "Status can either PENDING, COMPLETED , FAILED OR REVERSED",
        },
        default: "PENDING"
    },
    ammount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction"],
        min: [ 0, "Amount must be a positive number"]

    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required"],
        index: true,
        unique: true 

    },
    
}, { timestamps: true })

const traansactionModel = mongoose.model("transaction", transactionSchema)

module.exports = traansactionModel