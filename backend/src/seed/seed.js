import 'dotenv/config';

import connectDB from '../config/db.js';
import User from '../models/User.js';

async function seed() {
  await connectDB();
  await User.deleteMany({});

  await User.create([
    {
      name: 'Admin User',
      email: 'admin@edumerge.local',
      password: 'Admin123!',
      role: 'ADMIN',
    },
    {
      name: 'Admission Officer',
      email: 'officer@edumerge.local',
      password: 'Officer123!',
      role: 'ADMISSION_OFFICER',
    },
    {
      name: 'Management User',
      email: 'management@edumerge.local',
      password: 'Management123!',
      role: 'MANAGEMENT',
    },
  ]);

  console.log('Seeded demo users');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
