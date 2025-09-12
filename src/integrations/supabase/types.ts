export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          document_id: string
          id: string
          metadata: Json
          pinecone_id: string | null
          tokens: number | null
          user_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          document_id: string
          id?: string
          metadata?: Json
          pinecone_id?: string | null
          tokens?: number | null
          user_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          metadata?: Json
          pinecone_id?: string | null
          tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          checksum: string | null
          created_at: string
          embedding_model: string | null
          filename: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          source: string | null
          status: string
          storage_path: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          embedding_model?: string | null
          filename: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          source?: string | null
          status?: string
          storage_path?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          embedding_model?: string | null
          filename?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          source?: string | null
          status?: string
          storage_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fixed_deposits: {
        Row: {
          client_id: string
          created_at: string
          current_value: number
          id: string
          interest_rate: number
          maturity_amount: number
          maturity_date: string
          name: string
          original_amount: number
          status: string
          tenure_years: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          current_value: number
          id?: string
          interest_rate: number
          maturity_amount: number
          maturity_date: string
          name: string
          original_amount: number
          status: string
          tenure_years: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          current_value?: number
          id?: string
          interest_rate?: number
          maturity_amount?: number
          maturity_date?: string
          name?: string
          original_amount?: number
          status?: string
          tenure_years?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          annual_income: number | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          investment_goals: string[] | null
          is_premium: boolean | null
          kyc_status: string | null
          last_name: string | null
          occupation: string | null
          pan_number: string | null
          phone: string | null
          pincode: string | null
          preferred_communication: string | null
          risk_tolerance: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          annual_income?: number | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          investment_goals?: string[] | null
          is_premium?: boolean | null
          kyc_status?: string | null
          last_name?: string | null
          occupation?: string | null
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          preferred_communication?: string | null
          risk_tolerance?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          annual_income?: number | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          investment_goals?: string[] | null
          is_premium?: boolean | null
          kyc_status?: string | null
          last_name?: string | null
          occupation?: string | null
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          preferred_communication?: string | null
          risk_tolerance?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      query_logs: {
        Row: {
          answer: Json | null
          created_at: string
          duration_ms: number | null
          id: string
          match_count: number | null
          matched_clauses: Json | null
          query_text: string
          user_id: string
        }
        Insert: {
          answer?: Json | null
          created_at?: string
          duration_ms?: number | null
          id?: string
          match_count?: number | null
          matched_clauses?: Json | null
          query_text: string
          user_id: string
        }
        Update: {
          answer?: Json | null
          created_at?: string
          duration_ms?: number | null
          id?: string
          match_count?: number | null
          matched_clauses?: Json | null
          query_text?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
