import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { travelMeta, TravelBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Travel · Desktop (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="vintage"
      art={travelMeta.art}
      eyebrow={travelMeta.eyebrow}
      title={travelMeta.title}
      subtitle={travelMeta.subtitle}
      titleTone={travelMeta.titleTone}
      active="travel"
    >
      <TravelBody rsvpHref="/rsvp-vintage-desktop" />
    </DesktopContentPage>
  );
}
