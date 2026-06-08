import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from './assets/logo.png';
import {
  ChevronRight,
  Search,
  Sparkles,
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  MoreHorizontal,
  Reply,
  Forward,
  Paperclip,
  Menu,
  X,
  Check,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

// ==========================================
// LOCAL SVG DEFINITIONS FOR MISSING BRAND ICONS
// ==========================================

const Chrome = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ==========================================
// SHARED PRIMITIVES & LOGOS (Upzeal Landing)
// ==========================================

const AppleLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 384 512" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const LogoMark = ({ className = "w-12 h-12" }: { className?: string }) => (
  <img src={logo} className={`${className} object-contain rounded-lg`} alt="Upzeal Logo" />
);

const SectionEyebrow = ({ label, tag }: { label: string; tag?: string }) => (
  <div className="inline-flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-white" />
    <span className="text-xs uppercase tracking-widest font-semibold text-white/50">{label}</span>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-white/50 bg-white/5 font-medium">
        {tag}
      </span>
    )}
  </div>
);

// ==========================================
// CORE APP COMPONENT
// ==========================================

export default function App() {
  const [view, setView] = useState<'landing' | 'signup'>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(false);

  // Sign up form states
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const TECH_STACK_OPTIONS = [
    { id: 'github', label: 'GitHub' },
    { id: 'gitlab', label: 'GitLab' },
    { id: 'python', label: 'Python / FastAPI' },
    { id: 'node', label: 'Node.js / Express' },
    { id: 'react', label: 'React / Next.js' },
    { id: 'vue', label: 'Vue.js' },
    { id: 'aws', label: 'AWS / Cloudflare' },
    { id: 'docker', label: 'Docker / K8s' }
  ];

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSocialLoading(true);
    setTimeout(() => {
      setIsSocialLoading(false);
      setSignupStep(prev => prev + 1);
    }, 800);
  };

  const handleFinish = () => {
    setIsSocialLoading(true);
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1500);
  };

  const toggleTech = (id: string) => {
    setSelectedTech(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Gradient style configuration for the "Revitalized" text
  const gradientStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 20%, #A4F4FD 40%, #00d2ff 50%, #A4F4FD 60%, #0B2551 80%, #091020 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };

  const AppleButton = ({ label, onClick, full = false }: { label: string; onClick?: () => void; full?: boolean }) => (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer ${full ? 'w-full' : ''}`}
    >
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
    </button>
  );

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white"
        >
          {/* Global Background Video */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover pointer-events-none"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
            />
          </div>

          {/* Global Guide Lines */}
          <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
          <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

          {/* SVG Grain filter for shiny text */}
          <svg className="hidden">
            <defs>
              <filter id="c3-noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
                <feComposite in2="SourceGraphic" operator="in" result="noise" />
                <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
              </filter>
            </defs>
          </svg>

          {/* ==========================================
              SECTION 1 — NAVBAR
              ========================================== */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-50 w-full"
          >
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
              {/* Logo Mark only */}
              <button onClick={() => setView('landing')} className="text-white hover:opacity-90 bg-transparent border-none cursor-pointer">
                <LogoMark className="w-12 h-12" />
              </button>

              {/* Desktop Nav Items */}
              <div className="hidden md:flex gap-8">
                {['Solutions', 'Pricing', 'Blog', 'Documentation', 'Careers'].map((item, idx) => (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/70 text-sm font-medium hover:text-white transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              {/* Right Desktop Button */}
              <div className="hidden md:block">
                <AppleButton label="Join the Platform" onClick={() => setView('signup')} />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-b border-white/10 bg-[#0c0c0c]/95 backdrop-blur-lg overflow-hidden"
                >
                  <div className="px-6 py-6 flex flex-col gap-4">
                    {['Solutions', 'Pricing', 'Blog', 'Documentation', 'Careers'].map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-white/70 text-base font-medium hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    ))}
                    <div className="pt-4 border-t border-white/10">
                      <AppleButton label="Join the Platform" onClick={() => { setMobileMenuOpen(false); setView('signup'); }} full />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          {/* ==========================================
              SECTION 2 — HERO
              ========================================== */}
          <section className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="pt-16 md:pt-28 pb-20 text-center flex flex-col items-center">
              {/* Headline H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.0] max-w-3xl"
              >
                Prove your skills.<br />
                <span className="animate-shiny inline-block" style={gradientStyle}>
                  Get hired
                </span>
              </motion.h1>

              {/* Subtitle paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 text-white/60 max-w-md text-base leading-[1.5]"
              >
                Upzeal is the premier virtual internship and skill verification platform. Prove your engineering vector with real-world Git history assessments and connect with top-tier tech companies.
              </motion.p>

              {/* CTA and Download Hint */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-10 flex flex-col items-center gap-3"
              >
                <AppleButton label="Join the Platform" onClick={() => setView('signup')} />
                <span className="text-xs text-white/40 font-medium tracking-wide">
                  Download for Intel / Apple Silicon
                </span>
              </motion.div>
            </div>
          </section>

          {/* ==========================================
              SECTION 3 — MAC OS MENU BAR STRIP
              ========================================== */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative z-20 w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10"
          >
            <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/90">
              {/* Left menu items */}
              <div className="flex items-center gap-5">
                <AppleLogo className="w-3.5 h-3.5 fill-white" />
                <span className="font-bold">Upzeal</span>
                {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map((item, idx) => {
                  let visibilityClass = "";
                  if (idx > 2) visibilityClass = "hidden sm:inline";
                  if (idx > 3) visibilityClass = "hidden md:inline";
                  return (
                    <span key={item} className={`hover:opacity-75 cursor-default ${visibilityClass}`}>
                      {item}
                    </span>
                  );
                })}
              </div>

              {/* Right search and time */}
              <div className="flex items-center gap-4">
                <Search className="w-3.5 h-3.5 text-white/60" />
                <span className="font-medium opacity-80 select-none">Wed May 6 1:09 PM</span>
              </div>
            </div>
          </motion.section>

          {/* ==========================================
              SECTION 4 — INBOX MOCKUP
              ========================================== */}
          <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl"
            >
              {/* Traffic lights / title bar */}
              <div className="h-10 bg-black/20 border-b border-white/5 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-white/50 select-none font-medium">Upzeal — Mission Control</span>
                <div className="w-12" /> {/* spacer to balance traffic lights */}
              </div>

              {/* Mockup Workspace Grid */}
              <div className="grid grid-cols-12 h-[520px]">

                {/* Sidebar (col-span-3) */}
                <div className="col-span-3 border-r border-white/5 bg-black/30 p-4 flex flex-col justify-between">
                  <div>
                    {/* Compose button */}
                    <button onClick={() => setView('signup')} className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2.5 mb-6 hover:bg-neutral-100 transition-colors cursor-pointer">
                      <Sparkles className="w-3.5 h-3.5 fill-black" />
                      <span>Compose with Upzeal</span>
                    </button>

                    {/* Nav Items */}
                    <nav className="flex flex-col gap-1">
                      {[
                        { label: 'Inbox', icon: Inbox, count: 12, active: true },
                        { label: 'Starred', icon: Star, count: 3 },
                        { label: 'Sent', icon: Send },
                        { label: 'Drafts', icon: FileText, count: 2 },
                        { label: 'Archive', icon: Archive },
                        { label: 'Trash', icon: Trash2 },
                      ].map((folder) => {
                        const Icon = folder.icon;
                        return (
                          <button
                            key={folder.label}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${folder.active
                              ? 'bg-white/10 text-white'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{folder.label}</span>
                            </div>
                            {folder.count && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${folder.active ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
                                }`}>
                                {folder.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Labels Section */}
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 block mb-3">Labels</span>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { label: 'Work', color: 'bg-[#00d2ff]' },
                        { label: 'Personal', color: 'bg-[#A4F4FD]' },
                        { label: 'Travel', color: 'bg-[#f59e0b]' },
                        { label: 'Finance', color: 'bg-[#10b981]' },
                      ].map((tag) => (
                        <div key={tag.label} className="flex items-center gap-2 text-xs text-white/70 cursor-default hover:text-white transition-colors">
                          <span className={`w-2 h-2 rounded-full ${tag.color}`} />
                          <span>{tag.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message List (col-span-4) */}
                <div className="col-span-4 border-r border-white/5 flex flex-col h-full bg-black/10">
                  {/* Search bar header */}
                  <div className="p-3 border-b border-white/5 flex items-center gap-2 text-white/40 bg-black/20">
                    <Search className="w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search mail"
                      disabled
                      className="bg-transparent border-none text-xs text-white/80 placeholder-white/30 focus:outline-none w-full cursor-default"
                    />
                  </div>

                  {/* Message Items list */}
                  <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
                    {[
                      { sender: 'Linear', subject: 'Weekly product digest', body: 'Your team shipped 23 issues this week...', time: '9:41 AM', unread: true, active: true },
                      { sender: 'Sophia Chen', subject: 'Re: Q3 roadmap review', body: 'Thanks for sending the deck over. I had a few thoughts...', time: '8:12 AM', unread: true },
                      { sender: 'Figma', subject: 'Marcus commented on your file', body: 'Love the new direction on the landing hero.', time: 'Yesterday' },
                      { sender: 'Stripe', subject: 'Payout of $12,480.00 sent', body: 'Your payout is on its way to your bank...', time: 'Yesterday' },
                      { sender: 'Vercel', subject: 'Deployment ready for upzeal-web', body: 'Preview is live at upzeal-web-g3f.vercel.app', time: 'Mon' },
                      { sender: 'GitHub', subject: '[upzeal/core] PR #482 approved', body: 'david-lim approved your pull request.', time: 'Mon' },
                    ].map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 text-left cursor-default transition-colors relative ${msg.active ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                          }`}
                      >
                        {/* Unread indicator */}
                        {msg.unread && (
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand" />
                        )}
                        <div className="flex items-center justify-between mb-1 pl-1">
                          <span className={`text-xs font-semibold ${msg.unread ? 'text-white' : 'text-white/80'}`}>{msg.sender}</span>
                          <span className="text-[10px] text-white/40">{msg.time}</span>
                        </div>
                        <div className="text-xs font-medium text-white/95 mb-0.5 truncate pl-1">{msg.subject}</div>
                        <div className="text-[11px] text-white/50 line-clamp-1 pl-1">{msg.body}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reader (col-span-5) */}
                <div className="col-span-5 flex flex-col h-full bg-[#0d0f12]">
                  {/* Toolbar */}
                  <div className="h-11 px-4 border-b border-white/5 flex items-center justify-between bg-black/10">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white transition-colors"><Reply className="w-4 h-4" /></button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white transition-colors"><Forward className="w-4 h-4" /></button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white transition-colors"><Archive className="w-4 h-4" /></button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/60 hover:bg-white/5 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>

                  {/* Reader body */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {/* Header */}
                    <div>
                      <h2 className="text-base font-semibold text-white mb-3">Weekly product digest</h2>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center text-xs font-semibold text-white select-none">
                            L
                          </div>
                          <div className="text-xs">
                            <span className="font-semibold text-white">Linear</span>
                            <span className="text-white/40 ml-1.5">to me · 9:41 AM</span>
                          </div>
                        </div>
                        {/* Work tag */}
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-[#00d2ff]/10 text-[#00d2ff] rounded border border-[#00d2ff]/20">
                          Work
                        </span>
                      </div>
                    </div>

                    {/* Summary Card by Upzeal */}
                    <div className="rounded-xl border border-[#A4F4FD]/20 bg-[#A4F4FD]/5 p-3.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#A4F4FD]/10 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A4F4FD] mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 fill-[#A4F4FD]" />
                        <span>Summary by Upzeal</span>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        Your team closed 23 issues, merged 14 PRs, and shipped 2 features. Top contributor: Marcus. No action needed.
                      </p>
                    </div>

                    {/* Email text */}
                    <div className="text-xs text-white/80 flex flex-col gap-3 leading-relaxed">
                      <p>Hi team,</p>
                      <p>Here is your weekly digest of everything happening across your projects. This was a strong week with significant progress on the Q3 roadmap.</p>
                      <p>Twenty-three issues were closed, fourteen pull requests were merged, and two customer-facing features went out. The velocity trend continues to climb.</p>
                      <p>Let me know if you would like a deeper breakdown by project or contributor.</p>
                      <p className="text-white/50 pt-2">— The Linear team</p>
                    </div>

                    {/* Attachment pill */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer select-none">
                        <Paperclip className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-[11px] font-medium text-white/80">digest-may-6.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </section>

          {/* ==========================================
              SECTION 5 — FEATURE TRIAGE
              ========================================== */}
          <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex flex-col items-start text-left"
              >
                <SectionEyebrow label="Triage" tag="AI-native" />

                <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02] text-white">
                  Analyze your git history<br />in a single pass.
                </h2>

                <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
                  Upzeal reads your commits, understands code quality, and routes the noise away from the signal. Focus on what shows your real technical skills — the rest handles itself.
                </p>

                {/* Category Chips */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Auto-categorize", "Snooze for later", "Silent newsletters", "One-tap unsubscribe"].map((chip) => (
                    <span
                      key={chip}
                      className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:bg-white/5"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right column (Triaged stats cards) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="liquid-glass rounded-2xl p-5 w-full flex flex-col gap-4 text-left"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-sm font-semibold text-white/95">Today · 42 messages triaged</span>
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                </div>

                {/* Sub-cards */}
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      title: 'Priority (4)',
                      color: 'text-white',
                      dot: 'bg-white',
                      items: 'Sophia Chen — Q3 review, David Lim — contract signoff'
                    },
                    {
                      title: 'Follow-up (7)',
                      color: 'text-[#e5e5e5]',
                      dot: 'bg-neutral-300',
                      items: 'Marcus — design review, Figma — comment thread'
                    },
                    {
                      title: 'Updates (18)',
                      color: 'text-[#a3a3a3]',
                      dot: 'bg-neutral-400',
                      items: 'Vercel — deploy ready, GitHub — PR #482 merged'
                    },
                    {
                      title: 'Archived (13)',
                      color: 'text-[#525252]',
                      dot: 'bg-neutral-600',
                      items: 'Stripe payout · Newsletter · Receipts'
                    },
                  ].map((tier, idx) => (
                    <div key={idx} className="liquid-glass rounded-lg p-3 flex flex-col gap-1 transition-all hover:bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
                        <span className={`text-xs font-semibold ${tier.color}`}>{tier.title}</span>
                      </div>
                      <p className="text-[11px] text-white/50 pl-3.5 leading-relaxed truncate">
                        {tier.items}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ==========================================
              SECTION 6 — LOGOCLOUD
              ========================================== */}
          <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-white/5">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                Trusted by the world's most thoughtful teams
              </span>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 justify-center items-center">
                {['Linear', 'Vercel', 'Figma', 'Stripe', 'Ramp', 'Notion', 'Loom', 'Arc'].map((logo, idx) => (
                  <motion.div
                    key={logo}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="text-sm font-semibold tracking-tight text-white/50 hover:text-white cursor-default select-none transition-colors"
                  >
                    {logo}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ==========================================
              SECTION 7 — TESTIMONIALS
              ========================================== */}
          <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Upzeal gave our leadership team four hours of their week back. It reads like an assessment platform from the future.",
                  name: "Parker Wilf",
                  role: "Group Product Manager",
                  company: "MERCURY"
                },
                {
                  quote: "The command palette alone has changed how I process messages. I can't imagine going back to a traditional client.",
                  name: "Andrew von Rosenbach",
                  role: "Senior Engineering Program Manager",
                  company: "COHERE"
                },
                {
                  quote: "Triage that actually understands context. Our team stopped dreading Monday morning inboxes.",
                  name: "Mathies Christensen",
                  role: "Engineering Manager",
                  company: "LUNAR"
                }
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="liquid-glass rounded-2xl p-6 text-left flex flex-col justify-between"
                >
                  <blockquote className="text-sm text-white/80 leading-[1.6] italic">
                    "{card.quote}"
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-white/10">
                    <div className="text-sm font-semibold text-white">{card.name}</div>
                    <div className="text-xs text-white/50 mt-0.5">{card.role}</div>
                    <div className="text-xs text-white font-semibold tracking-wide uppercase mt-1">
                      {card.company}
                    </div>
                  </figcaption>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ==========================================
              SECTION 8 — PRICING
              ========================================== */}
          <section className="c3-pricing-section border-t border-white/10" id="pricing">
            {/* Pricing Specific Noise Filter */}
            <svg className="hidden">
              <defs>
                <filter id="c3-noise-pricing">
                  <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
                  <feComponentTransfer><feFuncA type="linear" slope="0.075" /></feComponentTransfer>
                  <feComposite in2="SourceGraphic" operator="in" result="noise" />
                  <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
                </filter>
              </defs>
            </svg>

            {/* Backdrop watermark text */}
            <div className="c3-watermark-container select-none pointer-events-none">
              <div className="c3-watermark-main" style={{ filter: 'url(#c3-noise-pricing)' }}>
                <span className="c3-watermark-line-1">Prove your skills.</span>
                <span className="c3-watermark-line-2">Get hired</span>
              </div>
            </div>

            {/* Pricing Toggle row */}
            <div className="c3-toggle-wrap">
              <span className="text-xs uppercase tracking-widest text-white/50 font-bold select-none">Yearly</span>
              <button
                onClick={() => setYearly(!yearly)}
                className={`c3-toggle ${yearly ? 'active' : ''}`}
                aria-label="Toggle billing duration"
              >
                <div className="c3-toggle-knob" />
              </button>
            </div>

            {/* Pricing Grid */}
            <div className="c3-grid">
              {/* Card 1: Student */}
              <div className="c3-card">
                <span className="c3-tier-small">Free</span>
                <span className="c3-tier-large">Student</span>
                <p className="c3-desc">Showcase your academic work, prove your skills, and launch your career.</p>
                <ul className="c3-list">
                  {[
                    "Verify up to 5 GitHub projects",
                    "Public developer portfolio page",
                    "Access to core skill challenges",
                    "Basic recruiter visibility",
                    "Standard support & community access"
                  ].map((item, idx) => (
                    <li key={idx}>
                      <span className="c3-check">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setView('signup')} className="c3-btn">Join</button>
              </div>

              {/* Card 2: Developer */}
              <div className="c3-card">
                <span className="c3-tier-small">
                  {yearly ? '$99,99/y' : '$9,99/m'}
                </span>
                <span className="c3-tier-large">Developer</span>
                <p className="c3-desc">For professional developers looking to accelerate their career and get noticed.</p>
                <ul className="c3-list">
                  {[
                    "Verify unlimited projects",
                    "Advanced portfolio themes & domains",
                    "Detailed skill analytics & profile views",
                    "Priority visibility in recruiter searches",
                    "Priority email & chat support"
                  ].map((item, idx) => (
                    <li key={idx}>
                      <span className="c3-check">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setView('signup')} className="c3-btn">Join</button>
              </div>

              {/* Card 3: Company */}
              <div className="c3-card c3-card-pro">
                <span className="c3-tier-small text-brand">
                  {yearly ? '$199,99/y' : '$19,99/m'}
                </span>
                <span className="c3-tier-large">Company</span>
                <p className="c3-desc">For teams and organizations seeking verified top-tier tech talent.</p>
                <ul className="c3-list">
                  {[
                    "Direct verified talent sourcing pipeline",
                    "Unlimited active job postings",
                    "Detailed skill assessment report replays",
                    "ATS integrations & team collaboration",
                    "Dedicated account manager & 24/7 support"
                  ].map((item, idx) => (
                    <li key={idx}>
                      <span className="c3-check">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setView('signup')} className="c3-btn">Join</button>
              </div>
            </div>
          </section>

          {/* ==========================================
              SECTION 9 — FINAL CTA
              ========================================== */}
          <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center"
            >
              {/* Radial Glow Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)',
                  opacity: 0.3
                }}
              />

              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-white">
                Close the tabs.<br />Open your day.
              </h2>

              <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
                Join thousands of builders, founders, and operators who treat email like a tool — not an obligation.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <AppleButton label="Join the Platform" onClick={() => setView('signup')} />
                <button onClick={() => setView('signup')} className="inline-flex items-center gap-2 rounded-full border border-white/15 text-white text-sm font-semibold px-5 py-3 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer">
                  <span>Talk to sales</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </section>
        </motion.div>
      ) : (
        /* ==========================================
            AURORA SIGN UP (Two-Column Registration)
            ========================================== */
        <motion.main
          key="signup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 text-white"
        >
          {/* Left Column (Hero & Pure Background Video) */}
          <div className="w-[52%] hidden lg:flex relative flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
            {/* Pure Background Video - CRITICAL: Absolutely no tint or overlay mask */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
                type="video/mp4"
              />
            </video>

            {/* Hero Content Over Video */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="z-10 w-full max-w-xs space-y-8"
            >
              {/* Brand/Logo */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                onClick={() => setView('landing')}
                className="flex items-center gap-3 cursor-pointer select-none group w-fit"
              >
                <LogoMark className="w-9 h-9 transition-transform group-hover:scale-110" />
                <span className="text-xl font-semibold tracking-tight">Upzeal</span>
              </motion.div>

              {/* Heading Block */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="text-left"
              >
                <h2 className="text-4xl font-medium tracking-tight whitespace-nowrap">Join Upzeal</h2>
                <p className="text-white/60 text-sm leading-relaxed mt-2 pr-4">
                  Follow these 2 quick phases to activate your space.
                </p>
              </motion.div>

              {/* Steps List */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                className="space-y-3 w-full"
              >
                <StepItem number={1} text="Register your identity" active={signupStep === 1} completed={signupStep > 1} />
                <StepItem number={2} text="Configure your dashboard" active={signupStep === 2} completed={signupStep > 2} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column (Sign Up Form) */}
          <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black relative">
            {/* Close Button to return to Homepage */}
            <button
              onClick={() => setView('landing')}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              aria-label="Back to homepage"
            >
              <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
            >
              {signupStep === 1 && (
                <>
                  <div className="text-left">
                    <h2 className="text-3xl font-medium tracking-tight">Create New Profile</h2>
                    <p className="text-white/40 text-sm mt-1">Input your basic details to begin the journey.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SocialButton icon={<Chrome className="w-4 h-4 text-white" />} label="Google" isLoading={isSocialLoading} onClick={() => handleNextStep()} />
                    <SocialButton icon={<Github className="w-4 h-4 text-white" />} label="GitHub" isLoading={isSocialLoading} onClick={() => handleNextStep()} />
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-xs font-medium text-white/40 uppercase tracking-widest bg-black px-4 select-none">
                      Or
                    </span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <form
                    onSubmit={handleNextStep}
                    className="space-y-4 text-left"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="First Name" placeholder="Jane" type="text" />
                      <InputGroup label="Last Name" placeholder="Doe" type="text" />
                    </div>
                    <InputGroup label="Email" placeholder="jane@example.com" type="email" />
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-white">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 pr-12 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-white/40">Requires at least 8 symbols.</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSocialLoading}
                      className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] mt-4 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Create Account'}
                    </button>
                  </form>
                  <div className="text-center text-sm text-white/40">
                    Member of the team?{' '}
                    <button
                      onClick={() => setView('landing')}
                      className="text-white hover:underline font-semibold bg-transparent border-none cursor-pointer p-0"
                    >
                      Log in
                    </button>
                  </div>
                </>
              )}

              {signupStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-left w-full"
                >
                  <div>
                    <h2 className="text-3xl font-medium tracking-tight">Tech Stack</h2>
                    <p className="text-white/40 text-sm mt-1">Select the technologies you work with daily.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {TECH_STACK_OPTIONS.map((tech) => {
                      const isSelected = selectedTech.includes(tech.id);
                      return (
                        <button
                          key={tech.id}
                          onClick={() => toggleTech(tech.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${isSelected
                            ? 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                            : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-white bg-white' : 'border-white/30'}`}>
                            {isSelected && <Check className="w-3 h-3 text-black" />}
                          </div>
                          {tech.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      onClick={() => setSignupStep(1)}
                      className="h-14 px-8 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleFinish()}
                      disabled={isSocialLoading || selectedTech.length === 0}
                      className="flex-1 h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Go to Dashboard'}
                    </button>
                  </div>
                </motion.div>
              )}

            </motion.div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// REUSABLE PRESENTATION COMPONENTS
// ==========================================

function StepItem({ number, text, active = false, completed = false }: { number: number; text: string; active?: boolean; completed?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all ${active
      ? 'bg-white text-black border border-white shadow-lg'
      : completed
        ? 'bg-white/5 text-white/50 border border-white/5'
        : 'bg-brand-gray text-white border-transparent'
      }`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${active
        ? 'bg-black text-white'
        : completed
          ? 'bg-white/20 text-white'
          : 'bg-white/10 text-white/40'
        }`}>
        {completed ? <Check className="w-3.5 h-3.5" /> : number}
      </span>
      <span className="text-sm font-semibold tracking-tight select-none">{text}</span>
    </div>
  );
}

function SocialButton({ icon, label, isLoading = false, onClick }: { icon: React.ReactNode; label: string; isLoading?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 h-12 w-full bg-black border border-white/10 rounded-xl hover:bg-white/5 active:scale-[0.98] transition-all select-none ${isLoading ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : icon}
      <span className="text-sm font-semibold text-white/90">{isLoading ? 'Connecting...' : label}</span>
    </button>
  );
}

function InputGroup({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
      />
    </div>
  );
}
