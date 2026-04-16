import React from "react";
import { Link } from "react-router";
import { ArrowLeft, Brain, Sprout, Target } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLanguage } from "../i18n/language";
import { t } from "../i18n/strings";

export function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1729041221905-0519efecaa92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm0lMjBsYW5kc2NhcGUlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzQ4MDY0MTR8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/45 via-white/70 to-amber-100/60" />
      </div>

      <header className="relative z-10 w-full px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button asChild variant="ghost" className="bg-white/40 hover:bg-white/60">
            <Link to="/" aria-label="Back to Home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t(language, "nav.home")}
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <Link to="/login">{t(language, "nav.continue")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center pt-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">{t(language, "about.title")}</h1>
            <p className="mt-3 text-gray-700 text-lg">
              {t(language, "about.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-xl border-gray-200 bg-white/85 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-700" />
                  {t(language, "about.card1.title")}
                </CardTitle>
                <CardDescription>{t(language, "about.card1.desc")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {t(language, "about.card1.body")}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-gray-200 bg-white/85 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-700" />
                  {t(language, "about.card2.title")}
                </CardTitle>
                <CardDescription>{t(language, "about.card2.desc")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {t(language, "about.card2.body")}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-gray-200 bg-white/85 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-700" />
                  {t(language, "about.card3.title")}
                </CardTitle>
                <CardDescription>{t(language, "about.card3.desc")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {t(language, "about.card3.body")}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

