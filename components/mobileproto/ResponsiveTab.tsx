import DolcePage from "./DolcePage";
import DesktopContentPage from "./DesktopContentPage";
import type { TabMeta } from "./tabs";
import styles from "./ResponsiveTab.module.css";

/*
 * Production content-tab shell. One route serves both layouts: the phone gets
 * the DolcePage frame + sticky bottom nav, wider viewports get the
 * DesktopContentPage (painting band + top nav + centered column). Only one is
 * shown at a time via CSS (breakpoint 768px), so there's no hydration flash and
 * the tuned prototype layouts are reused verbatim. Content (children) is the
 * same palette-agnostic Body for both.
 */
export default function ResponsiveTab({
  meta,
  desktopActive,
  children,
}: {
  meta: TabMeta;
  /** Desktop top-nav highlight key; defaults to meta.active. Pass explicitly
   *  for tabs the mobile nav can't represent (activities, faq). */
  desktopActive?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.mobile}>
        <DolcePage
          eyebrow={meta.eyebrow}
          title={meta.title}
          subtitle={meta.subtitle}
          titleTone={meta.titleTone}
          active={meta.active ?? ""}
          backHref="/"
          art={meta.art}
        >
          {children}
        </DolcePage>
      </div>
      <div className={styles.desktop}>
        <DesktopContentPage
          variant="vintage"
          art={meta.art}
          eyebrow={meta.eyebrow}
          title={meta.title}
          subtitle={meta.subtitle}
          titleTone={meta.titleTone}
          active={desktopActive ?? meta.active}
        >
          {children}
        </DesktopContentPage>
      </div>
    </>
  );
}
