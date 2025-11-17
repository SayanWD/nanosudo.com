import type { BriefNewFormValues } from "../schemas/brief-new";

export const BRIEF_NEW_DEFAULT_VALUES: BriefNewFormValues = {
  projectInfo: {
    projectName: "",
    projectType: "landing",
    description: "",
  },
  modules: {
    frontend: {
      mainPage: false,
      innerPages: 0,
      contactForm: false,
      interactiveMap: false,
      calculator: false,
      animations: false,
      multilingual: false,
    },
    backend: {
      restApi: false,
      auth: false,
      adminPanel: false,
      database: false,
      fileStorage: false,
      emailNotifications: false,
    },
    ecommerce: {
      catalog: false,
      cartCheckout: false,
      paymentSystems: [],
      userAccount: false,
      orderSystem: false,
    },
    integrations: {
      crm: [],
      analytics: [],
      emailMarketing: [],
      socialMedia: false,
      telegramBot: false,
      erp1c: false,
    },
  },
  design: {
    useTemplate: false,
    adaptBrandbook: false,
    designFromScratch: false,
    uiKit: false,
    pageCount: 1,
  },
  content: {
    clientProvides: true,
    needsCopywriting: false,
    needsMediaProcessing: false,
  },
  technical: {
    expectedLoad: "low",
    highSecurity: false,
    pwa: false,
    realtime: false,
  },
  timeline: {
    desiredWeeks: 8,
    phasedDelivery: false,
  },
  contact: {
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    companyName: "",
  },
};

