import bcrypt from 'bcryptjs';
import { db } from '../config/database';

async function seedUsers() {
  const users = [
    {
      name: 'ParcelX Admin',
      email: 'admin@parcelx.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '012-000 0001',
    },
    {
      name: 'ParcelX Driver',
      email: 'driver@parcelx.com',
      password: 'Driver@123',
      role: 'driver',
      phone: '012-000 0002',
    },
    {
      name: 'ParcelX Staff',
      email: 'staff@parcelx.com',
      password: 'Staff@123',
      role: 'staff',
      phone: '012-000 0003',
    },
    {
      name: 'ParcelX Customer',
      email: 'customer@parcelx.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '012-000 0004',
    },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    await db.execute(
      `
        INSERT INTO users (name, email, password_hash, role, phone, status)
        VALUES (?, ?, ?, ?, ?, 'active')
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password_hash = VALUES(password_hash),
          role = VALUES(role),
          phone = VALUES(phone),
          status = 'active'
      `,
      [user.name, user.email, passwordHash, user.role, user.phone],
    );

    console.log(`Seeded: ${user.email} / ${user.password}`);
  }

  await db.end();
}

seedUsers()
  .then(() => {
    console.log('User seed completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('User seed failed:', error);
    process.exit(1);
  });
