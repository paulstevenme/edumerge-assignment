require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const masterRoutes = require('./routes/masterRoutes');
const programRoutes = require('./routes/programRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
