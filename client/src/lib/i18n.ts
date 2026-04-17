const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    events: 'Events',
    login: 'Log In',
    logout: 'Log Out',
  },
  ja: {
    welcome: 'ようこそ',
    events: 'イベント',
    login: 'ログイン',
    logout: 'ログアウト',
  },
};

export function t(lang: string, key: string): string {
  return translations[lang]?.[key] ?? key;
}
