const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 6169;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Routes
app.get('/api/test', (req, res) => {
  res.json({ body: 'test ok3' });
});

app.post('/api/transaction', async (req, res) => {
  try {
    const { price, name, description, datetime } = req.body;

    // Validate input fields
    if (!price || !name || !description || !datetime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = new Transaction({
      price,
      name,
      description,
      datetime
    });

    const savedTransaction = await transaction.save();
    res.json(savedTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});