import HomeMobile from "@/components/mobileproto/HomeMobile";
import HomeDesktop from "@/components/mobileproto/HomeDesktop";
import rt from "@/components/mobileproto/ResponsiveTab.module.css";

/*
 * Homepage — the "fluid" hero. Phone gets the scrolling mobile home with the
 * sticky bottom nav; wider viewports get the one-screen desktop home with the
 * top nav. Same 768px breakpoint toggle as the content tabs.
 */
export default function Home() {
  return (
    <>
      <div className={rt.mobile}>
        <HomeMobile />
      </div>
      <div className={rt.desktop}>
        <HomeDesktop />
      </div>
    </>
  );
}
