export type SubmissionRow = {
  id: string;
  created_at: string;
  updated_at: string | null;

  client_name: string;
  industry: string;
  geography: string[] | null;
  languages: string[] | null;
  business_goals: string[] | null;

  target_audience: string;
  channels: string[] | null;
  usp: string | null;
  integrations: string[] | null;

  kpi_traffic: string | null;
  kpi_conversion: string | null;
  has_brandbook: boolean;
  brandbook_link: string | null;
  brandbook_file_url: string | null;
  brand_tone: number | null;

  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_method: "email" | "telegram" | "whatsapp" | "phone";
  team_roles: string | null;

  status: "new" | "in_progress" | "completed" | "archived";
  submitted_ip: string | null;
  user_agent: string | null;
};
