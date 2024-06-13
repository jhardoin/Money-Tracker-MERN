const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4040;
const Transaction = require('./models/Transaction.js');
const mongoose = require('mongoose');

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.get('/api/test', (request, response) => {
  response.json({ body: 'test ok3' });
});

app.post('/api/transaction', async (request, response) => {
  try {
    const { price, name, description, datetime } = request.body;
    console.log('Request body:', request.body);

    // Ensure all required fields are present
    if (!price || !name || !description || !datetime) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    // Create a new transaction
    const transaction = new Transaction({
      price,
      name,
      description,
      datetime
    });

    // Save the transaction to the database
    const savedTransaction = await transaction.save();
    response.json(savedTransaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    response.status(500).json({ error: 'Failed to save transaction' });
  }
});

app.get('/api/transactions', async (request, response) =>{
    await mongoose.connect(process.env.MONGO_URL)
    const transactions = await Transaction.find({})
    response.json(transactions)
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//moneytracker
//mongodb+srv://moneytracker:rKUV7lCC5SjKbFBD@cluster0.tnz4vwu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//rKUV7lCC5SjKbFBD