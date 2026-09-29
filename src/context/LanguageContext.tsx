import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'sat' | 'or';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    portalTitle: 'TribalSetu - MoTA National Portal',
    portalSubtitle: 'Ministry of Tribal Affairs, Government of India',
    systemBadge: 'National Production Gateway',
    dashboard: 'Dashboard',
    centralSchemes: 'Central Schemes',
    stateSchemes: 'State Schemes',
    fellowshipPortal: 'NFST & NOS Fellowships',
    aiScrutiny: 'AI Document Intelligence',
    myDocuments: 'My Documents',
    seedingStatus: 'DBT & ABC ID Seeding',
    myApplications: 'My Applications',
    ministryAnalytics: 'Ministry Analytics',
    userManagement: 'User & RBAC Manager',
    auditLedger: 'Global Audit Ledger',
    schemesManagement: 'Schemes Management',
    disbursementQueue: 'Scholarship Release (DBT)',
    verificationQueue: 'Verification Queue',
    meritScreening: 'Merit Screening Queue',
    activeModule: 'Active Official Module',
    installApp: 'Install Mobile App',
    offlineNotice: 'Offline Mode: Changes saved locally & will sync when online.',
    onlineNotice: 'Back Online: State synchronized.',
    applyNow: 'Apply Now',
    certifyDocuments: 'Certify Documents',
    awardScholarship: 'Award Scholarship',
    releaseFunds: 'Trigger DBT Release',
    flagDeficiency: 'Issue 72h Deficiency Notice',
    welcomeScholar: 'Welcome, Tribal Scholar & Citizen',
    welcomeOfficer: 'Welcome, Ministry & State Officer',
  },
  hi: {
    portalTitle: 'जनजातीय सेतु - MoTA राष्ट्रीय पोर्टल',
    portalSubtitle: 'जनजातीय कार्य मंत्रालय, भारत सरकार',
    systemBadge: 'राष्ट्रीय उत्पादन पोर्टल',
    dashboard: 'डैशबोर्ड',
    centralSchemes: 'केंद्रीय योजनाएं',
    stateSchemes: 'राज्य स्तरीय योजनाएं',
    fellowshipPortal: 'NFST एवं NOS अध्येतावृत्ति',
    aiScrutiny: 'AI दस्तावेज़ बुद्धिमत्ता व जांच',
    myDocuments: 'मेरे दस्तावेज़',
    seedingStatus: 'DBT व ABC ID सीडिंग',
    myApplications: 'मेरे आवेदन',
    ministryAnalytics: 'मंत्रालय एनालिटिक्स',
    userManagement: 'उपयोगकर्ता व RBAC प्रबंधन',
    auditLedger: 'सार्वजनिक ऑडिट खाता',
    schemesManagement: 'योजना प्रबंधन',
    disbursementQueue: 'छात्रवृत्ति विमोचन (DBT)',
    verificationQueue: 'सत्यापन कतार',
    meritScreening: 'योग्यता जांच एवं चयन',
    activeModule: 'सक्रिय आधिकारिक मॉड्यूल',
    installApp: 'मोबाइल ऐप इंस्टॉल करें',
    offlineNotice: 'ऑफलाइन मोड: बदलाव स्थानीय रूप से सुरक्षित हैं और ऑनलाइन होने पर सिंक होंगे।',
    onlineNotice: 'ऑनलाइन: स्थिति सफलतापूर्वक सिंक हुई।',
    applyNow: 'आवेदन करें',
    certifyDocuments: 'दस्तावेज़ प्रमाणित करें',
    awardScholarship: 'छात्रवृत्ति प्रदान करें',
    releaseFunds: 'DBT फंड जारी करें',
    flagDeficiency: '72 घंटे का त्रुटि नोटिस जारी करें',
    welcomeScholar: 'स्वागत है, जनजातीय अध्येता एवं नागरिक',
    welcomeOfficer: 'स्वागत है, मंत्रालय एवं राज्य अधिकारी',
  },
  sat: {
    portalTitle: 'ᱴᱨᱟᱭᱵᱟᱞ ᱥᱮᱛᱩ - MoTA ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱯᱚᱨᱴᱟᱞ',
    portalSubtitle: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ, ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ',
    systemBadge: 'ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱯᱚᱨᱴᱟᱞ',
    dashboard: 'ᱰᱮᱥᱵᱳᱨᱰ',
    centralSchemes: 'ᱛᱟᱞᱢᱟ ᱡᱚᱡᱚᱱᱟ',
    stateSchemes: 'ᱯᱚᱱᱚᱛ ᱡᱚᱡᱚᱱᱟ',
    fellowshipPortal: 'NFST & NOS ᱯᱷᱮᱞᱳᱥᱤᱯ',
    aiScrutiny: 'AI ᱠᱟᱜᱚᱡᱽ ᱯᱟᱲᱦᱟᱣ',
    myDocuments: 'ᱤᱧᱟᱜ ᱠᱟᱜᱚᱡᱽ ᱠᱚ',
    seedingStatus: 'DBT & ABC ID ᱡᱚᱲᱟᱣ',
    myApplications: 'ᱤᱧᱟᱜ ᱟᱨᱡᱤ ᱠᱚ',
    ministryAnalytics: 'ᱢᱚᱱᱛᱨᱟᱲᱚᱭ ᱦᱤᱥᱟᱹᱵᱽ',
    userManagement: 'ᱵᱮᱵᱷᱟᱨᱤᱭᱟᱹ ᱵᱮᱵᱚᱥᱛᱷᱟ',
    auditLedger: 'ᱚᱰᱤᱴ ᱵᱟᱦᱤ',
    schemesManagement: 'ᱡᱚᱡᱚᱱᱟ ᱵᱮᱵᱚᱥᱛᱷᱟ',
    disbursementQueue: 'ᱴᱟᱠᱟ ᱵᱷᱮᱡᱟ (DBT)',
    verificationQueue: 'ᱯᱚᱨᱚᱠ ᱞᱟᱹᱭᱤᱱ',
    meritScreening: 'ᱢᱮᱨᱤᱴ ᱪᱟᱪᱞᱟᱣ',
    activeModule: 'ᱪᱟᱹᱞᱩ ᱢᱚᱰᱤᱭᱩᱞ',
    installApp: 'ᱢᱳᱵᱟᱭᱤᱞ ᱮᱯ ᱤᱱᱥᱴᱚᱞ',
    offlineNotice: 'ᱚᱯᱷᱞᱟᱭᱤᱱ: ᱚᱱᱞᱟᱭᱤᱱ ᱨᱮ ᱥᱤᱝᱠ ᱦᱩᱭᱩᱜᱼᱟ᱾',
    onlineNotice: 'ᱚᱱᱞᱟᱭᱤᱱ: ᱥᱤᱝᱠ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ᱾',
    applyNow: 'ᱟᱨᱡᱤ ᱮᱢ',
    certifyDocuments: 'ᱠᱟᱜᱚᱡᱽ ᱯᱟᱥ',
    awardScholarship: 'ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱮᱢ',
    releaseFunds: 'DBT ᱴᱟᱠᱟ ᱵᱷᱮᱡᱟ',
    flagDeficiency: '᱗᱒ ᱴᱟᱲᱟᱝ ᱱᱳᱴᱤᱥ',
    welcomeScholar: 'ᱡᱚᱦᱟᱨ, ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    welcomeOfficer: 'ᱡᱚᱦᱟᱨ, ᱚᱯᱷᱤᱥᱟᱨ',
  },
  or: {
    portalTitle: 'ଟ୍ରାଇବାଲ ସେତୁ - MoTA ଜାତୀୟ ପୋର୍ଟାଲ',
    portalSubtitle: 'ଜନଜାତି କଲ୍ୟାଣ ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର',
    systemBadge: 'ଜାତୀୟ ପୋର୍ଟାଲ',
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    centralSchemes: 'କେନ୍ଦ୍ରୀୟ ଯୋଜନା',
    stateSchemes: 'ରାଜ୍ୟ ଯୋଜନା',
    fellowshipPortal: 'NFST ଏବଂ NOS ଫେଲୋସିପ୍',
    aiScrutiny: 'AI ଦସ୍ତାବିଜ୍ ଯାଞ୍ଚ',
    myDocuments: 'ମୋ ଦସ୍ତାବିଜ୍',
    seedingStatus: 'DBT ଓ ABC ID ସିଡିଂ',
    myApplications: 'ମୋ ଆବେଦନ',
    ministryAnalytics: 'ମନ୍ତ୍ରଣାଳୟ ବିଶ୍ଳେଷଣ',
    userManagement: 'ଉପଭୋକ୍ତା ପ୍ରବନ୍ଧନ',
    auditLedger: 'ଅଡିଟ୍ ଲେଜର',
    schemesManagement: 'ଯୋଜନା ପରିଚାଳନା',
    disbursementQueue: 'ଛାତ୍ରବୃତ୍ତି ପ୍ରଦାନ (DBT)',
    verificationQueue: 'ଯାଞ୍ଚ ତାଲିକା',
    meritScreening: 'ମେଧା ଚୟନ',
    activeModule: 'ସକ୍ରିୟ ମଡ୍ୟୁଲ୍',
    installApp: 'ମୋବାଇଲ୍ ଆପ୍ ସଂସ୍ଥାପନ',
    offlineNotice: 'ଅଫଲାଇନ୍ ମୋଡ୍: ସ୍ଥାନୀୟ ଭାବରେ ସଂରକ୍ଷିତ ହୋଇଛି |',
    onlineNotice: 'ଅନଲାଇନ୍: ସିଙ୍କ୍ ସଫଳ ହେଲା |',
    applyNow: 'ଆବେଦନ କରନ୍ତୁ',
    certifyDocuments: 'ଦସ୍ତାବିଜ୍ ପ୍ରମାଣିତ କରନ୍ତୁ',
    awardScholarship: 'ଛାତ୍ରବୃତ୍ତି ପ୍ରଦାନ କରନ୍ତୁ',
    releaseFunds: 'DBT ପାଣ୍ଠି ପ୍ରଦାନ',
    flagDeficiency: '୭୨ ଘଣ୍ଟା ତ୍ରୁଟି ନୋଟିସ୍',
    welcomeScholar: 'ସ୍ୱାଗତ, ଜନଜାତି ବିଦ୍ୟାର୍ଥୀ',
    welcomeOfficer: 'ସ୍ୱାଗତ, ଅଧିକାରୀ ମହୋଦୟ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mota_portal_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mota_portal_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
