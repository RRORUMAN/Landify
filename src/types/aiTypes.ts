
export interface ToolPerformance {
  accuracy_score: number;
  response_time: number;
  scalability_score: number;
  ease_of_use_score: number;
  cost_efficiency_score: number;
  support_quality_score: number;
  api_reliability_score: number;
  customization_score: number;
  update_frequency: number;
}

export interface ToolUseCases {
  use_case: string;
  effectiveness_score: number;
  implementation_complexity: number;
  cost_impact: number;
  time_savings: number;
  details: Record<string, any>;
}

export interface ToolSecurity {
  security_feature: string;
  compliance_standards: string[];
  certification_status: string;
  last_audit_date: string;
  security_score: number;
  details: Record<string, any>;
}

export interface ToolResources {
  resource_type: string;
  quality_score: number;
  accessibility_score: number;
  comprehensiveness_score: number;
  update_frequency: string;
  details: Record<string, any>;
}

export interface ToolPricingDetail {
  plan_name: string;
  monthly_cost: number;
  features_included: string[];
  usage_limits: Record<string, any>;
  overage_costs: Record<string, any>;
  minimum_commitment: string;
  details: Record<string, any>;
}

export interface DetailedComparison {
  performance: ToolPerformance;
  useCases: ToolUseCases[];
  security: ToolSecurity[];
  resources: ToolResources[];
  pricing: ToolPricingDetail[];
}
