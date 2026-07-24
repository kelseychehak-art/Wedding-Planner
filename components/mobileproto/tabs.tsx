import { dolce as d } from "@/components/mobileproto/DolcePage";
import KindlyRespondCard from "@/components/KindlyRespondCard";
import ActivitiesSchedule from "@/components/mobileproto/ActivitiesSchedule";
import { siteContent } from "@/data/siteContent";
import { schedule, formatTimeRange } from "@/data/schedule";
import faq from "@/components/mobileproto/tabs.module.css";

/*
 * Single source of truth for the five standard content tabs (Travel, Stay,
 * Activities, FAQ, RSVP). Each tab exports a `meta` (header + footer + which
 * painting to use for the vintage treatment) and a `Body` that renders the
 * inner sections using the palette-agnostic `dolce` classes — so the same
 * body renders identically in the mobile shell (DolcePage) and the desktop
 * shell (DesktopContentPage), in both the cream and vintage palettes.
 */

export type TabMeta = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  active?: "home" | "weekend" | "travel" | "stay" | "rsvp" | "";
  titleTone?: "sea" | "coral";
  art: string; // painting for the vintage treatment
};

/* ------------------------------------------------------------------ Travel */

export const travelMeta: TabMeta = {
  title: "Travel",
  subtitle: "Flights, transfers, and a few tips for the journey to Tuscany.",
  active: "travel",
  art: "/assets/art/tivoli.jpg", // Italianate landscape with ruins — the journey
};

const AIRPORTS = [
  { code: "FLR", city: "Florence, Italy" },
  { code: "PSA", city: "Pisa, Italy" },
  { code: "ROM", city: "Rome, Italy" },
];
const TRANSPORT = [
  { title: "Private Shuttle", note: "Pre-book a group or private transfer" },
  { title: "Rent a Car", note: "Recommended for flexibility" },
  { title: "Train", note: "Scenic option to nearby towns" },
];
const TIPS = [
  { title: "Passport", body: "Valid for at least six months after your return date." },
  { title: "Travel Insurance", body: "Recommended for international trips — peace of mind is worth it." },
  { title: "Packing", body: "Comfortable shoes, sun protection, and layers for cooler evenings." },
  { title: "Connectivity", body: "Consider an international plan or an eSIM before you travel." },
];

export function TravelBody({ rsvpHref = "/rsvp-vintage" }: { rsvpHref?: string }) {
  return (
    <>
      <section className={d.section}>
        <p className={d.sectionLabel}>Step one</p>
        <h2 className={d.sectionTitle}>Getting to Italy</h2>
        <p className={d.cardText} style={{ marginBottom: 12 }}>
          We recommend flying into one of these airports:
        </p>
        {/* Airport codes read as three tiles across on desktop, a list on a phone. */}
        <div className={d.tripleGrid}>
          {AIRPORTS.map((a) => (
            <div key={a.code} className={d.tile}>
              <span className={d.tileLead}>{a.code}</span>
              <span className={d.tileText}>{a.city}</span>
            </div>
          ))}
        </div>
        <div className={d.callout}>
          <span className={d.calloutText}>
            <strong>Florence (FLR)</strong> is the closest and most convenient to our villa.
          </span>
        </div>
      </section>

      {/* These two sit side by side on desktop, stacked on a phone. */}
      <div className={d.twoUp} style={{ marginTop: 26 }}>
        <section className={d.section}>
          <p className={d.sectionLabel}>Book early</p>
          <h2 className={d.sectionTitle}>When to book</h2>
          <div className={d.card}>
            <p className={d.cardText}>
              Book your flights <strong>4–6 months in advance</strong> for the best prices and
              availability.
            </p>
          </div>
          <div className={d.callout}>
            <span className={d.calloutText}>
              Plan to arrive <strong>Mon, June 16 – Wed, June 18</strong>. Our welcome events begin
              the afternoon of the 16th.
            </span>
          </div>
        </section>

        <section className={d.section}>
          <p className={d.sectionLabel}>On the ground</p>
          <h2 className={d.sectionTitle}>Getting to the villa</h2>
          <div className={d.card}>
            {TRANSPORT.map((t) => (
              <div key={t.title} className={d.row}>
                <span className={d.rowText}>
                  <strong>{t.title}</strong>
                  <br />
                  <span className={d.rowNote}>{t.note}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={d.section}>
        <p className={d.sectionLabel}>Before you go</p>
        <h2 className={d.sectionTitle}>Good to know</h2>
        <div className={d.card}>
          <div className={d.rowCols}>
            {TIPS.map((t) => (
              <div key={t.title} className={d.row}>
                <span className={d.rowText}>
                  <strong>{t.title}</strong>
                  <br />
                  <span className={d.rowNote}>{t.body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <a href={rsvpHref} className={d.cta}>
        RSVP &amp; Details
      </a>
      <p className={d.sign}>Buon viaggio</p>
      <p className={d.signSub}>Safe travels</p>
    </>
  );
}

/* -------------------------------------------------------------------- Stay */

export const stayMeta: TabMeta = {
  title: "The Villa",
  subtitle: "Our home for the week — exclusively ours, all week long.",
  active: "stay",
  art: "/assets/art/thanatopsis.jpg", // golden luminous estate landscape — arriving
};

const FACTS = ["Sleeps 50 guests", "25 rooms & suites", "Pool, gardens & terraces"];
const ROOMS = [
  { name: "Garden Rooms", desc: "A peaceful retreat surrounded by the villa's gardens.", count: "12 Rooms", photo: "/assets/photos/villa-lawn.jpg" },
  { name: "Olive Grove Rooms", desc: "Near the olive groves, with beautiful views.", count: "8 Rooms", photo: "/assets/photos/olive-hills.jpg" },
  { name: "Villa Suites", desc: "Spacious suites with separate seating areas.", count: "4 Suites", photo: "/assets/hero/valdorcia.jpg" },
  { name: "Family Suites", desc: "Ideal for families or groups with extra space.", count: "1 Suite", photo: "/assets/photos/cypress-drive.jpg" },
];

export function StayBody() {
  return (
    <>
      <section className={d.section}>
        {/* Villa hero: image-left / text-right on desktop, stacked on a phone. */}
        <article className={d.hCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/hero/villa-estate.jpg" alt="The villa estate in the Tuscan countryside" className={d.hCardPhoto} />
          <div className={d.hCardBody}>
            <p className={d.sectionLabel}>Tuscany, Italy</p>
            <h2 className={d.imgCardTitle}>Villa di Santa Lucia</h2>
            <p className={d.imgCardText}>
              We have exclusive use of the villa and all of its amenities for the whole week.
            </p>
          </div>
        </article>

        {/* The three headline facts read as a strip across on desktop. */}
        <div className={d.tripleGrid} style={{ marginTop: 16 }}>
          {FACTS.map((f) => (
            <div key={f} className={d.tile}>
              <span className={d.tileText}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={d.section}>
        <p className={d.sectionLabel}>Room categories</p>
        <h2 className={d.sectionTitle}>Where guests stay</h2>
        <div className={d.callout}>
          <span className={d.calloutText}>
            Room assignments are coordinated with the couple — we&rsquo;ll share yours closer to the week.
          </span>
        </div>
        <div className={d.roomGrid} style={{ marginTop: 14 }}>
          {ROOMS.map((r) => (
            <article key={r.name} className={d.imgCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.photo} alt="" className={d.imgCardPhoto} />
              <div className={d.imgCardBody}>
                <div className={d.imgCardTop}>
                  <h3 className={d.imgCardTitle}>{r.name}</h3>
                  <span className={d.imgCardMeta}>{r.count}</span>
                </div>
                <p className={d.imgCardText}>{r.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className={d.sign}>Benvenuti</p>
      <p className={d.signSub}>Welcome</p>
    </>
  );
}

/* -------------------------------------------------------------- Activities */

export const activitiesMeta: TabMeta = {
  title: "Activities",
  subtitle: "Everything we've planned — come to it all, or pick your moments.",
  active: "",
  art: "/assets/art/redon-bouquet.jpg", // vibrant Redon flowers — the joyful tab
};

const THINGS = [
  { name: "Explore Local Towns", desc: "Montepulciano, Montalcino, and Pienza are all close by." },
  { name: "Hike & Nature Walks", desc: "Scenic trails and long countryside views everywhere you look." },
  { name: "Wellness & Relaxation", desc: "Book a spa treatment or claim a quiet chair by the pool." },
  { name: "Golf", desc: "Beautiful courses a short drive from the villa." },
  { name: "Art & Culture", desc: "Museums, galleries, and historic sites to wander." },
  { name: "Shop & Sip", desc: "Boutiques, local markets, and wine bars for a slow afternoon." },
];

export function ActivitiesBody() {
  return (
    <>
      {/* Clickable activity tiles → detail drawer + sign-up CTA (client). */}
      <ActivitiesSchedule />

      <section className={d.section}>
        <p className={d.sectionLabel}>On your own</p>
        <h2 className={d.sectionTitle}>Things to do</h2>
        <div className={d.card}>
          <div className={d.rowCols}>
            {THINGS.map((t) => (
              <div key={t.name} className={d.row}>
                <span className={d.rowText}>
                  <strong>{t.name}</strong>
                  <br />
                  <span className={d.rowNote}>{t.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className={d.sign}>Non vediamo l&rsquo;ora</p>
      <p className={d.signSub}>We can&rsquo;t wait</p>
    </>
  );
}

/* --------------------------------------------------------------------- FAQ */

export const faqMeta: TabMeta = {
  title: "FAQ",
  subtitle: "Answers to the questions we hear most.",
  active: "",
  art: "/assets/art/sky.jpg", // soft pink cloud study — calm and airy
};

const GROUPS: { title: string; qa: { q: string; a: string }[] }[] = [
  {
    title: "The Basics",
    qa: [
      { q: "What are the dates?", a: "June 16–21, 2027 — a full week of celebrations in the Tuscan countryside." },
      { q: "Where is the wedding?", a: "Tuscany, Italy. The exact venue is being finalized — we'll share it here as soon as it's set." },
      { q: "What will the weather be like?", a: "Warm, sunny June days (high 70s–80s°F) and cooler evenings. Pack a layer for after dark." },
      { q: "Is there a website or app?", a: "This site is home base — travel, schedule, where you'll stay, and RSVP all live right here." },
    ],
  },
  {
    title: "Travel",
    qa: [
      { q: "Which airport should I fly into?", a: "Florence (FLR) is closest and easiest. Pisa (PSA) and Rome (ROM) also work well." },
      { q: "Do you recommend renting a car?", a: "Yes — it's the most flexible way to get around the countryside and nearby towns." },
      { q: "Will transportation be provided?", a: "We'll arrange group transport for the main events. Details closer to the week." },
      { q: "How do I get to the villa from the airport?", a: "Private transfer, rental car, or train plus a short taxi. See the Travel tab for options." },
    ],
  },
  {
    title: "Where You'll Stay",
    qa: [
      { q: "Where will we be staying?", a: "Most guests stay right at the villa, which we have exclusively for the week. See the Stay tab." },
      { q: "How do I find out my room?", a: "Room assignments are coordinated with us — we'll let you know yours ahead of time." },
      { q: "What amenities are there?", a: "A pool, gardens, terraces, and lots of gathering spaces to relax between events." },
      { q: "Can I arrive early or stay later?", a: "Absolutely — just let us know your plans so we can help." },
    ],
  },
  {
    title: "Activities & Attire",
    qa: [
      { q: "What activities are planned?", a: "A welcome dinner, wine tasting, pool day, the ceremony, and a farewell party. See Activities." },
      { q: "Do I have to attend everything?", a: "Not at all — come to what you like. A few events ask for an RSVP so we can plan." },
      { q: "What should I wear?", a: "Relaxed elegance. We'll share specific dress notes for each event closer to the time." },
      { q: "Any tips on footwear?", a: "Flats or block heels — much of the week is on grass and stone." },
    ],
  },
  {
    title: "Food & Gifts",
    qa: [
      { q: "Will meals be provided?", a: "Most group events include food and drink. We'll flag any meals that are on your own." },
      { q: "Can you accommodate dietary needs?", a: "Yes — note them on your RSVP and we'll take care of it." },
      { q: "Are you registering for gifts?", a: "Your presence is the gift. If you'd like to give something, we'll share details later." },
      { q: "I have another question — who do I ask?", a: "Email us at chehakshultswedding@gmail.com — we're always happy to help." },
    ],
  },
];

export function FaqBody() {
  return (
    <>
      <div className={faq.faqGrid}>
        {GROUPS.map((g) => (
          <section key={g.title} className={faq.group}>
            <h2 className={faq.groupTitle}>{g.title}</h2>
            {g.qa.map((item) => (
              <details key={item.q} className={faq.item}>
                <summary className={faq.q}>
                  {item.q}
                  <span className={faq.plus} aria-hidden="true">+</span>
                </summary>
                <p className={faq.a}>{item.a}</p>
              </details>
            ))}
          </section>
        ))}
      </div>

      <p className={d.sign} style={{ marginTop: 34 }}>A presto</p>
      <p className={d.signSub}>See you soon</p>
    </>
  );
}

/* ----------------------------------------------------------------- Weekend */

export const weekendMeta: TabMeta = {
  title: "Weekend Schedule",
  subtitle: "June 16 – 21, 2027 · Tuscany, Italy",
  active: "weekend",
  art: "/assets/art/vista.jpg", // classic Claude-Lorrain vista — timeless overview
};

/* Desktop presentation of the week: instead of the phone's one-day-at-a-time
   pager, show every day at once with its events as cards in the grid. */
export function WeekendBody() {
  return (
    <>
      {/* No section heading — the painting band above already reads
          "Day by day / Weekend Schedule", so a second title muddled the two. */}
      <section className={d.section}>
        <div className={d.agenda}>
          {schedule.map((day) => (
            <article key={day.key} className={d.agendaRow}>
              <div>
                <p className={d.agendaDate}>{day.date}</p>
                <h3 className={d.agendaName}>{day.dayName}</h3>
              </div>
              <div className={d.agendaEvents}>
                {day.events.map((ev, i) => (
                  <div key={i} className={d.evChip}>
                    <span className={d.evTitle}>{ev.title}</span>
                    <span className={d.evMeta}>{formatTimeRange(ev.time, ev.endTime)}</span>
                    <span className={d.evLoc}>{ev.location}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className={d.lead} style={{ textAlign: "center", marginTop: 28 }}>
        Times are planned and may shift — check back closer to the week.
      </p>

      <p className={d.sign}>Sarà indimenticabile</p>
      <p className={d.signSub}>It&rsquo;ll be unforgettable</p>
    </>
  );
}

/* -------------------------------------------------------------------- RSVP */

export const rsvpMeta: TabMeta = {
  title: "RSVP",
  subtitle: "Let us know if you'll be joining us in Tuscany.",
  titleTone: "coral",
  active: "rsvp",
  art: "/assets/art/dutch-bouquet.jpg", // dramatic dark florals — intimate
};

export function RsvpBody() {
  return (
    <>
      <p className={d.lead} style={{ textAlign: "center", marginTop: 4 }}>
        Kindly respond by {siteContent.wedding.rsvpDeadlineLabel.replace(/^By /, "")}
      </p>
      <KindlyRespondCard />
      <p className={d.sign}>Con amore</p>
      <p className={d.signSub}>With love, Kelsey &amp; Andrew</p>
    </>
  );
}
