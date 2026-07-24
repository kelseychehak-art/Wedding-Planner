import type { Metadata } from "next";
import ResponsiveTab from "@/components/mobileproto/ResponsiveTab";
import { faqMeta, FaqBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "FAQ · Kelsey & Andrew's Wedding Week",
  description:
    "Answers to common questions about Kelsey & Andrew's wedding week in Tuscany — travel, lodging, dress, and more.",
};

export default function FaqPage() {
  return (
    <ResponsiveTab meta={faqMeta} desktopActive="faq">
      <FaqBody />
    </ResponsiveTab>
  );
}
