const express = require('express');
const { PrismaClient } = require('@prisma/client');
const swaggerUi=require('swagger-ui-express')
const swaggerDocument=require('./swagger.json') 

const app = express();
const port = 3001;
app.use(cors())
app.use(express.json());
