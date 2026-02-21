const express = require('express');
const cookieParser = require("cookie-parser");

const accountRoutes = require('./account.routes');
const accountRouter = require('./account.routes');

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);


module.exports = app;