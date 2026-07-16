import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import KindlyRespondCard from "@/components/KindlyRespondCard";
import styles from "@/components/ContentPage.module.css";

export const metadata: Metadata = {
  title: "RSVP · Kelsey & Andrew's Wedding Week",
  description: "RSVP to Kelsey & Andrew's wedding week in Italy — look up your invitation and let us know if you'll be there.",
};

export default function RsvpPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Kindly Respond"
          title="RSVP"
          intro="We can't wait to celebrate with you. Look up your invitation below with your name and email, and let us know if you'll be joining us in Italy."
          illustration="/assets/illustrations/heart.svg"
        />

        <div className={`page-shell ${styles.page}`}>
          <section className={styles.section}>
            <KindlyRespondCard />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
