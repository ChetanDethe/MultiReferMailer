const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');

dotenv.config();
const app = express();

// Middleware
app.use(cors(
  {
    origin: 'https://multi-refer-mailer-du8vjrblx-chetan-dethes-projects.vercel.app',
    credentials: true,
  }
));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(express.static('public')); // Add this if you have a public folder

// MongoDB Connection
mongoose.connect('mongodb+srv://chetandethe9999:12345@mycluster.vctxj.mongodb.net/MultiReferMailerDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));