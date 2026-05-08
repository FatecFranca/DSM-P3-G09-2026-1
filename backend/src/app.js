const express = require('express');
const { PrismaClient } = require('@prisma/client');


const app = express();
const port = 3001;

app.use(express.json());

module.exports = app;