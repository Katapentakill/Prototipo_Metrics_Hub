'use server';

import Database from 'better-sqlite3';
import { join } from 'path';
import { User } from '@/lib/types/types';

function getDatabase(): Database.Database {
  const isDev = process.env.NODE_ENV === 'development';
  const dbPath = join(process.cwd(), 'data', 'volunteers.db');
  
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  return db;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: User;
  redirectPath?: string;
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    if (!email.includes('@')) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT 
        u.*,
        p.first_name,
        p.last_name,
        p.country,
        p.city
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.email = ? AND u.status = 'active'
    `);
    
    const result = stmt.get(email) as any;

    if (!result) {
      db.close();
      return {
        success: false,
        error: 'Usuario no encontrado o inactivo'
      };
    }

    if (result.password !== password) {
      db.close();
      return {
        success: false,
        error: 'Contraseña incorrecta'
      };
    }

    const updateStmt = db.prepare(`
      UPDATE users 
      SET last_login = datetime('now') 
      WHERE id = ?
    `);
    updateStmt.run(result.id);

    const user: User = {
      id: result.id,
      email: result.email,
      password: result.password,
      name: result.name,
      role: result.role,
      status: result.status,
      avatar: result.avatar,
      email_verified: result.email_verified,
      created_at: result.created_at,
      last_login: result.last_login
    };

    db.close();

    const redirectPaths = {
      admin: '/admin/dashboard',
      hr: '/hr/dashboard',
      lead_project: '/lead_project/projects',
      volunteer: '/volunteer/profile',
      unassigned: '/volunteer/profile'
    };

    return {
      success: true,
      user,
      redirectPath: redirectPaths[user.role]
    };

  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}