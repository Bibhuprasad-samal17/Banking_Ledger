const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require("../services/email.service")
const mongoose = require("mongoose")


/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
*/


// Step 1: Validate request
async function createTransaction(req, res) {

    const { fromAccount, toAccount, ammount, idempotencyKey } = req.body;


    if (!fromAccount || !toAccount || !ammount || !idempotencyKey) {

        return res.status(400).json({
            message: "From account, to account, ammount and idempotency key are required."

        })
    }
    const fromuserAccount = await accountModel.findOne({
        _id: fromAccount
    });
    const touserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if(!fromuserAccount || !touserAccount) {

        return res.status(404).json({
            message: "Invalid from or to account."
        })
    }

// Step 2: Validate idempotency key

    const isTransactionAlreadyExists = await transactionModel.findOne ({
        idempotencyKey: idempotencyKey
    })
    if(isTransactionAlreadyEists) {
        if(isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(400).json({
                message: "Transaction already completed."
            })
        }
        if(isTransactionModelExists.status === "PENDING") {
            return res.status(200).json({
            message: "Transaction is pending. Please wait."
            })
        }
        if(isTransactionAlreadyExists.status === "FAILED") {
            return res.status(400).json({
                message: "Transaction already failed. Please try again."
            })
        }
        if(isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction already reversed. Please try again."
            })
        }
    }
// Step 3: Check account status

    if(fromuserAccount.status !== "ACTIVE" || touserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both accounts must be active to perform a transaction."
        })
    }

// Step 4: Derive sender balance from ledger

    const balance = await fromuserAccount.getBalance()

    if(balance < ammount) {
        res.status(400).json({
            message: `Insufficient balance. Current Balance is ${balance}. 
            Required balance is ${ammount}.`
        })
    }

// Step 5: Create transaction (PENDING)


}   