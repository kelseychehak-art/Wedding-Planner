import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import KindlyRespondCard from "@/components/KindlyRespondCard";
import { siteContent } from "@/data/siteContent";
import styles from "./rsvp.module.css";

export const metadata: Metadata = {
  title: "RSVP · Kelsey & Andrew's Wedding Week",
  description:
    "RSVP to Kelsey & Andrew's wedding week in Tuscany — look up your invitation and let us know if you'll be joining us.",
};

export default function RsvpPage() {
  return (
    <ContentPageFrame
      title="Submit Your RSVP"
      subtitle="Please let us know if you'll be joining us in Italy!"
      titleTone="terracotta"
      heroIllustration="lemonBranch"
      footerLine="We can't wait to celebrate with you!"
    >
      <p className={styles.deadline}>
        Kindly respond by {siteContent.wedding.rsvpDeadlineLabel.replace(/^By /, "")}
      </p>
      <KindlyRespondCard />
    </ContentPageFrame>
  );
}
