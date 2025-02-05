
import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  pricing: string;
  description: string;
  tags: string[];
  category: string;
  featured: boolean;
  visit_url: string;
  bookmarks: number;
  founding_year?: number | null;
  company_name?: string | null;
  company_size?: string | null;
  best_for?: string[] | null;
  integrations_count?: number | null;
  monthly_active_users?: number | null;
  created_at?: string | null;
  special_pricing?: boolean;
}

export interface Category {
  name: string;
  icon: LucideIcon;
}

export interface UserTool {
  id: string;
  user_id: string;
  tool_id: string;
  purchase_date: string | null;
  subscription_status: string | null;
  notes: string | null;
  subscription_tier: 'free' | 'pro' | 'business' | 'business_plus' | null;
  subscription_details: Record<string, any> | null;
  monthly_cost: number | null;
  billing_cycle: string | null;
  next_billing_date: string | null;
  usage_stats: Record<string, any> | null;
  tool?: Tool;
}

export interface SpendForecast {
  id: string;
  user_id: string;
  forecast_date: string;
  forecasted_amount: number;
  forecast_details: Record<string, any> | null;
  created_at?: string | null;
}

