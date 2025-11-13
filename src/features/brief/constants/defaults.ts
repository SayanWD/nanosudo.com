import type { BriefFormValues } from "../schemas/brief";

export const BRIEF_DEFAULT_VALUES: BriefFormValues = {
  client: {
    clientName: "",
    industry: "",
    geography: [],
    languages: ["ru"],
    businessGoals: [],
  },
  audience: {
    targetAudience: "",
    channels: [],
    usp: "",
    integrations: [],
  },
  metrics: {
    kpiTraffic: "",
    kpiConversion: "",
    hasBrandbook: false,
    brandbookLink: "",
    brandbookFile: null,
    brandTone: 50,
  },
  contact: {
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactMethod: "email",
    teamRoles: "",
  },
};
