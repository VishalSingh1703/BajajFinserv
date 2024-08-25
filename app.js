const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bfhl_api')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = mongoose.model('User', {
  user_id: String,
  email: String,
  roll_number: String
});

app.post('/bfhl', async (req, res) => {
  try {
    const { data } = req.body;
    
    const user = await User.findOne();
    
    if (!user) {
      return res.status(404).json({ is_success: false, error: "User not found" });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item) && item.length === 1);
    const highest_lowercase = alphabets
      .filter(char => char.toLowerCase() === char)
      .sort((a, b) => b.localeCompare(a))[0];

    const response = {
      is_success: true,
      user_id: user.user_id,
      email: user.email,
      roll_number: user.roll_number,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highest_lowercase ? [highest_lowercase] : []
    };

    res.json(response);
  } catch (error) {
    res.status(400).json({ is_success: false, error: error.message });
  }
});

app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));