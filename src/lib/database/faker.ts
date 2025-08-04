// src/lib/database/faker.ts
import Database from 'better-sqlite3';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { randomBytes } from 'crypto';

// Función para obtener la base de datos (copia local para evitar import)
function getDatabase(): Database.Database {
  const isDev = process.env.NODE_ENV === 'development';
  const dbPath = isDev ? ':memory:' : join(process.cwd(), 'data', 'volunteers.db');
  
  // Crear directorio si no existe (solo para producción)
  if (!isDev) {
    const dbDir = dirname(dbPath);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
      console.log(`📁 Directorio creado: ${dbDir}`);
    }
  }
  
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  console.log(`🗄️ Base de datos ${isDev ? 'en memoria' : 'creada en: ' + dbPath}`);
  
  return db;
}

// Utilidades para generar datos aleatorios
function randomId(): string {
  return randomBytes(8).toString('hex');
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  // Formato SQLite: YYYY-MM-DD HH:MM:SS
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Datos de referencia
const COUNTRIES = [
  'Estados Unidos', 'México', 'Colombia', 'Argentina', 'España', 'Perú', 'Chile', 
  'Venezuela', 'Ecuador', 'Guatemala', 'Cuba', 'Bolivia', 'República Dominicana'
];

const CITIES = [
  'Nueva York', 'Los Ángeles', 'Ciudad de México', 'Bogotá', 'Buenos Aires', 
  'Madrid', 'Lima', 'Santiago', 'Caracas', 'Quito', 'Guatemala City', 'La Paz'
];

const TIMEZONES = [
  'EST', 'PST', 'MST', 'CST', 'GMT-5', 'GMT-3', 'GMT+1', 'GMT-6'
];

const FIRST_NAMES = [
  'Ana', 'Carlos', 'María', 'José', 'Laura', 'David', 'Carmen', 'Miguel',
  'Elena', 'Pedro', 'Isabel', 'Rafael', 'Sofia', 'Antonio', 'Lucía', 'Fernando',
  'Gabriela', 'Manuel', 'Valentina', 'Diego', 'Camila', 'Alejandro', 'Natalia', 'Sebastián'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez',
  'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno',
  'Álvarez', 'Muñoz', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez'
];

const SKILLS_DATA = [
  { name: 'JavaScript', category: 'development' },
  { name: 'Python', category: 'development' },
  { name: 'React', category: 'development' },
  { name: 'Node.js', category: 'development' },
  { name: 'UI/UX Design', category: 'design' },
  { name: 'Graphic Design', category: 'design' },
  { name: 'Figma', category: 'design' },
  { name: 'Social Media', category: 'marketing' },
  { name: 'Content Marketing', category: 'marketing' },
  { name: 'SEO', category: 'marketing' },
  { name: 'Google Analytics', category: 'analytics' },
  { name: 'Data Analysis', category: 'analytics' },
  { name: 'Project Management', category: 'management' },
  { name: 'Team Leadership', category: 'management' },
  { name: 'Communication', category: 'communication' },
  { name: 'Public Speaking', category: 'communication' },
  { name: 'Recruitment', category: 'hr' },
  { name: 'Employee Relations', category: 'hr' }
];

const LANGUAGES_DATA = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'de', name: 'German' }
];

const PROJECT_NAMES = [
  'EcoVerde - Plataforma Sostenible',
  'TechEdu - Educación Digital',
  'HealthConnect - Salud Comunitaria',
  'ClimateAction - Acción Climática',
  'FoodShare - Compartir Alimentos',
  'CodeForGood - Código para el Bien',
  'DigitalBridge - Puente Digital',
  'GreenFuture - Futuro Verde'
];

const TASK_TITLES = [
  'Diseñar mockups de la página principal',
  'Implementar sistema de autenticación',
  'Crear base de datos de usuarios',
  'Desarrollar API REST',
  'Escribir documentación técnica',
  'Realizar pruebas de usabilidad',
  'Optimizar rendimiento del frontend',
  'Configurar servidor de producción',
  'Crear campaña de marketing digital',
  'Analizar métricas de usuarios'
];

export class VolunteerFaker {
  private db: Database.Database;
  
  constructor() {
    this.db = getDatabase();
    this.initializeSchema();
  }

  // Inicializar el esquema de la base de datos
  private initializeSchema(): void {
    console.log('📋 Inicializando esquema de base de datos...');
    
    // Schema directo en el código para evitar problemas de archivos
    const schema = `
      -- Usuarios base
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'hr', 'lead_project', 'volunteer', 'unassigned')) DEFAULT 'unassigned',
        status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')) DEFAULT 'active',
        avatar TEXT,
        email_verified INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_login TEXT
      );

      -- Perfiles de usuarios
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        timezone TEXT NOT NULL,
        bio TEXT,
        birth_date TEXT,
        hours_per_week INTEGER CHECK (hours_per_week IN (10, 20)) DEFAULT 10,
        preferred_days TEXT,
        preferred_hours TEXT DEFAULT 'Flexible',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Habilidades disponibles
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL CHECK (category IN ('development', 'design', 'marketing', 'analytics', 'management', 'communication', 'hr')),
        description TEXT
      );

      -- Habilidades de usuarios
      CREATE TABLE IF NOT EXISTS user_skills (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        skill_id TEXT NOT NULL,
        level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        verified INTEGER NOT NULL DEFAULT 0,
        verified_by TEXT,
        verified_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
        FOREIGN KEY (verified_by) REFERENCES users(id),
        UNIQUE(user_id, skill_id)
      );

      -- Idiomas disponibles
      CREATE TABLE IF NOT EXISTS languages (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL
      );

      -- Idiomas de usuarios
      CREATE TABLE IF NOT EXISTS user_languages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        language_id TEXT NOT NULL,
        level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
        UNIQUE(user_id, language_id)
      );

      -- Proyectos
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        lead_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('planning', 'active', 'completed', 'paused', 'cancelled')) DEFAULT 'planning',
        max_team_size INTEGER NOT NULL DEFAULT 6,
        current_team_size INTEGER NOT NULL DEFAULT 0,
        deadline TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (lead_id) REFERENCES users(id)
      );

      -- Equipos
      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        lead_id TEXT NOT NULL,
        max_size INTEGER NOT NULL DEFAULT 6,
        current_size INTEGER NOT NULL DEFAULT 0,
        timezone TEXT NOT NULL DEFAULT 'EST',
        working_hours TEXT NOT NULL DEFAULT '9:00-17:00',
        primary_language TEXT NOT NULL DEFAULT 'en',
        status TEXT NOT NULL CHECK (status IN ('forming', 'active', 'completed', 'disbanded')) DEFAULT 'forming',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (lead_id) REFERENCES users(id)
      );

      -- Miembros de equipos
      CREATE TABLE IF NOT EXISTS team_members (
        id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at TEXT NOT NULL DEFAULT (datetime('now')),
        role TEXT NOT NULL CHECK (role IN ('lead', 'member', 'mentor')) DEFAULT 'member',
        status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'left')) DEFAULT 'active',
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(team_id, user_id)
      );

      -- Habilidades requeridas por equipo
      CREATE TABLE IF NOT EXISTS team_skill_requirements (
        id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        skill_id TEXT NOT NULL,
        level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        is_required INTEGER NOT NULL DEFAULT 1,
        priority INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      );

      -- Tareas
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        project_id TEXT NOT NULL,
        assigned_to TEXT,
        created_by TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'testing', 'done', 'blocked')) DEFAULT 'todo',
        priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
        estimated_hours INTEGER NOT NULL DEFAULT 1,
        actual_hours INTEGER DEFAULT 0,
        due_date TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        tags TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      );

      -- Aplicaciones de reclutamiento
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        birth_date TEXT,
        type TEXT NOT NULL CHECK (type IN ('regular', 'student_usa', 'student_intl', 'professional_intl')),
        current_stage INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL CHECK (status IN ('submitted', 'in_review', 'accepted', 'rejected', 'waiting_list')) DEFAULT 'submitted',
        assigned_to_hr TEXT,
        cv_path TEXT,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        completed_at TEXT,
        FOREIGN KEY (assigned_to_hr) REFERENCES users(id)
      );

      -- Etapas de aplicaciones
      CREATE TABLE IF NOT EXISTS application_stages (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        stage INTEGER NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')) DEFAULT 'pending',
        started_at TEXT,
        completed_at TEXT,
        notes TEXT,
        completed_by TEXT,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (completed_by) REFERENCES users(id)
      );

      -- Entrevistas
      CREATE TABLE IF NOT EXISTS interviews (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        scheduled_at TEXT NOT NULL,
        duration INTEGER NOT NULL DEFAULT 45,
        zoom_link TEXT,
        status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
        notes TEXT,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id)
      );

      -- Evaluaciones
      CREATE TABLE IF NOT EXISTS evaluations (
        id TEXT PRIMARY KEY,
        evaluated_user_id TEXT NOT NULL,
        evaluator_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('performance', 'peer', '360', 'self')),
        period TEXT NOT NULL,
        overall_score REAL NOT NULL CHECK (overall_score >= 1 AND overall_score <= 5),
        criteria_scores TEXT,
        comments TEXT,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'reviewed')) DEFAULT 'pending',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        due_date TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY (evaluated_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Feedback
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        from_user_id TEXT NOT NULL,
        to_user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('upward', 'downward', 'peer')),
        is_anonymous INTEGER NOT NULL DEFAULT 0,
        content TEXT NOT NULL,
        tags TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Documentos
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('certificate', 'letter', 'agreement', 'reference')),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        verification_code TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL CHECK (status IN ('draft', 'generated', 'sent', 'verified')) DEFAULT 'draft',
        expires_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        metadata TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Notificaciones
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('task_assigned', 'evaluation_due', 'document_expiring', 'system_update', 'general')),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        is_read INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      -- Índices para mejor performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
      CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
      CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
      CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(evaluated_user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    `;
    
    try {
      this.db.exec(schema);
      console.log('✅ Esquema de base de datos inicializado');
    } catch (error) {
      console.error('❌ Error inicializando esquema:', error);
      throw error;
    }
  }

  // Generar email único
  private generateEmail(firstName: string, lastName: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const cleanFirst = firstName.toLowerCase().replace(/\s+/g, '');
    const cleanLast = lastName.toLowerCase().replace(/\s+/g, '');
    const domain = randomChoice(domains);
    const number = randomInt(1, 999);
    return `${cleanFirst}.${cleanLast}${number}@${domain}`;
  }

  // Generar teléfono
  private generatePhone(): string {
    return `+${randomInt(1, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
  }

  // Insertar idiomas base
  async seedLanguages(): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO languages (id, code, name) 
      VALUES (?, ?, ?)
    `);

    for (const lang of LANGUAGES_DATA) {
      stmt.run(randomId(), lang.code, lang.name);
    }
  }

  // Insertar habilidades base
  async seedSkills(): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO skills (id, name, category, description) 
      VALUES (?, ?, ?, ?)
    `);

    for (const skill of SKILLS_DATA) {
      stmt.run(
        randomId(), 
        skill.name, 
        skill.category, 
        `Habilidad en ${skill.name} - ${skill.category}`
      );
    }
  }

  // Generar usuarios
  async seedUsers(count: number = 50): Promise<string[]> {
    const userIds: string[] = [];
    const statuses = ['active', 'inactive', 'suspended'];

    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, password, name, role, status, email_verified, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    console.log('\n🔑 Credenciales de testing:');

    for (let i = 0; i < count; i++) {
      const firstName = randomChoice(FIRST_NAMES);
      const lastName = randomChoice(LAST_NAMES);
      const userId = randomId();
      
      // Emails predecibles para testing
      let email: string;
      let role: string;
      
      if (i < 2) {
        role = 'admin';
        email = `admin_${i + 1}@example.com`;
      } else if (i < 6) {
        role = 'hr';
        email = `hr_${i - 1}@example.com`;
      } else if (i < 15) {
        role = 'lead_project';
        email = `lead_${i - 5}@example.com`;
      } else {
        role = 'volunteer';
        email = `volunteer_${i - 14}@example.com`;
      }

      const name = `${firstName} ${lastName}`;
      const status = i < 45 ? 'active' : randomChoice(statuses); // Mayoría activos
      const createdAt = randomDate(new Date(2023, 0, 1), new Date());
      const lastLogin = Math.random() > 0.3 ? randomDate(new Date(2024, 0, 1), new Date()) : null;

      stmt.run(
        userId,
        email,
        'password123',
        name,
        role,
        status,
        1,
        createdAt,
        lastLogin
      );

      // Imprimir credenciales principales
      if (i < 10) {
        console.log(`* ${role.toUpperCase()}: ${email} / password123`);
      }

      userIds.push(userId);
    }

    return userIds;
  }

  // Generar perfiles de usuario
  async seedUserProfiles(userIds: string[]): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO user_profiles (
        id, user_id, first_name, last_name, phone, country, city, timezone, 
        bio, birth_date, hours_per_week, preferred_days, preferred_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const userId of userIds) {
      const firstName = randomChoice(FIRST_NAMES);
      const lastName = randomChoice(LAST_NAMES);
      const birthDate = randomDate(new Date(1990, 0, 1), new Date(2005, 11, 31));
      const preferredDays = JSON.stringify(randomChoices(
        ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], 
        randomInt(2, 5)
      ));

      stmt.run(
        randomId(),
        userId,
        firstName,
        lastName,
        this.generatePhone(),
        randomChoice(COUNTRIES),
        randomChoice(CITIES),
        randomChoice(TIMEZONES),
        `Soy ${firstName}, apasionado por la tecnología y el voluntariado.`,
        birthDate,
        randomChoice([10, 20]),
        preferredDays,
        randomChoice(['Mañanas', 'Tardes', 'Noches', 'Flexible'])
      );
    }
  }

  // Generar habilidades de usuarios
  async seedUserSkills(userIds: string[]): Promise<void> {
    const skills = this.db.prepare('SELECT id FROM skills').all() as { id: string }[];
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO user_skills (id, user_id, skill_id, level, verified, verified_by, verified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const userId of userIds) {
      const userSkillCount = randomInt(2, 6);
      const userSkills = randomChoices(skills, userSkillCount);

      for (const skill of userSkills) {
        const verified = Math.random() > 0.7 ? 1 : 0;
        const verifiedBy = verified ? randomChoice(userIds) : null;
        const verifiedAt = verified ? randomDate(new Date(2024, 0, 1), new Date()) : null;

        stmt.run(
          randomId(),
          userId,
          skill.id,
          randomChoice(levels),
          verified,
          verifiedBy,
          verifiedAt
        );
      }
    }
  }

  // Generar idiomas de usuarios
  async seedUserLanguages(userIds: string[]): Promise<void> {
    const languages = this.db.prepare('SELECT id FROM languages').all() as { id: string }[];
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO user_languages (id, user_id, language_id, level)
      VALUES (?, ?, ?, ?)
    `);

    for (const userId of userIds) {
      const userLangCount = randomInt(1, 3);
      const userLanguages = randomChoices(languages, userLangCount);

      for (const language of userLanguages) {
        stmt.run(
          randomId(),
          userId,
          language.id,
          randomChoice(levels)
        );
      }
    }
  }

  // Generar proyectos
  async seedProjects(leadIds: string[], count: number = 8): Promise<string[]> {
    const projectIds: string[] = [];
    const statuses = ['planning', 'active', 'completed', 'paused'];

    const stmt = this.db.prepare(`
      INSERT INTO projects (id, name, description, lead_id, status, max_team_size, current_team_size, deadline, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const projectId = randomId();
      const name = randomChoice(PROJECT_NAMES);
      const maxTeamSize = randomInt(4, 8);
      const currentTeamSize = randomInt(1, maxTeamSize);
      const deadline = Math.random() > 0.5 ? randomDate(new Date(), new Date(2025, 11, 31)) : null;

      stmt.run(
        projectId,
        name,
        `Descripción detallada del proyecto ${name}. Este proyecto busca generar impacto social positivo.`,
        randomChoice(leadIds),
        randomChoice(statuses),
        maxTeamSize,
        currentTeamSize,
        deadline,
        randomDate(new Date(2024, 0, 1), new Date())
      );

      projectIds.push(projectId);
    }

    return projectIds;
  }

  // Generar equipos
  async seedTeams(projectIds: string[], leadIds: string[]): Promise<string[]> {
    const teamIds: string[] = [];
    const statuses = ['forming', 'active', 'completed'];

    const stmt = this.db.prepare(`
      INSERT INTO teams (id, project_id, name, description, lead_id, max_size, current_size, timezone, working_hours, primary_language, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const projectId of projectIds) {
      const teamId = randomId();
      const maxSize = randomInt(4, 8);
      const currentSize = randomInt(1, maxSize);

      stmt.run(
        teamId,
        projectId,
        `Equipo Principal`,
        'Equipo principal del proyecto',
        randomChoice(leadIds),
        maxSize,
        currentSize,
        randomChoice(TIMEZONES),
        randomChoice(['9:00-17:00', '10:00-18:00', '8:00-16:00']),
        'es',
        randomChoice(statuses),
        randomDate(new Date(2024, 0, 1), new Date())
      );

      teamIds.push(teamId);
    }

    return teamIds;
  }

  // Generar miembros de equipos
  async seedTeamMembers(teamIds: string[], userIds: string[]): Promise<void> {
    const roles = ['lead', 'member', 'mentor'];
    const statuses = ['active', 'inactive'];

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO team_members (id, team_id, user_id, joined_at, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const teamId of teamIds) {
      const memberCount = randomInt(3, 6);
      const teamMembers = randomChoices(userIds, memberCount);

      teamMembers.forEach((userId, index) => {
        stmt.run(
          randomId(),
          teamId,
          userId,
          randomDate(new Date(2024, 0, 1), new Date()),
          index === 0 ? 'lead' : randomChoice(roles),
          randomChoice(statuses)
        );
      });
    }
  }

  // Generar tareas
  async seedTasks(projectIds: string[], userIds: string[], count: number = 100): Promise<void> {
    const statuses = ['backlog', 'todo', 'in_progress', 'review', 'testing', 'done', 'blocked'];
    const priorities = ['low', 'medium', 'high', 'urgent'];

    const stmt = this.db.prepare(`
      INSERT INTO tasks (id, title, description, project_id, assigned_to, created_by, status, priority, estimated_hours, actual_hours, due_date, created_at, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const assignedTo = Math.random() > 0.3 ? randomChoice(userIds) : null;
      const estimatedHours = randomInt(1, 40);
      const actualHours = Math.random() > 0.5 ? randomInt(1, estimatedHours + 10) : null;
      const dueDate = Math.random() > 0.4 ? randomDate(new Date(), new Date(2025, 5, 30)) : null;
      const tags = JSON.stringify(randomChoices(['frontend', 'backend', 'urgent', 'bug', 'feature'], randomInt(1, 3)));

      stmt.run(
        randomId(),
        randomChoice(TASK_TITLES),
        `Descripción detallada de la tarea que debe ser completada.`,
        randomChoice(projectIds),
        assignedTo,
        randomChoice(userIds),
        randomChoice(statuses),
        randomChoice(priorities),
        estimatedHours,
        actualHours,
        dueDate,
        randomDate(new Date(2024, 0, 1), new Date()),
        tags
      );
    }
  }

  // Generar aplicaciones
  async seedApplications(hrIds: string[], count: number = 30): Promise<string[]> {
    const applicationIds: string[] = [];
    const types = ['regular', 'student_usa', 'student_intl', 'professional_intl'];
    const statuses = ['submitted', 'in_review', 'accepted', 'rejected', 'waiting_list'];

    const stmt = this.db.prepare(`
      INSERT INTO applications (id, email, first_name, last_name, phone, country, city, birth_date, type, current_stage, status, assigned_to_hr, notes, created_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const applicationId = randomId();
      const firstName = randomChoice(FIRST_NAMES);
      const lastName = randomChoice(LAST_NAMES);
      const status = randomChoice(statuses);
      const completedAt = ['accepted', 'rejected'].includes(status) ? randomDate(new Date(2024, 0, 1), new Date()) : null;

      stmt.run(
        applicationId,
        this.generateEmail(firstName, lastName),
        firstName,
        lastName,
        this.generatePhone(),
        randomChoice(COUNTRIES),
        randomChoice(CITIES),
        randomDate(new Date(1995, 0, 1), new Date(2006, 11, 31)),
        randomChoice(types),
        randomInt(1, 5),
        status,
        randomChoice(hrIds),
        `Candidato con experiencia en ${randomChoice(['tecnología', 'marketing', 'diseño', 'gestión'])}. Motivado por el impacto social.`,
        randomDate(new Date(2024, 0, 1), new Date()),
        completedAt
      );

      applicationIds.push(applicationId);
    }

    return applicationIds;
  }

  // Generar etapas de aplicaciones
  async seedApplicationStages(applicationIds: string[], userIds: string[]): Promise<void> {
    const stageNames = [
      'Revisión inicial',
      'Entrevista técnica',
      'Entrevista cultural',
      'Prueba práctica',
      'Decisión final'
    ];
    
    const statuses = ['pending', 'in_progress', 'completed', 'skipped', 'failed'];

    const stmt = this.db.prepare(`
      INSERT INTO application_stages (id, application_id, stage, name, status, started_at, completed_at, notes, completed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const applicationId of applicationIds) {
      const numStages = randomInt(3, 5);
      
      for (let stage = 1; stage <= numStages; stage++) {
        const status = randomChoice(statuses);
        const startedAt = ['in_progress', 'completed'].includes(status) ? randomDate(new Date(2024, 0, 1), new Date()) : null;
        const completedAt = status === 'completed' ? randomDate(new Date(startedAt || '2024-01-01'), new Date()) : null;
        const completedBy = completedAt ? randomChoice(userIds) : null;

        stmt.run(
          randomId(),
          applicationId,
          stage,
          stageNames[stage - 1] || `Etapa ${stage}`,
          status,
          startedAt,
          completedAt,
          status === 'completed' ? 'Etapa completada satisfactoriamente' : 'Pendiente de revisión',
          completedBy
        );
      }
    }
  }

  // Generar entrevistas
  async seedInterviews(applicationIds: string[], userIds: string[], count: number = 20): Promise<void> {
    const statuses = ['scheduled', 'completed', 'cancelled', 'rescheduled'];

    const stmt = this.db.prepare(`
      INSERT INTO interviews (id, application_id, scheduled_at, duration, zoom_link, status, notes, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const status = randomChoice(statuses);
      const scheduledAt = randomDate(new Date(2024, 0, 1), new Date(2025, 2, 28));
      const zoomLink = `https://zoom.us/j/${randomInt(100000000, 999999999)}`;
      
      stmt.run(
        randomId(),
        randomChoice(applicationIds),
        scheduledAt,
        randomChoice([30, 45, 60]),
        zoomLink,
        status,
        status === 'completed' ? 'Entrevista exitosa, candidato calificado' : 'Entrevista programada',
        randomChoice(userIds),
        randomDate(new Date(2024, 0, 1), new Date())
      );
    }
  }

  // Generar evaluaciones
  async seedEvaluations(userIds: string[], count: number = 40): Promise<void> {
    const types = ['performance', 'peer', '360', 'self'];
    const statuses = ['pending', 'completed', 'reviewed'];
    const periods = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'];

    const stmt = this.db.prepare(`
      INSERT INTO evaluations (id, evaluated_user_id, evaluator_id, type, period, overall_score, criteria_scores, comments, status, created_at, due_date, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const evaluatedId = randomChoice(userIds);
      const evaluatorId = randomChoice(userIds.filter(id => id !== evaluatedId));
      const status = randomChoice(statuses);
      const overallScore = randomFloat(2.5, 5.0);
      const criteriaScores = JSON.stringify({
        commitment: randomFloat(2, 5),
        skills: randomFloat(2, 5),
        communication: randomFloat(2, 5),
        teamwork: randomFloat(2, 5),
        leadership: randomFloat(2, 5)
      });
      const createdAt = randomDate(new Date(2024, 0, 1), new Date());
      const dueDate = randomDate(new Date(createdAt), new Date(2025, 1, 28));
      const completedAt = status === 'completed' ? randomDate(new Date(createdAt), new Date(dueDate)) : null;

      stmt.run(
        randomId(),
        evaluatedId,
        evaluatorId,
        randomChoice(types),
        randomChoice(periods),
        parseFloat(overallScore.toFixed(1)),
        criteriaScores,
        'Evaluación general positiva. Areas de mejora identificadas en comunicación.',
        status,
        createdAt,
        dueDate,
        completedAt
      );
    }
  }

  // Generar feedback
  async seedFeedback(userIds: string[], count: number = 60): Promise<void> {
    const types = ['upward', 'downward', 'peer'];
    const feedbackMessages = [
      'Excelente trabajo en equipo y comunicación efectiva.',
      'Muestra gran iniciativa y proactividad en los proyectos.',
      'Necesita mejorar la puntualidad en las entregas.',
      'Muy colaborativo y siempre dispuesto a ayudar.',
      'Demuestra liderazgo natural y capacidad de motivar al equipo.',
      'Podría beneficiarse de más formación técnica.',
      'Gran capacidad analítica y resolución de problemas.',
      'Comunicación clara y constructiva en las reuniones.'
    ];

    const stmt = this.db.prepare(`
      INSERT INTO feedback (id, from_user_id, to_user_id, type, is_anonymous, content, tags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const fromUserId = randomChoice(userIds);
      const toUserId = randomChoice(userIds.filter(id => id !== fromUserId));
      const tags = JSON.stringify(randomChoices(['communication', 'leadership', 'technical', 'teamwork', 'creativity'], randomInt(1, 3)));

      stmt.run(
        randomId(),
        fromUserId,
        toUserId,
        randomChoice(types),
        Math.random() > 0.7 ? 1 : 0,
        randomChoice(feedbackMessages),
        tags,
        randomDate(new Date(2024, 0, 1), new Date())
      );
    }
  }

  // Generar requerimientos de habilidades para equipos
  async seedTeamSkillRequirements(teamIds: string[]): Promise<void> {
    const skills = this.db.prepare('SELECT id FROM skills').all() as { id: string }[];
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

    const stmt = this.db.prepare(`
      INSERT INTO team_skill_requirements (id, team_id, skill_id, level, is_required, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const teamId of teamIds) {
      const reqCount = randomInt(3, 6);
      const teamSkills = randomChoices(skills, reqCount);

      teamSkills.forEach((skill, index) => {
        stmt.run(
          randomId(),
          teamId,
          skill.id,
          randomChoice(levels),
          index < 2 ? 1 : Math.random() > 0.5 ? 1 : 0, // Primeras 2 son requeridas
          index + 1
        );
      });
    }
  }

  // Generar documentos
  async seedDocuments(userIds: string[], count: number = 25): Promise<void> {
    const types = ['certificate', 'letter', 'agreement', 'reference'];
    const statuses = ['draft', 'generated', 'sent', 'verified'];
    const titles = [
      'Certificado de Participación',
      'Carta de Recomendación',
      'Acuerdo de Voluntariado',
      'Referencia Laboral',
      'Certificado de Horas Completadas'
    ];

    const stmt = this.db.prepare(`
      INSERT INTO documents (id, user_id, type, title, content, verification_code, status, expires_at, created_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const type = randomChoice(types);
      const title = randomChoice(titles);
      const verificationCode = randomBytes(6).toString('hex').toUpperCase();
      const expiresAt = Math.random() > 0.5 ? randomDate(new Date(), new Date(2026, 11, 31)) : null;
      const metadata = JSON.stringify({
        template_version: '1.0',
        generated_by: 'system',
        variables_used: ['user_name', 'completion_date', 'hours']
      });

      stmt.run(
        randomId(),
        randomChoice(userIds),
        type,
        title,
        `<h1>${title}</h1><p>Este documento certifica la participación del usuario en actividades de voluntariado.</p>`,
        verificationCode,
        randomChoice(statuses),
        expiresAt,
        randomDate(new Date(2024, 0, 1), new Date()),
        metadata
      );
    }
  }

  // Generar notificaciones
  async seedNotifications(userIds: string[], count: number = 100): Promise<void> {
    const types = ['task_assigned', 'evaluation_due', 'document_expiring', 'system_update', 'general'];
    const notifications = [
      { type: 'task_assigned', title: 'Nueva tarea asignada', message: 'Se te ha asignado una nueva tarea en el proyecto.' },
      { type: 'evaluation_due', title: 'Evaluación pendiente', message: 'Tienes una evaluación pendiente por completar.' },
      { type: 'document_expiring', title: 'Documento por vencer', message: 'Tu certificado está próximo a vencer.' },
      { type: 'system_update', title: 'Actualización del sistema', message: 'Nueva versión disponible con mejoras.' },
      { type: 'general', title: 'Reunión de equipo', message: 'Recordatorio de la reunión semanal del equipo.' }
    ];

    const stmt = this.db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < count; i++) {
      const notification = randomChoice(notifications);
      const data = JSON.stringify({
        action_url: '/dashboard',
        priority: randomChoice(['low', 'medium', 'high']),
        expires_at: randomDate(new Date(), new Date(2025, 5, 30))
      });

      stmt.run(
        randomId(),
        randomChoice(userIds),
        notification.type,
        notification.title,
        notification.message,
        data,
        Math.random() > 0.4 ? 1 : 0, // 60% leídas
        randomDate(new Date(2024, 0, 1), new Date())
      );
    }
  }

  // Método principal para generar todos los datos
  async generateFakeData(options: {
    users?: number;
    projects?: number;
    tasks?: number;
    applications?: number;
    evaluations?: number;
    feedback?: number;
    interviews?: number;
    documents?: number;
    notifications?: number;
  } = {}): Promise<void> {
    const {
      users = 50,
      projects = 8,
      tasks = 100,
      applications = 30,
      evaluations = 40,
      feedback = 60,
      interviews = 20,
      documents = 25,
      notifications = 100
    } = options;

    console.log('🌱 Generando datos de prueba...');

    try {
      // 1. Datos base
      console.log('📚 Insertando idiomas y habilidades...');
      await this.seedLanguages();
      await this.seedSkills();

      // 2. Usuarios
      console.log(`👥 Generando ${users} usuarios...`);
      const userIds = await this.seedUsers(users);
      
      // 3. Perfiles
      console.log('📝 Generando perfiles de usuario...');
      await this.seedUserProfiles(userIds);
      
      // 4. Habilidades y idiomas de usuarios
      console.log('🎯 Asignando habilidades e idiomas...');
      await this.seedUserSkills(userIds);
      await this.seedUserLanguages(userIds);

      // 5. Proyectos y equipos
      const leadIds = userIds.filter((_, i) => i >= 6 && i < 15); // Líderes de proyecto
      console.log(`🚀 Generando ${projects} proyectos...`);
      const projectIds = await this.seedProjects(leadIds, projects);
      
      console.log('👥 Generando equipos...');
      const teamIds = await this.seedTeams(projectIds, leadIds);
      await this.seedTeamMembers(teamIds, userIds);
      
      console.log('⚙️ Generando requerimientos de habilidades...');
      await this.seedTeamSkillRequirements(teamIds);

      // 6. Tareas
      console.log(`📋 Generando ${tasks} tareas...`);
      await this.seedTasks(projectIds, userIds, tasks);

      // 7. Sistema de reclutamiento
      const hrIds = userIds.filter((_, i) => i >= 2 && i < 6); // HR
      console.log(`📄 Generando ${applications} aplicaciones...`);
      const applicationIds = await this.seedApplications(hrIds, applications);
      
      console.log('📋 Generando etapas de aplicaciones...');
      await this.seedApplicationStages(applicationIds, userIds);
      
      console.log(`🎤 Generando ${interviews} entrevistas...`);
      await this.seedInterviews(applicationIds, userIds, interviews);

      // 8. Sistema de evaluación y feedback
      console.log(`📊 Generando ${evaluations} evaluaciones...`);
      await this.seedEvaluations(userIds, evaluations);
      
      console.log(`💬 Generando ${feedback} comentarios de feedback...`);
      await this.seedFeedback(userIds, feedback);

      // 9. Documentos y notificaciones
      console.log(`📜 Generando ${documents} documentos...`);
      await this.seedDocuments(userIds, documents);
      
      console.log(`🔔 Generando ${notifications} notificaciones...`);
      await this.seedNotifications(userIds, notifications);

      console.log('✅ ¡Datos de prueba generados exitosamente!');
      console.log(`📊 Resumen completo:
        - ${users} usuarios con perfiles completos
        - ${projects} proyectos con equipos
        - ${tasks} tareas asignadas
        - ${applications} aplicaciones de reclutamiento
        - ${interviews} entrevistas programadas
        - ${evaluations} evaluaciones de rendimiento
        - ${feedback} comentarios de feedback
        - ${documents} documentos generados
        - ${notifications} notificaciones
        - ${SKILLS_DATA.length} habilidades disponibles
        - ${LANGUAGES_DATA.length} idiomas soportados
        - Etapas de aplicación para cada candidato
        - Requerimientos de habilidades por equipo
      `);

      console.log('\n📝 IMPORTANTE: Todas las fechas están en formato SQLite (YYYY-MM-DD HH:MM:SS)');
      console.log('🔑 Usa las credenciales mostradas arriba para hacer login en la aplicación');

    } catch (error) {
      console.error('❌ Error generando datos:', error);
      throw error;
    }
  }

  // Limpiar todas las tablas
  async clearAllData(): Promise<void> {
    const tables = [
      'notifications', 'documents', 'feedback', 'evaluations', 'interviews',
      'application_stages', 'applications', 'tasks', 'team_skill_requirements',
      'team_members', 'teams', 'projects', 'user_languages', 'user_skills',
      'user_profiles', 'users', 'languages', 'skills'
    ];

    for (const table of tables) {
      this.db.prepare(`DELETE FROM ${table}`).run();
    }

    console.log('🧹 Todos los datos han sido eliminados');
  }
}

// Script de ejemplo para usar el faker
export async function runFaker() {
  const faker = new VolunteerFaker();
  
  // Limpiar datos anteriores (opcional)
  // await faker.clearAllData();
  
  // Generar todos los datos con relaciones completas
  await faker.generateFakeData({
    users: 50,
    projects: 8, 
    tasks: 100,
    applications: 30,
    evaluations: 40,
    feedback: 60,
    interviews: 20,
    documents: 25,
    notifications: 100
  });
}

// También puedes generar datos específicos por separado:
export async function runPartialFaker() {
  const faker = new VolunteerFaker();
  
  // Solo datos base
  await faker.seedLanguages();
  await faker.seedSkills();
  
  // Solo usuarios y sus relaciones
  const userIds = await faker.seedUsers(25);
  await faker.seedUserProfiles(userIds);
  await faker.seedUserSkills(userIds);
  
  // Solo evaluaciones y feedback
  await faker.seedEvaluations(userIds, 20);
  await faker.seedFeedback(userIds, 30);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runFaker().catch(console.error);
}