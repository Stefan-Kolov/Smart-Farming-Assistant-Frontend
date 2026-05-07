import type { Language } from "./language";

export type TranslationKey =
  | "brand.name"
  | "brand.subtitle"
  | "nav.home"
  | "nav.about"
  | "nav.continue"
  | "home.badge"
  | "home.title"
  | "home.subtitle"
  | "home.cta.getStarted"
  | "home.cta.signIn"
  | "home.workflowHint"
  | "home.feature1.title"
  | "home.feature1.desc"
  | "home.feature1.body"
  | "home.feature2.title"
  | "home.feature2.desc"
  | "home.feature2.body"
  | "footer.pages"
  | "footer.getStarted"
  | "footer.tagline"
  | "footer.cta"
  | "footer.rights"
  | "about.title"
  | "about.subtitle"
  | "about.card1.title"
  | "about.card1.desc"
  | "about.card1.body"
  | "about.card2.title"
  | "about.card2.desc"
  | "about.card2.body"
  | "about.card3.title"
  | "about.card3.desc"
  | "about.card3.body";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "brand.name": "Smart Farming",
  "brand.subtitle": "Assistant",
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.continue": "Continue",
  "home.badge": "AI-powered recommendations for better yields",
  "home.title": "Make smarter decisions for your farm.",
  "home.subtitle": "Track farms and crops, get tailored insights, and turn data into clear actions — all in one modern dashboard.",
  "home.cta.getStarted": "Get started",
  "home.cta.signIn": "Sign in",
  "home.workflowHint": "Built for fast workflows: add a farm → add crops → view recommendations.",
  "home.feature1.title": "Farm & Crop Tracking",
  "home.feature1.desc": "Keep key details organized in one place.",
  "home.feature1.body": "Quickly add farms and crops, record planting dates, and maintain soil info for better planning.",
  "home.feature2.title": "AI Recommendations",
  "home.feature2.desc": "Actionable insights, not just charts.",
  "home.feature2.body": "Get irrigation, fertilization, and timing suggestions tailored to your farm conditions.",
  "footer.pages": "Pages",
  "footer.getStarted": "Get started",
  "footer.tagline": "A clean workflow for farms, crops, and AI-powered recommendations.",
  "footer.cta": "Continue",
  "footer.rights": "All rights reserved.",
  "about.title": "About Smart Farming Assistant",
  "about.subtitle": "We help farmers turn field data into confident decisions with a clean workflow and AI-assisted guidance.",
  "about.card1.title": "Purpose",
  "about.card1.desc": "Simple, practical outcomes.",
  "about.card1.body": "Reduce guesswork by organizing farm details and surfacing next-step recommendations.",
  "about.card2.title": "Approach",
  "about.card2.desc": "Insights you can act on.",
  "about.card2.body": "AI suggestions are presented in a dashboard-first experience for fast daily use.",
  "about.card3.title": "Workflow",
  "about.card3.desc": "Designed for clarity.",
  "about.card3.body": "Add a farm, add crops, then review recommendations and reports—no clutter.",
};

const mk: Dictionary = {
  "brand.name": "Паметно Земјоделство",
  "brand.subtitle": "Асистент",
  "nav.home": "Почетна",
  "nav.about": "За нас",
  "nav.continue": "Продолжи",
  "home.badge": "Препораки со помош на ВИ за подобар принос",
  "home.title": "Носете попаметни одлуки за вашата фарма.",
  "home.subtitle": "Следете фарми и култури, добивајте прилагодени увидувања и претворете ги податоците во јасни активности — сè во една модерна контролна табла.",
  "home.cta.getStarted": "Започни",
  "home.cta.signIn": "Најави се",
  "home.workflowHint": "Направено за брз тек: додај фарма → додај култури → прегледај препораки.",
  "home.feature1.title": "Следење на фарми и култури",
  "home.feature1.desc": "Организирајте ги клучните детали на едно место.",
  "home.feature1.body": "Брзо додавајте фарми и култури, внесувајте датуми на садење и одржувајте информации за почвата за подобро планирање.",
  "home.feature2.title": "ВИ препораки",
  "home.feature2.desc": "Практични увидувања, не само графици.",
  "home.feature2.body": "Добијте препораки за наводнување, ѓубрење и тајминг прилагодени на условите на вашата фарма.",
  "footer.pages": "Страници",
  "footer.getStarted": "Започни",
  "footer.tagline": "Чист тек за фарми, култури и препораки со помош на ВИ.",
  "footer.cta": "Продолжи",
  "footer.rights": "Сите права се задржани.",
  "about.title": "За Smart Farming Assistant",
  "about.subtitle": "Им помагаме на земјоделците да ги претворат податоците од полето во сигурни одлуки преку чист тек и ВИ поддршка.",
  "about.card1.title": "Цел",
  "about.card1.desc": "Едноставни, практични резултати.",
  "about.card1.body": "Намалете го нагаѓањето со организирање на деталите за фармата и истакнување на следните чекори.",
  "about.card2.title": "Пристап",
  "about.card2.desc": "Увидувања што можете да ги примените.",
  "about.card2.body": "ВИ предлозите се прикажани во искуство ориентирано кон контролна табла за брза секојдневна употреба.",
  "about.card3.title": "Тек на работа",
  "about.card3.desc": "Дизајнирано за јасност.",
  "about.card3.body": "Додајте фарма, додајте култури, потоа прегледајте препораки и извештаи—без неред.",
};

export function t(lang: Language, key: TranslationKey): string {
  const dict = lang === "mk" ? mk : en;
  return dict[key] ?? en[key];
}

