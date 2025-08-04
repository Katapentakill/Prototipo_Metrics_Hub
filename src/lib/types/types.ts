// src/lib/types.ts

// Tipos principales para la base de datos
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'hr' | 'lead_project' | 'volunteer' | 'unassigned';
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  avatar?: string;
  email_verified: number;
  created_at: string;
  last_login?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  country: string;
  city: string;
  timezone: string;
  bio?: string;
  birth_date?: string;
  hours_per_week: 10 | 20;
  preferred_days?: string;
  preferred_hours: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lead_id: string;
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled';
  max_team_size: number;
  current_team_size: number;
  deadline?: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assigned_to?: string;
  created_by: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'testing' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  tags?: string;
}

export interface Application {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  city: string;
  birth_date?: string;
  type: 'regular' | 'student_usa' | 'student_intl' | 'professional_intl';
  current_stage: number;
  status: 'submitted' | 'in_review' | 'accepted' | 'rejected' | 'waiting_list';
  assigned_to_hr?: string;
  cv_path?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'development' | 'design' | 'marketing' | 'analytics' | 'management' | 'communication' | 'hr';
  description?: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: number;
  verified_by?: string;
  verified_at?: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
}

export interface UserLanguage {
  id: string;
  user_id: string;
  language_id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';
}

export interface Team {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  lead_id: string;
  max_size: number;
  current_size: number;
  timezone: string;
  working_hours: string;
  primary_language: string;
  status: 'forming' | 'active' | 'completed' | 'disbanded';
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
  role: 'lead' | 'member' | 'mentor';
  status: 'active' | 'inactive' | 'left';
}

export interface TeamSkillRequirement {
  id: string;
  team_id: string;
  skill_id: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_required: number;
  priority: number;
}

export interface ApplicationStage {
  id: string;
  application_id: string;
  stage: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  started_at?: string;
  completed_at?: string;
  notes?: string;
  completed_by?: string;
}

export interface Interview {
  id: string;
  application_id: string;
  scheduled_at: string;
  duration: number;
  zoom_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  evaluated_user_id: string;
  evaluator_id: string;
  type: 'performance' | 'peer' | '360' | 'self';
  period: string;
  overall_score: number;
  criteria_scores?: string;
  comments?: string;
  status: 'pending' | 'completed' | 'reviewed';
  created_at: string;
  due_date: string;
  completed_at?: string;
}

export interface Feedback {
  id: string;
  from_user_id: string;
  to_user_id: string;
  type: 'upward' | 'downward' | 'peer';
  is_anonymous: number;
  content: string;
  tags?: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  type: 'certificate' | 'letter' | 'agreement' | 'reference';
  title: string;
  content: string;
  verification_code: string;
  status: 'draft' | 'generated' | 'sent' | 'verified';
  expires_at?: string;
  created_at: string;
  metadata?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'task_assigned' | 'evaluation_due' | 'document_expiring' | 'system_update' | 'general';
  title: string;
  message: string;
  data?: string;
  is_read: number;
  created_at: string;
}

// Tipos combinados útiles
export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface TaskWithProject extends Task {
  project_name?: string;
}

export interface ProjectWithLead extends Project {
  lead_name?: string;
}

export interface SkillWithLevel extends Skill {
  level?: string;
  verified?: number;
}

export interface LanguageWithLevel extends Language {
  level?: string;
}

export interface ApplicationWithStages extends Application {
  stages?: ApplicationStage[];
}

export interface TeamWithMembers extends Team {
  members?: (TeamMember & { user_name?: string })[];
}

export interface ProjectWithTeam extends Project {
  team?: Team;
  lead_name?: string;
}