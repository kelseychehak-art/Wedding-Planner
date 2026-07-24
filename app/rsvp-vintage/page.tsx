import type { Metadata } from "next";
import DolcePage from "@/components/mobileproto/DolcePage";
import { rsvpMeta, RsvpBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "RSVP (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DolcePage
      eyebrow={rsvpMeta.eyebrow}
      title={rsvpMeta.title}
      subtitle={rsvpMeta.subtitle}
      titleTone={rsvpMeta.titleTone}
      active={rsvpMeta.active}
      backHref="/home-fluid"
      art={rsvpMeta.art}
    >
      <RsvpBody />
    </DolcePage>
  );
}
