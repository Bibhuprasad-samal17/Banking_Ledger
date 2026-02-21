const mongoose = require('mongoose');


const accoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            MESSAGE: "sTATUS CAN BE EITHER ACTIVE, FROZEN OR CLOSED"

        }
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "INR"
    },
},
    {
        timestamps: true
    }
)
accountSchema.index ({ user: 1, currency: 1 })

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel;