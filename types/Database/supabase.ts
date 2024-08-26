export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          active_until: string
          content: string
          created_at: string
          created_by: string
          discord_message_id: number | null
          id: string
          platforms: Database["public"]["Enums"]["announcement_platform"][]
          priority: Database["public"]["Enums"]["announcement_priority"]
          title: string | null
        }
        Insert: {
          active_until: string
          content: string
          created_at?: string
          created_by: string
          discord_message_id?: number | null
          id?: string
          platforms: Database["public"]["Enums"]["announcement_platform"][]
          priority: Database["public"]["Enums"]["announcement_priority"]
          title?: string | null
        }
        Update: {
          active_until?: string
          content?: string
          created_at?: string
          created_by?: string
          discord_message_id?: number | null
          id?: string
          platforms?: Database["public"]["Enums"]["announcement_platform"][]
          priority?: Database["public"]["Enums"]["announcement_priority"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          checked_in_by: string
          event_id: string
          member_id: string
        }
        Insert: {
          checked_in_by: string
          event_id: string
          member_id: string
        }
        Update: {
          checked_in_by?: string
          event_id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events_data: {
        Row: {
          id: string
          is_public: boolean
          main_post: string | null
          tags: Database["public"]["Enums"]["event_tag"][]
          type: Database["public"]["Enums"]["event_type"] | null
        }
        Insert: {
          id: string
          is_public?: boolean
          main_post?: string | null
          tags: Database["public"]["Enums"]["event_tag"][]
          type?: Database["public"]["Enums"]["event_type"] | null
        }
        Update: {
          id?: string
          is_public?: boolean
          main_post?: string | null
          tags?: Database["public"]["Enums"]["event_tag"][]
          type?: Database["public"]["Enums"]["event_type"] | null
        }
        Relationships: []
      }
      members: {
        Row: {
          dues_paid_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          membership_year: string
          met_attendance_requirements: boolean
          signup_date: string
          subscribed: boolean
          track: Database["public"]["Enums"]["member_track"]
        }
        Insert: {
          dues_paid_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          membership_year: string
          met_attendance_requirements?: boolean
          signup_date?: string
          subscribed?: boolean
          track?: Database["public"]["Enums"]["member_track"]
        }
        Update: {
          dues_paid_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          membership_year?: string
          met_attendance_requirements?: boolean
          signup_date?: string
          subscribed?: boolean
          track?: Database["public"]["Enums"]["member_track"]
        }
        Relationships: []
      }
      officers: {
        Row: {
          name: string
          position: string
          year: string
        }
        Insert: {
          name: string
          position: string
          year: string
        }
        Update: {
          name?: string
          position?: string
          year?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          category: Database["public"]["Enums"]["post_category"] | null
          content: string
          created_at: string
          id: string
          keywords: string[] | null
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: Database["public"]["Enums"]["post_category"] | null
          content: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: Database["public"]["Enums"]["post_category"] | null
          content?: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string
          created_at: string
          details: string | null
          icon_svg_code: string | null
          id: string
          members: Json[]
          start: string
          stop: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          color: string
          created_at?: string
          details?: string | null
          icon_svg_code?: string | null
          id?: string
          members: Json[]
          start: string
          stop?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          color?: string
          created_at?: string
          details?: string | null
          icon_svg_code?: string | null
          id?: string
          members?: Json[]
          start?: string
          stop?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          permissions: Database["public"]["Enums"]["user_permission"][]
          user_id: string
        }
        Insert: {
          permissions: Database["public"]["Enums"]["user_permission"][]
          user_id: string
        }
        Update: {
          permissions?: Database["public"]["Enums"]["user_permission"][]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["user_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      announcement_platform: "website" | "discord" | "email"
      announcement_priority: "LOW" | "MEDIUM" | "HIGH"
      event_tag:
        | "cle"
        | "food"
        | "snacks"
        | "technical_track"
        | "beginner_track"
      event_type: "social" | "audience_event" | "workshop" | "major_event"
      member_track: "technical" | "beginner"
      post_category: "event" | "project"
      user_permission: "announcements" | "events_data"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

