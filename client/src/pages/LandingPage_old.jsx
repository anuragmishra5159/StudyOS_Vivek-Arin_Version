import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Calculator,
  CheckSquare,
  ChevronRight,
  Clock,
  Code2,
  Database,
  ExternalLink,
  Github,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  Pencil,
  StickyNote,
  Target,
  TrendingUp,
  Wind,
  Zap,
  BarChart2,
  Award,
  ArrowRight,
  Star,
  Play,
  Sparkles,
  Brain,
  Flame,
} from "lucide-react";

// ─── Animation Variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Reusable InView Wrapper ────────────────────────────────────────────────
function AnimateWhenVisible({
  children,
  variants = fadeUp,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Label ──────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 mb-4">
      <Sparkles size={12} />
      {children}
    </span>
  );
}

// ─── Neumorphic Ring ────────────────────────────────────────────────────────
function Ring({ pct, label, value, color }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={r}
            stroke="#e2e6f0"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r={r}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-text-main">{value}</span>
        </div>
      </div>
      <span className="text-xs text-text-secondary font-medium">{label}</span>
    </div>
  );
}

// ─── Dashboard Mockup ──────────────────────────────────────────────────────
function DashboardMockup() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const minutes = String(Math.floor((1500 - tick) / 60) % 60).padStart(2, "0");
  const seconds = String((1500 - tick) % 60).padStart(2, "0");
  const timerPct = Math.min(100, (tick / 1500) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      className="relative w-full max-w-3xl mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Glow */}
      <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-emerald-300/10 to-transparent rounded-3xl blur-3xl pointer-events-none" />

      {/* Browser bar */}
      <div className="bg-surface rounded-2xl shadow-float overflow-hidden border border-border/50">
        <div className="flex items-center gap-2 px-4 py-3 bg-background/60 border-b border-border/40">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <div className="flex-1 ml-3 bg-border/30 rounded-full h-5 flex items-center px-3">
            <span className="text-[10px] text-text-muted font-medium">
              mantessa.app/dashboard
            </span>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="flex h-64 md:h-80 overflow-hidden">
          {/* Sidebar strip */}
          <div className="w-14 bg-background/80 border-r border-border/30 flex flex-col items-center py-4 gap-4">
            {[LayoutDashboard, CheckSquare, Calendar, BookOpen, Calculator].map(
              (Icon, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    i === 0
                      ? "bg-primary text-white shadow-glow"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  <Icon size={15} />
                </div>
              ),
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 bg-background/40 overflow-hidden">
            <div className="grid grid-cols-3 gap-3 h-full">
              {/* Focus Timer */}
              <div className="col-span-1 bg-surface rounded-xl p-3 shadow-card flex flex-col items-center justify-center gap-2">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#e2e6f0"
                      strokeWidth="5"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#10b981"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(timerPct / 100) * 175.93} 175.93`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-text-main">
                      {minutes}:{seconds}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-text-secondary">
                  Focus Timer
                </span>
              </div>

              {/* Activity rings */}
              <div className="col-span-1 bg-surface rounded-xl p-3 shadow-card flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2">
                  {[
                    { pct: 78, c: "#10b981" },
                    { pct: 55, c: "#6366f1" },
                    { pct: 92, c: "#f59e0b" },
                  ].map(({ pct, c }, i) => {
                    const r = 14,
                      circ = 2 * Math.PI * r;
                    return (
                      <svg
                        key={i}
                        width="38"
                        height="38"
                        className="-rotate-90"
                      >
                        <circle
                          cx="19"
                          cy="19"
                          r={r}
                          stroke="#e2e6f0"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="19"
                          cy="19"
                          r={r}
                          stroke={c}
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                        />
                      </svg>
                    );
                  })}
                </div>
                <span className="text-[10px] font-semibold text-text-secondary">
                  Activity Rings
                </span>
              </div>

              {/* Tasks panel */}
              <div className="col-span-1 bg-surface rounded-xl p-3 shadow-card flex flex-col gap-1.5 overflow-hidden">
                <span className="text-[10px] font-semibold text-text-secondary mb-1">
                  Tasks
                </span>
                {["Study Calculus", "Lab Report", "Read Ch. 5"].map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`w-3 h-3 rounded-full border ${i === 0 ? "bg-primary border-primary" : "border-border"}`}
                    />
                    <span
                      className={`text-[9px] ${i === 0 ? "line-through text-text-muted" : "text-text-secondary"}`}
                    >
                      {t}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats bar */}
              <div className="col-span-3 bg-surface rounded-xl p-3 shadow-card flex items-center justify-between">
                {[
                  {
                    label: "Study Hours",
                    value: "4.5h",
                    icon: Clock,
                    color: "text-primary",
                  },
                  {
                    label: "Tasks Done",
                    value: "12/15",
                    icon: CheckSquare,
                    color: "text-indigo-500",
                  },
                  {
                    label: "Streak",
                    value: "7d 🔥",
                    icon: Flame,
                    color: "text-orange-500",
                  },
                  {
                    label: "Focus Score",
                    value: "82%",
                    icon: Target,
                    color: "text-amber-500",
                  },
                ].map(({ label, value, icon: Icon, color }, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <Icon size={12} className={color} />
                    <span className="text-[11px] font-bold text-text-main">
                      {value}
                    </span>
                    <span className="text-[9px] text-text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Feature Card ───────────────────────────────────────────────────────────
const features = [
  {
    icon: LayoutDashboard,
    title: "Immersive Dashboard",
    desc: "A central hub with live stats, activity rings, and focus tracking for total academic awareness.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Focus Timer (Pomodoro)",
    desc: "Built-in distraction-free timer with progress rings to maximize your deep work sessions.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    icon: CheckSquare,
    title: "Smart Todo Lists",
    desc: "Advanced task management with priority levels, categories, and real-time status tracking.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Calendar,
    title: "Academic Calendar",
    desc: "Drag-and-drop scheduling for exams, assignments, and study blocks with deadline alerts.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: StickyNote,
    title: "Sticky Notes",
    desc: "Digital scratchpad for quick ideas and reminders, always within reach inside your workspace.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Calculator,
    title: "Scientific Calculator",
    desc: "Embedded calculator for advanced math, physics, and science — no app switching needed.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Pencil,
    title: "Creative Drawing Pad",
    desc: "Infinite canvas for mind-mapping, diagrams, and visual brainstorming to unlock creativity.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: BookOpen,
    title: "Collaborative Notebooks",
    desc: "Rich markdown notebooks with shareable links for collaborative note-taking and studying.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

// ─── How It Works Steps ─────────────────────────────────────────────────────
const steps = [
  {
    step: "01",
    icon: Layers,
    title: "Organize Everything",
    desc: "Import your tasks, subjects, and deadlines. Mantessa structures your entire semester at a glance.",
    color: "from-primary/20 to-emerald-200/20",
  },
  {
    step: "02",
    icon: Brain,
    title: "Focus Intelligently",
    desc: "Activate Pomodoro sessions, block distractions, and let the smart timer guide your study blocks.",
    color: "from-indigo-200/20 to-blue-200/20",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Track & Improve",
    desc: "Review productivity rings, streaks, and completion graphs to continuously optimize your habits.",
    color: "from-amber-200/20 to-orange-200/20",
  },
];

// ─── Tech stack ─────────────────────────────────────────────────────────────
const stack = [
  {
    name: "React",
    icon: "⚛️",
    desc: "Frontend UI",
    color: "from-cyan-400/20 to-blue-400/20 border-cyan-200",
  },
  {
    name: "Node.js",
    icon: "🟢",
    desc: "Backend Runtime",
    color: "from-green-400/20 to-emerald-400/20 border-green-200",
  },
  {
    name: "Express",
    icon: "🚀",
    desc: "REST API",
    color: "from-gray-300/20 to-slate-300/20 border-gray-200",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    desc: "Database",
    color: "from-green-300/20 to-teal-300/20 border-green-200",
  },
  {
    name: "Tailwind CSS",
    icon: "🎨",
    desc: "Styling Engine",
    color: "from-sky-300/20 to-cyan-300/20 border-sky-200",
  },
  {
    name: "Framer Motion",
    icon: "✨",
    desc: "Animations",
    color: "from-purple-300/20 to-violet-300/20 border-purple-200",
  },
];

// ─── Testimonials ───────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Aria K.",
    role: "Computer Science Junior",
    text: "Mantessa replaced 5 different apps for me. Everything I need for a productive study session is right there.",
    avatar: "AK",
  },
  {
    name: "Marcus T.",
    role: "Medical Student",
    text: "The Pomodoro timer and activity rings keep me accountable. My study hours went up 40% in the first week.",
    avatar: "MT",
  },
  {
    name: "Priya N.",
    role: "Data Science Graduate",
    text: "The notebook sharing feature is incredible for group study. Clean, fast, and actually enjoyable to use.",
    avatar: "PN",
  },
];

// ─── Main Landing Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(244,247,254,0)", "rgba(244,247,254,0.95)"],
  );
  const navShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0px 0px transparent", "0 4px 30px rgba(0,0,0,0.06)"],
  );

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <motion.nav
        style={{ backgroundColor: navBg, boxShadow: navShadow }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text-main tracking-tight">
              Study<span className="text-primary">OS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            {["Features", "How It Works", "Stack", "Testimonials"].map(
              (link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {link}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-glow hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        {/* Soft background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-10 w-60 h-60 bg-amber-200/10 rounded-full blur-3xl" />
          {/* Floating neumorphic cards in bg */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute top-40 right-16 w-40 h-24 bg-surface rounded-2xl shadow-card opacity-60"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="hidden lg:block absolute bottom-48 left-12 w-32 h-20 bg-surface rounded-2xl shadow-card opacity-50"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="hidden lg:block absolute top-56 left-24 w-24 h-14 bg-surface rounded-xl shadow-soft opacity-40"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
              <Star size={11} fill="currentColor" />
              Built for Students, Loved by Learners
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-main leading-tight tracking-tight mb-6"
          >
            Your Complete{" "}
            <span className="relative">
              <span className="text-primary">Academic</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/30 rounded-full" />
            </span>{" "}
            Productivity Workspace
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed mb-10"
          >
            Mantessa unifies task management, scheduling, and creative tools into
            one powerful platform for students and lifelong learners.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/login"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-semibold text-base shadow-glow hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Get Started Free
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
            <button className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-surface font-semibold text-base text-text-main shadow-soft hover:shadow-card transition-all duration-200 hover:scale-105 active:scale-95 border border-border/50">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Play size={10} className="text-primary fill-primary ml-0.5" />
              </div>
              View Demo
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 text-sm text-text-muted"
          >
            <div className="flex -space-x-2">
              {["AK", "MT", "PN", "JL", "SR"].map((init) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-indigo-400/40 border-2 border-background flex items-center justify-center text-[10px] font-bold text-text-main"
                >
                  {init}
                </div>
              ))}
            </div>
            <span>
              <strong className="text-text-main">2,000+</strong> students
              already productive
            </span>
            <span className="hidden sm:block text-border">·</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={13}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <DashboardMockup />
        </div>
      </section>

      {/* ── Stats Banner ────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <AnimateWhenVisible>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                value: "8+",
                label: "Integrated Tools",
                icon: Zap,
                color: "text-primary",
              },
              {
                value: "40%",
                label: "More Study Hours",
                icon: TrendingUp,
                color: "text-indigo-500",
              },
              {
                value: "2K+",
                label: "Active Students",
                icon: Award,
                color: "text-amber-500",
              },
              {
                value: "99.9%",
                label: "Uptime Reliability",
                icon: Target,
                color: "text-pink-500",
              },
            ].map(({ value, label, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-surface rounded-2xl p-6 shadow-card text-center hover:shadow-float transition-all duration-300 hover:-translate-y-1"
              >
                <Icon size={22} className={`${color} mx-auto mb-3`} />
                <div className="text-3xl font-extrabold text-text-main mb-1">
                  {value}
                </div>
                <div className="text-sm text-text-secondary font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </AnimateWhenVisible>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
              Everything You Need to Excel
            </h2>
            <p className="max-w-xl mx-auto text-text-secondary text-lg">
              Eight powerful tools, one seamless workspace — built so you never
              have to leave to get things done.
            </p>
          </AnimateWhenVisible>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <motion.div
                key={title}
                variants={scaleIn}
                className="group bg-surface rounded-2xl p-6 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-2 cursor-default border border-border/30"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-bold text-text-main text-base mb-2">
                  {title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Productivity Visualization ───────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateWhenVisible className="text-center mb-16">
            <SectionLabel>Productivity Visualization</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
              See Your Progress, Feel the Growth
            </h2>
            <p className="max-w-xl mx-auto text-text-secondary text-lg">
              Elegant analytics dashboards transform raw study data into
              actionable visual insights.
            </p>
          </AnimateWhenVisible>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Stats cards */}
            <AnimateWhenVisible className="space-y-5">
              {[
                {
                  label: "Mathematics",
                  pct: 85,
                  color: "bg-primary",
                  text: "text-primary",
                },
                {
                  label: "Physics",
                  pct: 62,
                  color: "bg-indigo-500",
                  text: "text-indigo-500",
                },
                {
                  label: "Computer Science",
                  pct: 93,
                  color: "bg-amber-500",
                  text: "text-amber-500",
                },
                {
                  label: "Literature",
                  pct: 48,
                  color: "bg-pink-500",
                  text: "text-pink-500",
                },
              ].map(({ label, pct, color, text }) => (
                <div
                  key={label}
                  className="bg-surface rounded-2xl p-5 shadow-card"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-text-main text-sm">
                      {label}
                    </span>
                    <span className={`text-sm font-bold ${text}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className={`h-full ${color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </AnimateWhenVisible>

            {/* Right: Ring visualization + daily goals */}
            <AnimateWhenVisible delay={0.2}>
              <div className="bg-surface rounded-3xl p-8 shadow-float border border-border/30">
                <h3 className="font-bold text-text-main mb-6 text-center">
                  Today's Stats
                </h3>
                <div className="flex justify-around mb-8">
                  <Ring
                    pct={78}
                    label="Study Hours"
                    value="4.5h"
                    color="#10b981"
                  />
                  <Ring
                    pct={55}
                    label="Tasks Done"
                    value="12/22"
                    color="#6366f1"
                  />
                  <Ring
                    pct={92}
                    label="Focus Score"
                    value="92%"
                    color="#f59e0b"
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-text-secondary text-sm mb-3">
                    Daily Goals
                  </h4>
                  {[
                    { goal: "Study 5 Hours", done: true },
                    { goal: "Complete 3 Tasks", done: true },
                    { goal: "Review Flashcards", done: false },
                    { goal: "Submit Assignment", done: false },
                  ].map(({ goal, done }) => (
                    <div key={goal} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? "bg-primary border-primary" : "border-border"}`}
                      >
                        {done && (
                          <svg
                            width="9"
                            height="7"
                            viewBox="0 0 9 7"
                            fill="none"
                          >
                            <path
                              d="M1 3.5L3.5 6L8 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${done ? "line-through text-text-muted" : "text-text-main font-medium"}`}
                      >
                        {goal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateWhenVisible>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
              Three Steps to Peak Performance
            </h2>
            <p className="max-w-xl mx-auto text-text-secondary text-lg">
              No complex onboarding. No friction. Just open Mantessa and start
              producing.
            </p>
          </AnimateWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />

            {steps.map(({ step, icon: Icon, title, desc, color }, i) => (
              <AnimateWhenVisible key={step} delay={i * 0.15}>
                <div
                  className={`bg-gradient-to-br ${color} rounded-3xl p-8 shadow-card border border-border/20 hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-center relative overflow-hidden`}
                >
                  <span className="absolute top-4 right-4 text-6xl font-black text-text-main/5 select-none">
                    {step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-surface shadow-card mx-auto flex items-center justify-center mb-5">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">
                    {title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </AnimateWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-24 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateWhenVisible className="text-center mb-16">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
              Loved by Students Everywhere
            </h2>
          </AnimateWhenVisible>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map(({ name, role, text, avatar }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="bg-surface rounded-2xl p-7 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-1 border border-border/30"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-text-secondary leading-relaxed mb-6 text-sm">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-indigo-400/30 flex items-center justify-center text-sm font-bold text-text-main shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-text-main text-sm">
                      {name}
                    </div>
                    <div className="text-text-muted text-xs">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────── */}
      <section id="stack" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <SectionLabel>Technology Stack</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
              Built on a Modern, Robust Stack
            </h2>
            <p className="max-w-xl mx-auto text-text-secondary text-lg">
              Industry-standard technologies combine to deliver a fast,
              reliable, and scalable platform.
            </p>
          </AnimateWhenVisible>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {stack.map(({ name, icon, desc, color }) => (
              <motion.div
                key={name}
                variants={scaleIn}
                className={`group bg-gradient-to-br ${color} rounded-2xl p-5 border shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-2 text-center cursor-default`}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <div className="font-bold text-text-main text-sm mb-1">
                  {name}
                </div>
                <div className="text-text-muted text-xs">{desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <AnimateWhenVisible>
          <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-emerald-100/20 to-indigo-100/20" />
            <div className="absolute inset-0 shadow-float" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center px-8 py-16 md:py-20">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
                <Lightbulb size={12} />
                Free to Start
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight mb-5 leading-tight">
                Start Your Productivity
                <br />
                <span className="text-primary">Journey Today</span>
              </h2>
              <p className="text-text-secondary text-lg mb-10 max-w-lg mx-auto">
                Join thousands of students who have transformed their academic
                life with Mantessa.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-glow hover:bg-primary-dark transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Get Started — It's Free
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-surface text-text-main font-bold text-base shadow-card hover:shadow-float transition-all duration-200 hover:scale-105 active:scale-95 border border-border/50"
                >
                  <Github size={18} />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </AnimateWhenVisible>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                  <BookOpen size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold text-text-main">
                  Study<span className="text-primary">OS</span>
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                A premier, study-oriented productivity workspace that unifies
                all the tools students need into a single, cohesive platform.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-text-main text-sm mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Dashboard",
                  "Todo Lists",
                  "Calendar",
                  "Notebooks",
                  "Drawing Pad",
                ].map((l) => (
                  <li key={l}>
                    <Link
                      to="/login"
                      className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-main text-sm mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Documentation",
                  "GitHub",
                  "Changelog",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {l}
                      {l === "GitHub" && (
                        <ExternalLink
                          size={11}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              © 2026 Mantessa. Built with ❤️ for students everywhere.
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "GitHub", href: "https://github.com" },
                { label: "Twitter", href: "#" },
                { label: "Discord", href: "#" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-primary transition-colors duration-200 font-medium"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
