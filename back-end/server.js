require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose'); // Import mongoose
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const port = process.env.PORT || 9999;
const routes = require('./route');
const menuRoutes = require('./route/menu.route'); // Import menu routes
const orderRoutes = require('./route/order.route'); // Import order routes

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', routes);
app.use('/menu', menuRoutes); // Use menu routes
app.use('/order', orderRoutes); // Use order routes

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
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});