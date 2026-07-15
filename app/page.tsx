import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import EditorialCard from "@/components/EditorialCard";
import GuestHomeCard from "@/components/GuestHomeCard";
import ScheduleCard from "@/components/ScheduleCard";
import KindlyRespondCard from "@/components/KindlyRespondCard";
import SiteFooter from "@/components/SiteFooter";
import cardStyles from "@/components/EditorialCard.module.css";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        <div className={`page-shell ${styles.homeGrid}`}>
          <div id="our-weekend" className={styles.span4}>
            <EditorialCard
              eyebrow="Our Weekend"
              heading="A week in Italy"
              headingVariant="script"
              showHeart
              body="Good food, great people and a place we love."
              cta={{ label: "See the Schedule", href: "#our-weekend", style: "outline" }}
              illustrations={
                <>
                  <img
                    src="/assets/illustrations/lemon-sprig.svg"
                    alt=""
                    className={`${cardStyles.illustration} ${cardStyles.weekLemon}`}
                  />
                  <img
                    src="/assets/illustrations/wine-glass.svg"
                    alt=""
                    className={`${cardStyles.illustration} ${cardStyles.weekWine}`}
                  />
                </>
              }
            />
          </div>

          <div className={styles.span4}>
            <GuestHomeCard guestName="Taylor" />
          </div>

          <div className={styles.span4}>
            <ScheduleCard />
          </div>

          <div id="travel" className={styles.span4}>
            <EditorialCard
              heading="Getting Here"
              headingVariant="plain"
              body="Flights, transportation and everything you need to plan your trip."
              cta={{ label: "View Travel Guide", href: "#travel", style: "link" }}
              illustrations={
                <img
                  src="/assets/illustrations/airplane.svg"
                  alt=""
                  className={`${cardStyles.illustration} ${cardStyles.travelIllustration}`}
                />
              }
            />
          </div>

          <div id="stay" className={styles.span4}>
            <EditorialCard
              heading="Where You’ll Stay"
              headingVariant="plain"
              body="Room blocks, villa details and local recommendations."
              cta={{ label: "View Stay Options", href: "#stay", style: "link" }}
              illustrations={
                <img
                  src="/assets/illustrations/room-key.svg"
                  alt=""
                  className={`${cardStyles.illustration} ${cardStyles.stayIllustration}`}
                />
              }
            />
          </div>

          <div id="things-to-do" className={styles.span4}>
            <EditorialCard
              heading="Things to Do"
              headingVariant="plain"
              body="Local favorites, beaches, markets and more."
              cta={{ label: "Explore Guide", href: "#things-to-do", style: "link" }}
              illustrations={
                <img
                  src="/assets/illustrations/bicycle.svg"
                  alt=""
                  className={`${cardStyles.illustration} ${cardStyles.bicycleIllustration}`}
                />
              }
            />
          </div>

          <div id="rsvp" className={styles.kindlyRespond}>
            <KindlyRespondCard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
