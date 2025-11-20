import type { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/layout/container";
import type { Metadata } from "next";
import { generateMetadata as generateBaseMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacyPolicy");
  return generateBaseMetadata({
    title: t("title"),
    description: t("description"),
  });
}

export default async function PrivacyPolicyPage(): Promise<ReactElement> {
  const t = await getTranslations("privacyPolicy");

  return (
    <SiteShell>
      <main className="relative min-h-screen py-section">
        <Container>
          <article className="mx-auto max-w-4xl space-y-8">
            <header className="space-y-4 border-b border-border/60 pb-8">
              <h1 className="font-heading text-4xl text-foreground md:text-5xl">
                {t("title")}
              </h1>
              <p className="text-muted-foreground">
                {t("lastUpdated")}: {new Date().toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </header>

            <div className="prose prose-invert max-w-none space-y-8 text-foreground">
              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.introduction.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("sections.introduction.content")}</p>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.dataCollection.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("sections.dataCollection.content")}</p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>{t("sections.dataCollection.items.name")}</li>
                  <li>{t("sections.dataCollection.items.email")}</li>
                  <li>{t("sections.dataCollection.items.phone")}</li>
                  <li>{t("sections.dataCollection.items.usage")}</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.cookies.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("sections.cookies.content")}</p>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">{t("sections.cookies.necessary.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("sections.cookies.necessary.description")}</p>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">{t("sections.cookies.analytics.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("sections.cookies.analytics.description")}</p>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">{t("sections.cookies.marketing.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("sections.cookies.marketing.description")}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.dataUsage.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("sections.dataUsage.content")}</p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>{t("sections.dataUsage.items.processing")}</li>
                  <li>{t("sections.dataUsage.items.communication")}</li>
                  <li>{t("sections.dataUsage.items.analytics")}</li>
                  <li>{t("sections.dataUsage.items.improvements")}</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.dataProtection.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("sections.dataProtection.content")}</p>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.userRights.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("sections.userRights.content")}</p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>{t("sections.userRights.items.access")}</li>
                  <li>{t("sections.userRights.items.correction")}</li>
                  <li>{t("sections.userRights.items.deletion")}</li>
                  <li>{t("sections.userRights.items.objection")}</li>
                  <li>{t("sections.userRights.items.portability")}</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-2xl text-foreground">{t("sections.contact.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.contact.content")}{" "}
                  <a href="mailto:roorsayan@gmail.com" className="font-medium text-accent underline-offset-4 hover:underline">
                    roorsayan@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </article>
        </Container>
      </main>
    </SiteShell>
  );
}

