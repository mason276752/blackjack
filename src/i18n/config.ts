import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import Traditional Chinese (zh-TW) translations
import commonZhTW from './locales/zh-TW/common.json';
import gameZhTW from './locales/zh-TW/game.json';
import actionsZhTW from './locales/zh-TW/actions.json';
import strategyZhTW from './locales/zh-TW/strategy.json';
import statsZhTW from './locales/zh-TW/stats.json';
import countZhTW from './locales/zh-TW/count.json';
import handZhTW from './locales/zh-TW/hand.json';
import bettingZhTW from './locales/zh-TW/betting.json';
import rulesZhTW from './locales/zh-TW/rules.json';
import aiZhTW from './locales/zh-TW/ai.json';

// Import English (en) translations
import commonEn from './locales/en/common.json';
import gameEn from './locales/en/game.json';
import actionsEn from './locales/en/actions.json';
import strategyEn from './locales/en/strategy.json';
import statsEn from './locales/en/stats.json';
import countEn from './locales/en/count.json';
import handEn from './locales/en/hand.json';
import bettingEn from './locales/en/betting.json';
import rulesEn from './locales/en/rules.json';
import aiEn from './locales/en/ai.json';

const resources = {
  'zh-TW': {
    common: commonZhTW,
    game: gameZhTW,
    actions: actionsZhTW,
    strategy: strategyZhTW,
    stats: statsZhTW,
    count: countZhTW,
    hand: handZhTW,
    betting: bettingZhTW,
    rules: rulesZhTW,
    ai: aiZhTW,
  },
  en: {
    common: commonEn,
    game: gameEn,
    actions: actionsEn,
    strategy: strategyEn,
    stats: statsEn,
    count: countEn,
    hand: handEn,
    betting: bettingEn,
    rules: rulesEn,
    ai: aiEn,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW',
    defaultNS: 'common',
    lng: 'zh-TW', // Default language: Traditional Chinese
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'blackjack-language',
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false, // Disable suspense for simpler setup
    },
  });

export default i18n;
