const mongoose = require("mongoose")

const blackListSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [ true, "Token is required" ],
            unique: true,
            index: true
        }
    },
    {
        timestamps: true
    }
)

const blackListModel = mongoose.model("blackList", blackListSchema)

module.exports = blackListModel
