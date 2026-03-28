import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import connectDB from './config/db.js';
import admissionRoutes from './routes/admissionRoutes.js';
import applicantRoutes from './routes/applicantRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import programRoutes from './routes/programRoutes.js';

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
