import React from "react";
import { Link } from "react-router";
import { ArrowRight, Brain, Leaf, Sprout } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLanguage } from "../i18n/language";
import { t } from "../i18n/strings";

export function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1729041221905-0519efecaa92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm0lMjBsYW5kc2NhcGUlMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NzQ4MDY0MTR8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Farm landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/45 via-white/70 to-amber-100/60" />
      </div>

      {/* Top navbar */}
      <header className="relative z-10 w-full px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold text-gray-900">{t(language, "brand.name")}</div>
              <div className="text-xs text-gray-500">{t(language, "brand.subtitle")}</div>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-2">
            <Button asChild variant="ghost" className="bg-white/40 hover:bg-white/60">
              <Link to="/">{t(language, "nav.home")}</Link>
            </Button>
            <Button asChild variant="ghost" className="bg-white/40 hover:bg-white/60">
              <Link to="/about">{t(language, "nav.about")}</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <Link to="/login" aria-label="Continue to the app">
                {t(language, "nav.continue")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-4 md:px-8 pb-12 flex-1">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <div className="pt-6 md:pt-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-gray-200 px-3 py-1 text-sm text-gray-700 shadow-sm">
              <Leaf className="w-4 h-4 text-green-700" />
              {t(language, "home.badge")}
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              {t(language, "home.title")}
            </h1>
            <p className="mt-4 text-gray-700 text-lg max-w-xl">
              {t(language, "home.subtitle")}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover">
                <Link to="/login">
                  {t(language, "home.cta.getStarted")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/70">
                <Link to="/login">{t(language, "home.cta.signIn")}</Link>
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              {t(language, "home.workflowHint")}
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 gap-4 lg:pt-12">
            <Card className="shadow-xl border-gray-200 bg-white/85 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-700" />
                  {t(language, "home.feature1.title")}
                </CardTitle>
                <CardDescription>{t(language, "home.feature1.desc")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {t(language, "home.feature1.body")}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-gray-200 bg-white/85 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-700" />
                  {t(language, "home.feature2.title")}
                </CardTitle>
                <CardDescription>{t(language, "home.feature2.desc")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {t(language, "home.feature2.body")}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur shadow-sm">
            <div className="px-6 py-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900">
                      {t(language, "brand.name")} {t(language, "brand.subtitle")}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">
                    {t(language, "footer.tagline")}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">{t(language, "footer.pages")}</div>
                  <div className="mt-3 flex flex-col gap-2 text-sm">
                    <Link className="text-gray-700 hover:text-gray-900 underline-offset-4 hover:underline" to="/">
                      {t(language, "nav.home")}
                    </Link>
                    <Link className="text-gray-700 hover:text-gray-900 underline-offset-4 hover:underline" to="/about">
                      {t(language, "nav.about")}
                    </Link>
                    <Link className="text-gray-700 hover:text-gray-900 underline-offset-4 hover:underline" to="/login">
                      Login
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">{t(language, "footer.getStarted")}</div>
                  <p className="mt-3 text-sm text-gray-700">
                    Jump into the dashboard to add farms and crops, then review recommendations and reports.
                  </p>
                  <div className="mt-4">
                    <Button asChild className="bg-primary hover:bg-primary-hover">
                      <Link to="/login">
                        {t(language, "footer.cta")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-gray-200" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-600">
                <div>
                  © {new Date().getFullYear()} {t(language, "brand.name")} {t(language, "brand.subtitle")}.{" "}
                  {t(language, "footer.rights")}
                </div>
                <div className="flex items-center gap-4">
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

