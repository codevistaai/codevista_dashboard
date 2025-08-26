
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users, userSessions, type User, type InsertUser } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SESSION_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 hours

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const newUsers = await db.insert(users).values({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isVerified: true // Auto-verify for now
    }).returning();

    return newUsers[0];
  }

  static async loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
    // Find user
    const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (foundUsers.length === 0) {
      return null;
    }

    const user = foundUsers[0];

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Create session
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
    await db.insert(userSessions).values({
      userId: user.id,
      token,
      expiresAt
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      },
      token
    };
  }

  static async validateSession(token: string): Promise<AuthUser | null> {
    try {
      // Verify JWT token
      const payload = this.verifyToken(token);
      if (!payload) {
        return null;
      }

      // Check session in database
      const sessions = await db.select({
        userId: userSessions.userId,
        expiresAt: userSessions.expiresAt
      }).from(userSessions)
        .where(and(
          eq(userSessions.token, token),
          gt(userSessions.expiresAt, new Date())
        ))
        .limit(1);

      if (sessions.length === 0) {
        return null;
      }

      // Get user data
      const foundUsers = await db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
      }).from(users)
        .where(eq(users.id, sessions[0].userId))
        .limit(1);

      if (foundUsers.length === 0) {
        return null;
      }

      return foundUsers[0];
    } catch {
      return null;
    }
  }

  static async logoutUser(token: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.token, token));
  }

  static async cleanExpiredSessions(): Promise<void> {
    await db.delete(userSessions).where(gt(new Date(), userSessions.expiresAt));
  }
}
