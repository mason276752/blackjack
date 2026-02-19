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

// Import Korean (ko) translations
import commonKo from './locales/ko/common.json';
import gameKo from './locales/ko/game.json';
import actionsKo from './locales/ko/actions.json';
import strategyKo from './locales/ko/strategy.json';
import statsKo from './locales/ko/stats.json';
import countKo from './locales/ko/count.json';
import handKo from './locales/ko/hand.json';
import bettingKo from './locales/ko/betting.json';
import rulesKo from './locales/ko/rules.json';
import aiKo from './locales/ko/ai.json';

// Import Filipino (fil) translations
import commonFil from './locales/fil/common.json';
import gameFil from './locales/fil/game.json';
import actionsFil from './locales/fil/actions.json';
import strategyFil from './locales/fil/strategy.json';
import statsFil from './locales/fil/stats.json';
import countFil from './locales/fil/count.json';
import handFil from './locales/fil/hand.json';
import bettingFil from './locales/fil/betting.json';
import rulesFil from './locales/fil/rules.json';
import aiFil from './locales/fil/ai.json';

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
  ko: {
    common: commonKo,
    game: gameKo,
    actions: actionsKo,
    strategy: strategyKo,
    stats: statsKo,
    count: countKo,
    hand: handKo,
    betting: bettingKo,
    rules: rulesKo,
    ai: aiKo,
  },
  fil: {
    common: commonFil,
    game: gameFil,
    actions: actionsFil,
    strategy: strategyFil,
    stats: statsFil,
    count: countFil,
    hand: handFil,
    betting: bettingFil,
    rules: rulesFil,
    ai: aiFil,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    lng: 'en', // Default language: English
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
