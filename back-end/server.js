require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose'); // Import mongoose
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./route');
const menuRoutes = require('./route/menu.route'); // Import menu routes

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api', routes);
app.use('/menu', menuRoutes); // Use menu routes

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});