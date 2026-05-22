import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { useRef, createContext, useContext } from "react";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Kayeni Yusuf — Chartered Accountant & Entrepreneur" },
      { name: "description", content: "The life, ventures, and achievements of Kayeni Yusuf — chartered accountant, businessman, and breeder." },
    ],
  }),
});

const EASE = [0.22, 1, 0.36, 1] as const;

interface MotionCtxType {
  reduce: boolean;
}

const MotionCtx = createContext<MotionCtxType>({ reduce: false });

function useMotionCtx() {
  return useContext(MotionCtx);
}

const fadeUp: Variants = {
  hidden: { opacity: 1, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const SplitText = ({ text, className = "" }: { text: string; className?: string }) => {
  const { reduce } = useMotionCtx();
  if (reduce) {
    return <span className={className}>{text}</span>;
  }
  return (
    <motion.span
      className={className}
      variants={stagger}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 1, ease: EASE } },
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 1]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-end overflow-hidden noise">
      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
        <img src={portrait} alt="Kayeni Yusuf" className="w-full h-full object-cover object-center opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </motion.div>

      <motion.nav
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 1.5 : 1, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 md:p-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span>KY — Est. Legacy</span>
        <span className="hidden md:block">Lagos · Nigeria</span>
      </motion.nav>

      <div className="relative px-6 md:px-16 pb-20 md:pb-32 max-w-7xl">
        <motion.p
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 1.5 : 1, delay: 0.6 }}
          className="text-xs md:text-sm uppercase tracking-[0.4em] text-primary mb-6"
        >
          A life in chapters
        </motion.p>
        <h1 className="text-[15vw] md:text-[10vw] leading-[0.85] font-black">
          <SplitText text="Kayeni" className="block" />
          <span className="block text-gradient-gold italic font-light">
            <SplitText text="Yusuf." />
          </span>
        </h1>
        <motion.p
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 1.5 : 1, delay: 1.4 }}
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

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { reduce } = useMotionCtx();
  return (
    <motion.section
      variants={stagger}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className={`px-6 md:px-16 py-24 md:py-40 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Bio() {
  return (
    <Section>
      <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.4em] text-primary">01 — Portrait</motion.span>
      <motion.h2 variants={fadeUp} className="mt-6 text-4xl md:text-7xl font-light max-w-4xl leading-tight">
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

function Timeline() {
  const { reduce } = useMotionCtx();
  return (
    <Section>
      <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.4em] text-primary">02 — Chapters</motion.span>
      <motion.h2 variants={fadeUp} className="mt-6 text-4xl md:text-6xl font-light max-w-3xl">
        Four lives, <em className="italic text-gradient-gold">one man.</em>
      </motion.h2>

      <div className="mt-20 space-y-px">
        {chapters.map((c, i) => (
          <motion.article
            key={c.title}
            variants={fadeUp}
            whileHover={reduce ? undefined : { x: 12 }}
            transition={reduce ? undefined : { type: "spring", stiffness: 200, damping: 20 }}
            className="group grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 border-t border-border items-baseline"
          >
            <div className="col-span-12 md:col-span-2 text-xs uppercase tracking-[0.3em] text-primary">
              0{i + 1} · {c.year}
            </div>
            <h3 className="col-span-12 md:col-span-4 text-2xl md:text-4xl font-display font-light group-hover:text-gradient-gold transition-colors">
              {c.title}
            </h3>
            <p className="col-span-12 md:col-span-6 text-muted-foreground leading-relaxed">
              {c.body}
            </p>
          </motion.article>
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
  return (
    <Section className="!max-w-none border-y border-border bg-card/30">
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
  return (
    <Section>
      <motion.blockquote variants={fadeUp} className="text-3xl md:text-6xl font-display font-light leading-tight max-w-5xl">
        <span className="text-primary">"</span>
        Numbers tell you what happened. <em className="italic text-gradient-gold">Instinct</em> tells you what's next —
        whether it's a balance sheet, a brood of chicks, or a champion bloodline.
        <span className="text-primary">"</span>
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

function Index() {
  const shouldReduce = useReducedMotion() ?? false;
  return (
    <MotionCtx.Provider value={{ reduce: shouldReduce }}>
      <main className="min-h-screen overflow-x-hidden">
        <Hero />
        <Bio />
        <Stats />
        <Timeline />
        <Quote />
        <Footer />
      </main>
    </MotionCtx.Provider>
  );
}
