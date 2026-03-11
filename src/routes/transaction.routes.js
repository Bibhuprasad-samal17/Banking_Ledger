const {router} = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const transactionController = require("../controllers/transaction.controller");



const transactionRoutes = router();


/**
 * - Create a new transaction
 *  -POST /api/transactions
 */



transactionRoutes.post("/" , authMiddleware.authMiddleware, transactionController.createTransaction)

module.exports = transactionRoutes;