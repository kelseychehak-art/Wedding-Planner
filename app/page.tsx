import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import EditorialCard from "@/components/EditorialCard";
import GuestHomeCard from "@/components/GuestHomeCard";
import GettingHereCard from "@/components/GettingHereCard";
import ScheduleCard from "@/components/ScheduleCard";
import RsvpTeaserCard from "@/components/RsvpTeaserCard";
import SiteFooter from "@/components/SiteFooter";
import Illustration from "@/components/Illustration";
import cardStyles from "@/components/EditorialCard.module.css";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        <div className={`page-shell ${styles.homeGrid}`}>
          <div className={styles.span4}>
            <EditorialCard
              eyebrow="Our Weekend"
              heading="A Week in Italy"
              headingVariant="script"
              showHeart
              body="Good food, great people, and a place we love — with plenty of time to enjoy every bit of it."
              cta={{ label: "See the Schedule", href: "/our-weekend", style: "outline" }}
              illustrations={
                <>
                  <Illustration
                    name="lemon"
                    className={`${cardStyles.illustration} ${cardStyles.weekLemon}`}
                  />
                  <Illustration
                    name="wineGlass"
                    className={`${cardStyles.illustration} ${cardStyles.weekWine}`}
                  />
                </>
              }
            />
          </div>

          <div className={styles.span4}>
            <GuestHomeCard />
          </div>

          <div className={styles.span4}>
            <ScheduleCard />
          </div>

          <div className={styles.span8}>
            <GettingHereCard />
          </div>

          <div className={styles.span4}>
            <RsvpTeaserCard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
