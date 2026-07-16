import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
      </main>
      <SiteFooter />
    </>
  );
}
