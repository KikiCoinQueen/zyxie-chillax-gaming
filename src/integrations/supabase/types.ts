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
      kols: {
        Row: {
          id: string
          twitter_handle: string
          name: string | null
          last_analyzed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          twitter_handle: string
          name?: string | null
          last_analyzed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          twitter_handle?: string
          name?: string | null
          last_analyzed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kol_analyses: {
        Row: {
          id: string
          kol_id: string
          tweet_id: string
          tweet_text: string
          sentiment: number
          is_bullish: boolean
          mentioned_coins: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          kol_id: string
          tweet_id: string
          tweet_text: string
          sentiment: number
          is_bullish: boolean
          mentioned_coins?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          kol_id?: string
          tweet_id?: string
          tweet_text?: string
          sentiment?: number
          is_bullish?: boolean
          mentioned_coins?: string[] | null
          created_at?: string
        }
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