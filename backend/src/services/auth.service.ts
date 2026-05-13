import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { env } from '../config/env';
import { JwtUserPayload, UserRow } from '../types/auth.types';

export async function loginUser(email: string, password: string) {
  const [rows] = await db.query<UserRow[]>(
    `
      SELECT user_id, name, email, password_hash, role, phone, status, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  const user = rows[0];

  if (!user) {
    return null;
  }

  if (user.status !== 'active') {
    throw new Error('Account is inactive.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return null;
  }

  const payload: JwtUserPayload = {
    userId: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);

  return {
    token,
    user: payload,
  };
}

export async function getUserById(userId: number) {
  const [rows] = await db.query<UserRow[]>(
    `
      SELECT user_id, name, email, password_hash, role, phone, status, created_at
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `,
    [userId],
  );

  const user = rows[0];

  if (!user) return null;

  return {
    userId: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    status: user.status,
  };
}
