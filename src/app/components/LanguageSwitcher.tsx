import React from "react";
import { Button } from "./ui/button";
import { useLanguage } from "../i18n/language";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white/70 backdrop-blur shadow-sm overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        className={`h-9 px-3 rounded-none ${language === "en" ? "bg-white/60" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <div className="w-px h-9 bg-gray-200" />
      <Button
        type="button"
        variant="ghost"
        className={`h-9 px-3 rounded-none ${language === "mk" ? "bg-white/60" : ""}`}
        onClick={() => setLanguage("mk")}
      >
        MK
      </Button>
    </div>
  );
}

