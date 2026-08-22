import type { Metadata } from "next";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { faqMeta } from "@/components/mobileproto/tabs";
import ShowcaseFaqBody from "@/components/mobileproto/ShowcaseFaqBody";

export const metadata: Metadata = {
  title: "FAQ · Kelsey & Andrew's Wedding Week",
  description: "Answers to the questions we hear most about Kelsey & Andrew's wedding week in Umbria.",
};

export default function FaqPage() {
  return (
    <ShowcaseTab title={faqMeta.title} subtitle={faqMeta.subtitle} activeKey="faq">
      <ShowcaseFaqBody />
    </ShowcaseTab>
  );
}
