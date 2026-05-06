export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedSchema: "auth"
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          label_id: string | null
          title: string
          notes: string | null
          status: string
          priority: string
          due_date: string | null
          sort_order: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          label_id?: string | null
          title: string
          notes?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          sort_order?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          label_id?: string | null
          title?: string
          notes?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          sort_order?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      labels: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          frequency: string
          target_days: number
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          frequency?: string
          target_days?: number
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          frequency?: string
          target_days?: number
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: string
          completed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: string
          completed_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type TaskStatus = 'inbox' | 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Label {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  label_id: string | null
  title: string
  notes: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  sort_order: number
  completed_at: string | null
  created_at: string
  updated_at: string
  label?: Label
  project?: Project
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  frequency: 'daily' | 'weekly'
  target_days: number
  is_archived: boolean
  created_at: string
  updated_at: string
  logs?: HabitLog[]
}

export interface HabitLog {
  id: string
  user_id: string
  habit_id: string
  completed_at: string
  created_at: string
}
