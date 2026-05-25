import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion, useInView, useMotionValue, animate, AnimatePresence, type Variants } from "framer-motion";
import { useRef, createContext, useContext, useState, useEffect, useId } from "react";
import portrait from "@/assets/portrait.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Kayeni Yusuf · Chartered Accountant & Entrepreneur" },
      { name: "description", content: "The life, ventures, and achievements of Kayeni Yusuf: chartered accountant, businessman, and breeder." },
    ],
  }),
});

const EASE = [0.22, 1, 0.36, 1] as const;

interface MotionCtxType {
  reduce: boolean;
  mobile: boolean;
  toggleReduce: () => void;
  userOverride: boolean | null;
}

const MotionCtx = createContext<MotionCtxType>({
  reduce: false,
  mobile: false,
  toggleReduce: () => {},
  userOverride: null,
});

function useMotionCtx() {
  return useContext(MotionCtx);
}

// Duration helpers — shorter on mobile, instant when reduced.
function useDurations() {
  const { reduce, mobile } = useMotionCtx();
  if (reduce) return { fast: 0, base: 0, slow: 0, stagger: 0, delay: 0 };
  if (mobile) return { fast: 0.25, base: 0.4, slow: 0.55, stagger: 0.04, delay: 0.05 };
  return { fast: 0.4, base: 0.8, slow: 1, stagger: 0.08, delay: 0.1 };
}

const SplitText = ({ text, className = "" }: { text: string; className?: string }) => {
  const { reduce, mobile } = useMotionCtx();
  // Non-animated fallback — semantic <span> with full text always visible.
  if (reduce) {
    return <span className={className}>{text}</span>;
  }
  const dur = mobile ? 0.5 : 1;
  const stag = mobile ? 0.04 : 0.08;
  return (
    <motion.span
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stag, delayChildren: 0.05 } } }}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: dur, ease: EASE } },
            } satisfies Variants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

function Hero() {
  const { reduce } = useMotionCtx();
  const d = useDurations();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 100]);

  return (
    <section ref={ref} className="relative min-h-dvh flex flex-col justify-end overflow-hidden noise" aria-labelledby="hero-heading">
      <motion.div style={{ y }} className="absolute inset-0 -z-10" aria-hidden="true">
        <img src={portrait} alt="" className="w-full h-full object-cover object-center opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </motion.div>

      <nav
        aria-label="Site"
        className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 md:p-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span>KY — Est. Legacy</span>
        <span className="hidden md:block">Lagos · Nigeria</span>
      </nav>

      <div className="relative px-6 md:px-16 pb-20 md:pb-32 max-w-7xl">
        <motion.p
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: d.base, delay: d.delay * 4 }}
          className="text-xs md:text-sm uppercase tracking-[0.4em] text-primary mb-6"
        >
          A life in chapters
        </motion.p>
        <h1 id="hero-heading" className="text-[15vw] md:text-[10vw] leading-[0.85] font-black">
          <SplitText text="Kayeni" className="block" />
          <span className="block text-gradient-gold italic font-light">
            <SplitText text="Yusuf." />
          </span>
        </h1>
        <motion.p
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: d.base, delay: d.delay * 8 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground"
        >
          Chartered accountant. Businessman. Quiet builder of unlikely ventures —
          from balance sheets to broiler houses to bloodlines.
        </motion.p>
      </div>

      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          aria-hidden="true"
          className="absolute bottom-6 right-6 md:right-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-block">
            ↓ Scroll
          </motion.span>
        </motion.div>
      )}
    </section>
  );
}

function Section({ children, className = "", ariaLabelledBy }: { children: React.ReactNode; className?: string; ariaLabelledBy?: string }) {
  const { reduce, mobile } = useMotionCtx();
  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: mobile ? 0.04 : 0.08, delayChildren: mobile ? 0.05 : 0.1 } },
  };
  return (
    <motion.section
      variants={stagger}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: mobile ? "-40px" : "-100px" }}
      aria-labelledby={ariaLabelledBy}
      className={`px-6 md:px-16 py-24 md:py-40 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function useFadeUp(): Variants {
  const { mobile } = useMotionCtx();
  return {
    hidden: { opacity: 1, y: mobile ? 20 : 40 },
    show: { opacity: 1, y: 0, transition: { duration: mobile ? 0.4 : 0.8, ease: EASE } },
  };
}

function Bio() {
  const fadeUp = useFadeUp();
  return (
    <Section ariaLabelledBy="bio-heading">
      <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.4em] text-primary">01 — Portrait</motion.span>
      <motion.h2 id="bio-heading" variants={fadeUp} className="mt-6 text-4xl md:text-7xl font-light max-w-4xl leading-tight">
        A man of <em className="text-gradient-gold not-italic font-normal">ledgers</em>, livestock, and long bets.
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        Kayeni Yusuf is a chartered accountant whose career has refused to sit
        still in a single office. Beyond the columns of debit and credit, he is
        a serial entrepreneur — a man whose curiosity has carried him from
        poultry pens at dawn to the high-strung world of imported pedigree dogs.
      </motion.p>
      <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        What ties it all together is method: the discipline of a numbers man
        applied to ventures most people would treat as hobbies.
      </motion.p>
    </Section>
  );
}

const chapters = [
  {
    year: "ICAN",
    title: "Chartered Accountant",
    body: "Earned full ICAN chartership, building a foundation in audit, financial reporting, and corporate strategy that anchors every venture since.",
  },
  {
    year: "BUSINESS",
    title: "Entrepreneur & Operator",
    body: "Founded and managed multiple enterprises across consulting, trade, and agribusiness — bringing accounting rigor to industries that rarely see it.",
  },
  {
    year: "FARM",
    title: "Poultry Farming",
    body: "Once ran a thriving poultry operation, scaling broiler and layer production with the same spreadsheet discipline applied to a balance sheet.",
  },
  {
    year: "KENNEL",
    title: "Foreign Dog Breeder",
    body: "Imports and breeds pedigree foreign dogs — Boerboels, Caucasian Shepherds, German Shepherds — a passion turned premium venture.",
  },
];

function TimelineItem({ c, i }: { c: typeof chapters[number]; i: number }) {
  const { reduce, mobile } = useMotionCtx();
  const fadeUp = useFadeUp();
  const [open, setOpen] = useState(!mobile); // desktop: always visible body; mobile: tap to expand
  const panelId = useId();
  const buttonId = useId();

  // Keep desktop expanded if viewport widens
  useEffect(() => {
    if (!mobile) setOpen(true);
  }, [mobile]);

  const expandable = mobile;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={reduce || mobile ? undefined : { x: 12 }}
      transition={reduce || mobile ? undefined : { type: "spring", stiffness: 200, damping: 20 }}
      className="group grid grid-cols-12 gap-4 md:gap-8 py-6 md:py-12 border-t border-border items-baseline"
    >
      <div className="col-span-12 md:col-span-2 text-xs uppercase tracking-[0.3em] text-primary">
        0{i + 1} · {c.year}
      </div>

      {expandable ? (
        <>
          <h3 className="col-span-12 md:col-span-4 m-0">
            <button
              id={buttonId}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="w-full text-left flex items-center justify-between gap-4 min-h-11 text-2xl md:text-4xl font-display font-light hover:text-gradient-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors"
            >
              <span>{c.title}</span>
              <span aria-hidden="true" className={`text-primary text-base transition-transform ${open ? "rotate-45" : ""}`}>+</span>
            </button>
          </h3>
          <div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            hidden={!open}
            className="col-span-12 md:col-span-6"
          >
            <p className="text-muted-foreground leading-relaxed mt-3 md:mt-0">{c.body}</p>
          </div>
        </>
      ) : (
        <>
          <h3 className="col-span-12 md:col-span-4 text-2xl md:text-4xl font-display font-light group-hover:text-gradient-gold transition-colors">
            {c.title}
          </h3>
          <p className="col-span-12 md:col-span-6 text-muted-foreground leading-relaxed">
            {c.body}
          </p>
        </>
      )}
    </motion.article>
  );
}

function Timeline() {
  const fadeUp = useFadeUp();
  return (
    <Section ariaLabelledBy="chapters-heading">
      <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.4em] text-primary">02 — Chapters</motion.span>
      <motion.h2 id="chapters-heading" variants={fadeUp} className="mt-6 text-4xl md:text-6xl font-light max-w-3xl">
        Four lives, <em className="italic text-gradient-gold">one man.</em>
      </motion.h2>

      <div className="mt-20 space-y-px">
        {chapters.map((c, i) => (
          <TimelineItem key={c.title} c={c} i={i} />
        ))}
        <div className="border-t border-border" />
      </div>
    </Section>
  );
}

const stats = [
  { value: "ICAN", label: "Chartered" },
  { value: "4+", label: "Ventures" },
  { value: "20yr", label: "Building" },
  { value: "∞", label: "Curiosity" },
];

function Stats() {
  const fadeUp = useFadeUp();
  return (
    <Section className="!max-w-none border-y border-border bg-card/30" ariaLabelledBy="stats-heading">
      <h2 id="stats-heading" className="sr-only">Career stats</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center md:text-left">
            <div className="text-5xl md:text-7xl font-display font-light text-gradient-gold">{s.value}</div>
            <div className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Quote() {
  const fadeUp = useFadeUp();
  return (
    <Section ariaLabelledBy="quote-heading">
      <h2 id="quote-heading" className="sr-only">Quote</h2>
      <motion.blockquote variants={fadeUp} className="text-3xl md:text-6xl font-display font-light leading-tight max-w-5xl">
        <span aria-hidden="true" className="text-primary">"</span>
        Numbers tell you what happened. <em className="italic text-gradient-gold">Instinct</em> tells you what's next —
        whether it's a balance sheet, a brood of chicks, or a champion bloodline.
        <span aria-hidden="true" className="text-primary">"</span>
      </motion.blockquote>
      <motion.footer variants={fadeUp} className="mt-10 text-sm uppercase tracking-[0.3em] text-muted-foreground">
        — Kayeni Yusuf
      </motion.footer>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-16 py-16 border-t border-border max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
      <span>© Kayeni Yusuf — A Biographical Sketch</span>
      <span>Crafted with care.</span>
    </footer>
  );
}

function MotionToggle() {
  const { reduce, toggleReduce, userOverride } = useMotionCtx();
  return (
    <button
      type="button"
      onClick={toggleReduce}
      aria-pressed={reduce}
      aria-label={reduce ? "Enable animations" : "Reduce motion"}
      title={userOverride === null ? "Following system preference" : "User override active"}
      className="fixed bottom-4 right-4 z-50 min-h-11 min-w-11 px-3 rounded-full border border-border bg-background/80 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
    >
      {reduce ? "Motion: Off" : "Motion: On"}
    </button>
  );
}

function Index() {
  const systemReduce = useReducedMotion() ?? false;
  const [userOverride, setUserOverride] = useState<boolean | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("reduce-motion");
      if (stored === "true") setUserOverride(true);
      else if (stored === "false") setUserOverride(false);
    } catch {}
  }, []);

  const reduce = userOverride ?? systemReduce;
  const mobile = useIsMobile();

  const toggleReduce = () => {
    const next = !reduce;
    setUserOverride(next);
    try {
      localStorage.setItem("reduce-motion", String(next));
    } catch {}
  };

  return (
    <MotionCtx.Provider value={{ reduce, mobile, toggleReduce, userOverride }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-border focus:rounded-sm"
      >
        Skip to content
      </a>
      <main id="main" className="min-h-dvh overflow-x-hidden">
        <Hero />
        <Bio />
        <Stats />
        <Timeline />
        <Quote />
        <Footer />
      </main>
      <MotionToggle />
    </MotionCtx.Provider>
  );
}
