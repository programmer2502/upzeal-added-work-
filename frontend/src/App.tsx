import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from './assets/logo.png';
import { supabase } from './supabaseClient';
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
  Loader2,
  Code2,
  Briefcase,
  Server,
  Database,
  Cloud,
  Terminal,
  MonitorSmartphone,
  Settings,
  Layers,
  LayoutTemplate,
  TerminalSquare,
  LayoutDashboard,
  User,
  Activity,
  MapPin,
  Users,
  Edit3,
  MessageSquare
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
  const [view, setView] = useState<'landing' | 'signup' | 'dashboard'>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(false);

  // Sign up form states
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [accountType, setAccountType] = useState<'developer' | 'recruiter' | null>(null);

  // Supabase & dynamic user details states
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recruiterRole, setRecruiterRole] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Login states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Listen to Supabase Auth state shifts
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        setEmail(session.user.email || '');
        
        // Fetch user metadata from the public.users table
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, role, onboarding_phase')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAccountType(data.role as any);
        }
        setView('dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        setEmail(session.user.email || '');
        
        // Fetch user metadata from the public.users table
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name, role, onboarding_phase')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAccountType(data.role as any);
        }
      } else {
        setUser(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setAccountType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const TECH_STACK_CATEGORIES = [
    {
      title: "Frontend & UI",
      icon: <LayoutTemplate className="w-4 h-4" />,
      options: [
        { id: 'react', label: 'React / Next.js', icon: <Code2 className="w-4 h-4" /> },
        { id: 'vue', label: 'Vue.js', icon: <TerminalSquare className="w-4 h-4" /> },
        { id: 'mobile', label: 'React Native / iOS', icon: <MonitorSmartphone className="w-4 h-4" /> }
      ]
    },
    {
      title: "Backend & API",
      icon: <Server className="w-4 h-4" />,
      options: [
        { id: 'node', label: 'Node.js / Express', icon: <Terminal className="w-4 h-4" /> },
        { id: 'python', label: 'Python / FastAPI', icon: <Code2 className="w-4 h-4" /> },
        { id: 'go', label: 'Go / Rust', icon: <Settings className="w-4 h-4" /> }
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: <Cloud className="w-4 h-4" />,
      options: [
        { id: 'aws', label: 'AWS / GCP', icon: <Cloud className="w-4 h-4" /> },
        { id: 'docker', label: 'Docker / K8s', icon: <Layers className="w-4 h-4" /> },
        { id: 'database', label: 'PostgreSQL', icon: <Database className="w-4 h-4" /> }
      ]
    }
  ];

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSocialLoading(true);
    setTimeout(() => {
      setIsSocialLoading(false);
      setSignupStep(prev => prev + 1);
    }, 800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedUsername) {
      setAuthError("Username is required");
      return;
    }
    
    setIsSocialLoading(true);

    // Check if username already exists in public.users
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', trimmedUsername)
      .maybeSingle();

    if (checkError) {
      setIsSocialLoading(false);
      setAuthError("Failed to check username availability: " + checkError.message);
      return;
    }

    if (existingUser) {
      setIsSocialLoading(false);
      setAuthError("Username already exists");
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: trimmedUsername,
          first_name: firstName,
          last_name: lastName,
          role: accountType
        }
      }
    });
    
    setIsSocialLoading(false);
    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      setUser(data.user);
      setSignupStep(3);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword
    });
    
    setIsLoginLoading(false);
    if (error) {
      setLoginError(error.message);
    } else if (data.user) {
      setShowLoginModal(false);
      setView('dashboard');
    }
  };

  const handleDeveloperFinish = async () => {
    setIsSocialLoading(true);
    setAuthError(null);
    
    if (!user) {
      setIsSocialLoading(false);
      setAuthError("No active user session");
      return;
    }
    
    const { error } = await supabase
      .from('users')
      .update({
        dashboard_config: { tech_stack: selectedTech },
        onboarding_phase: 'phase_3'
      })
      .eq('id', user.id);
      
    setIsSocialLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setView('dashboard');
    }
  };

  const handleRecruiterFinish = async () => {
    setIsSocialLoading(true);
    setAuthError(null);
    
    if (!user) {
      setIsSocialLoading(false);
      setAuthError("No active user session");
      return;
    }
    
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        website: companyWebsite,
        description: `Role: ${recruiterRole}`,
        created_by: user.id
      })
      .select()
      .single();
      
    if (companyError) {
      setIsSocialLoading(false);
      setAuthError(companyError.message);
      return;
    }
    
    const { error: userError } = await supabase
      .from('users')
      .update({
        onboarding_phase: 'phase_3'
      })
      .eq('id', user.id);
      
    setIsSocialLoading(false);
    if (userError) {
      setAuthError(userError.message);
    } else {
      setView('dashboard');
    }
  };

  const handleFinish = () => {
    if (accountType === 'recruiter') {
      handleRecruiterFinish();
    } else {
      handleDeveloperFinish();
    }
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
          <div 
            className="fixed inset-0 z-0 pointer-events-none" 
            dangerouslySetInnerHTML={{ __html: `
            <video
              autoplay
              loop
              muted
              playsinline
              class="w-full h-full object-cover pointer-events-none"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
            ></video>
          ` }} />

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
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="text-sm font-semibold text-white/70 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                >
                  Log In
                </button>
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
      ) : view === 'signup' ? (
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
            <div 
              className="absolute inset-0 w-full h-full z-0 pointer-events-none"
              dangerouslySetInnerHTML={{ __html: `
              <video
                autoplay
                muted
                loop
                playsinline
                class="w-full h-full object-cover"
              >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" type="video/mp4" />
              </video>
            ` }} />

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
                  Follow these 3 quick phases to activate your space.
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
                <StepItem number={1} text="Choose Account Type" active={signupStep === 1} completed={signupStep > 1} />
                <StepItem number={2} text="Register your identity" active={signupStep === 2} completed={signupStep > 2} />
                <StepItem number={3} text={accountType === 'recruiter' ? "Company Details" : "Configure your dashboard"} active={signupStep === 3} completed={signupStep > 3} />
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
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 text-left w-full"
                >
                  <div>
                    <h2 className="text-3xl font-medium tracking-tight">How do you want to use Upzeal?</h2>
                    <p className="text-white/40 text-sm mt-1">We'll personalize your setup experience accordingly.</p>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    {/* Developer Option */}
                    <button
                      onClick={() => setAccountType('developer')}
                      className={`group relative flex items-center gap-5 w-full p-5 rounded-xl border transition-all cursor-pointer text-left ${
                        accountType === 'developer'
                          ? 'bg-[#00d2ff]/5 border-[#00d2ff]/40'
                          : 'bg-transparent border-[#333] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        accountType === 'developer' ? 'bg-[#00d2ff]/15' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Code2 className={`w-5 h-5 transition-colors ${accountType === 'developer' ? 'text-[#00d2ff]' : 'text-white/50'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-semibold transition-colors ${accountType === 'developer' ? 'text-white' : 'text-white/80'}`}>I'm a Developer</h3>
                        <p className="text-xs text-white/40 mt-0.5">Build your skill tree, take assessments, and showcase verified projects.</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        accountType === 'developer' ? 'border-[#00d2ff] bg-[#00d2ff] scale-110' : 'border-[#333] group-hover:border-white/30'
                      }`}>
                        {accountType === 'developer' && <Check className="w-3 h-3 text-black" />}
                      </div>
                    </button>

                    {/* Recruiter Option */}
                    <button
                      onClick={() => setAccountType('recruiter')}
                      className={`group relative flex items-center gap-5 w-full p-5 rounded-xl border transition-all cursor-pointer text-left ${
                        accountType === 'recruiter'
                          ? 'bg-white/5 border-white/30'
                          : 'bg-transparent border-[#333] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        accountType === 'recruiter' ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Briefcase className={`w-5 h-5 transition-colors ${accountType === 'recruiter' ? 'text-white' : 'text-white/50'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-semibold transition-colors ${accountType === 'recruiter' ? 'text-white' : 'text-white/80'}`}>I'm a Recruiter</h3>
                        <p className="text-xs text-white/40 mt-0.5">Hire verified talent, review technical assessments, and manage pipelines.</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        accountType === 'recruiter' ? 'border-white bg-white scale-110' : 'border-[#333] group-hover:border-white/30'
                      }`}>
                        {accountType === 'recruiter' && <Check className="w-3 h-3 text-black" />}
                      </div>
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleNextStep()}
                      disabled={!accountType || isSocialLoading}
                      className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Next: Register Identity'}
                    </button>
                  </div>
                </motion.div>
              )}

              {signupStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-left w-full"
                >
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
                    onSubmit={handleRegister}
                    className="space-y-4 text-left"
                  >
                    {authError && (
                      <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs">
                        {authError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup 
                        label="First Name" 
                        placeholder="Jane" 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                      />
                      <InputGroup 
                        label="Last Name" 
                        placeholder="Doe" 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                      />
                    </div>
                    <InputGroup 
                      label="Username" 
                      placeholder="janedoe123" 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                    />
                    <InputGroup 
                      label="Email" 
                      placeholder="jane@example.com" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
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
                    
                    <div className="pt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="h-14 px-8 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSocialLoading}
                        className="flex-1 h-14 bg-[#00d2ff] text-black font-semibold rounded-xl hover:bg-[#00d2ff]/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Create Account'}
                      </button>
                    </div>
                  </form>
                  <div className="text-center text-sm text-white/40 mt-4">
                    Member of the team?{' '}
                    <button
                      onClick={() => { setView('landing'); setShowLoginModal(true); }}
                      className="text-white hover:underline font-semibold bg-transparent border-none cursor-pointer p-0"
                    >
                      Log in
                    </button>
                  </div>
                </motion.div>
              )}

              {signupStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-left w-full"
                >
                  <div>
                    <h2 className="text-3xl font-medium tracking-tight">
                      {accountType === 'recruiter' ? 'Company Details' : 'Tech Stack'}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      {accountType === 'recruiter' ? 'Tell us about your organization.' : 'Select the technologies you work with daily.'}
                    </p>
                  </div>
                  
                  {authError && (
                    <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs">
                      {authError}
                    </div>
                  )}

                  {accountType === 'recruiter' ? (
                    <div className="space-y-4 mt-8">
                      <InputGroup 
                        label="Company Name" 
                        placeholder="Acme Corp" 
                        type="text" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)} 
                      />
                      <InputGroup 
                        label="Role" 
                        placeholder="Technical Recruiter" 
                        type="text" 
                        value={recruiterRole} 
                        onChange={(e) => setRecruiterRole(e.target.value)} 
                      />
                      <InputGroup 
                        label="Company Website" 
                        placeholder="https://acme.com" 
                        type="text" 
                        value={companyWebsite} 
                        onChange={(e) => setCompanyWebsite(e.target.value)} 
                      />
                    </div>
                  ) : (
                    <div className="space-y-6 mt-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {TECH_STACK_CATEGORIES.map((category) => (
                        <div key={category.title} className="space-y-3">
                          <h3 className="text-sm font-semibold flex items-center gap-2 text-white/70">
                            <span className="p-1.5 bg-white/5 rounded-md text-white">{category.icon}</span>
                            {category.title}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {category.options.map((tech) => {
                              const isSelected = selectedTech.includes(tech.id);
                              return (
                                <button
                                  key={tech.id}
                                  onClick={() => toggleTech(tech.id)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${isSelected
                                    ? 'bg-white/10 border-[#00d2ff] text-white shadow-[0_0_15px_rgba(0,210,255,0.1)]'
                                    : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                                  }`}
                                >
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${isSelected ? 'bg-[#00d2ff] text-black' : 'bg-transparent text-white/40 border border-white/10'}`}>
                                    {isSelected ? <Check className="w-4 h-4" /> : tech.icon}
                                  </div>
                                  {tech.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 flex gap-4">
                    <button
                      onClick={() => setSignupStep(2)}
                      className="h-14 px-8 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleFinish()}
                      disabled={isSocialLoading || (accountType === 'developer' && selectedTech.length === 0)}
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
      ) : accountType === 'recruiter' ? (
        <RecruiterDashboard 
          key="recruiter" 
          firstName={firstName} 
          lastName={lastName} 
          email={email} 
          onLogout={async () => {
            await supabase.auth.signOut();
            setView('landing');
          }}
        />
      ) : (
        <StudentDashboard 
          key="student" 
          userId={user?.id}
          firstName={firstName} 
          lastName={lastName} 
          email={email} 
          onLogout={async () => {
            await supabase.auth.signOut();
            setView('landing');
          }}
        />
      )}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md border border-white/10 rounded-2xl bg-[#0c0c0c]/95 p-8 text-left space-y-6 relative"
          >
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
              <p className="text-white/40 text-xs mt-1">Sign in to access your Upzeal dashboard.</p>
            </div>
            
            {loginError && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs">
                {loginError}
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <InputGroup 
                label="Email Address" 
                placeholder="you@example.com" 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 pr-12 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full h-12 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                {isLoginLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Sign In'}
              </button>
            </form>
          </motion.div>
        </div>
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

function InputGroup({ 
  label, 
  placeholder, 
  type, 
  value, 
  onChange 
}: { 
  label: string; 
  placeholder: string; 
  type: string; 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
      />
    </div>
  );
}
// ==========================================
// SEPARATE DASHBOARD COMPONENTS
// ==========================================

function StudentDashboard({ userId, firstName, lastName, email, onLogout }: { userId: string; firstName: string; lastName: string; email: string; onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'feed' | 'chat'>('dashboard');

  return (
    <div className="flex h-screen bg-[#0e1015] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#333] bg-[#0a0a0a] flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <Code2 className="w-6 h-6 text-[#00d2ff]" />
            <span className="font-bold text-lg tracking-tight">Upzeal</span>
          </div>
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'dashboard' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button 
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'profile' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <User className="w-4 h-4" />
              <span className="font-medium text-sm">Profile</span>
            </button>
            <button 
              onClick={() => setCurrentView('feed')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'feed' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <Activity className="w-4 h-4" />
              <span className="font-medium text-sm">Company Feed</span>
            </button>
            <button 
              onClick={() => setCurrentView('chat')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'chat' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Chat</span>
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-[#333] flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-white shadow-none border border-[#333] shrink-0">
                {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'U'}
             </div>
             <div className="overflow-hidden flex-1">
               <p className="text-sm font-semibold truncate">{firstName && lastName ? `${firstName} ${lastName}` : email}</p>
               <p className="text-xs text-white/50 font-mono truncate">{email}</p>
             </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full text-xs font-semibold text-white/60 hover:text-white border border-[#333] rounded-lg py-2 hover:bg-white/5 transition-colors cursor-pointer"
           >
             Log Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-[#0e1015] h-full">
        {currentView === 'dashboard' ? (
          <StudentBentoDashboard />
        ) : currentView === 'profile' ? (
          <StudentProfileView userId={userId} firstName={firstName} lastName={lastName} email={email} />
        ) : currentView === 'feed' ? (
          <StudentFeedView />
        ) : (
          <StudentChatView userId={userId} firstName={firstName} lastName={lastName} email={email} />
        )}
      </main>
    </div>
  );
}

function StudentBentoDashboard() {
  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Row: 3 column bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Column 1: Skill Progress (spans 5 cols) ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Skill Progress</h2>
              <p className="text-xs text-white/40 mt-0.5">3 mentors and @team have access.</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-white/60 border border-[#333] rounded-full px-3 py-1.5 hover:bg-white/5 transition-colors cursor-pointer">
              All Skills
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>

          {/* Overview Card */}
          <div className="border border-[#333] rounded-2xl bg-[#111318] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/90">Overview</h3>
              <button className="w-6 h-6 rounded-full border border-[#333] flex items-center justify-center text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Commit throughput</span>
                <p className="text-sm text-white/80 mt-0.5">2x increase to last month</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Growth rate</span>
                <p className="text-sm font-mono text-[#00d2ff] mt-0.5">+ 12.83 %</p>
              </div>
            </div>

            {/* Time Tabs */}
            <div className="flex gap-1 bg-[#0a0a0a] rounded-lg p-1 w-fit">
              <button className="text-[11px] font-medium px-3 py-1.5 rounded-md text-white/40 hover:text-white/60 transition-colors cursor-pointer">24h</button>
              <button className="text-[11px] font-medium px-3 py-1.5 rounded-md text-white/40 hover:text-white/60 transition-colors cursor-pointer">Week</button>
              <button className="text-[11px] font-medium px-3 py-1.5 rounded-md bg-[#1a1d24] text-white border border-[#333] cursor-pointer">Month</button>
            </div>

            {/* Chart */}
            <div className="relative">
              <svg className="w-full h-[140px]" viewBox="0 0 440 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,210,255,0.2)"/>
                    <stop offset="100%" stopColor="rgba(0,210,255,0)"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2="440" y2="35" stroke="rgba(255,255,255,0.04)"/>
                <line x1="0" y1="70" x2="440" y2="70" stroke="rgba(255,255,255,0.04)"/>
                <line x1="0" y1="105" x2="440" y2="105" stroke="rgba(255,255,255,0.04)"/>
                <path d="M0 120 C25 115,40 125,60 105 C80 85,95 105,115 90 C135 75,150 88,170 72 C190 56,210 75,235 58 C260 40,275 40,295 38 C295 38,310 18,310 18 L325 45 C345 55,360 38,380 38 C400 38,415 20,440 18 L440 140 L0 140Z" fill="url(#gFill)"/>
                <path d="M0 120 C25 115,40 125,60 105 C80 85,95 105,115 90 C135 75,150 88,170 72 C190 56,210 75,235 58 C260 40,275 40,295 38 C295 38,310 18,310 18 L325 45 C345 55,360 38,380 38 C400 38,415 20,440 18" fill="none" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="310" cy="18" r="4.5" fill="#111318" stroke="#00d2ff" strokeWidth="2.5"/>
                <circle cx="310" cy="18" r="1.5" fill="white"/>
                <line x1="310" y1="18" x2="310" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
              </svg>
              {/* Tooltip */}
              <div className="absolute top-0 left-[65%] -translate-x-1/2 bg-[#1a1d24] border border-[#333] rounded-lg px-3 py-2 pointer-events-none">
                <span className="text-[10px] text-white/50 block font-mono">Jun 4</span>
                <span className="text-sm font-semibold font-mono">5,538 XP</span>
                <span className="text-[10px] text-[#00d2ff] font-mono ml-1">+ 9.41 %</span>
              </div>
            </div>

            {/* Chart X-axis */}
            <div className="flex justify-between text-[10px] text-white/30 font-mono -mt-1">
              <span>May 8</span><span>May 18</span><span>May 28</span><span>Jun 8</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#333]">
              <span className="text-2xl font-bold font-mono text-[#00d2ff]">+ 19.23 <span className="text-base">%</span></span>
              <div className="text-right">
                <span className="text-[10px] text-white/30 block">Last updated</span>
                <span className="text-xs text-white/60 font-mono">Today, 06:49 AM</span>
              </div>
            </div>
          </div>

          {/* My Top Skills */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">My Top Skills</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-mono">02 of 5</span>
              <button className="w-7 h-7 border border-[#333] rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
              <button className="w-7 h-7 border border-[#333] rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Skill Cards Row */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'FastAPI', xp: '3,074', change: '9.23', color: 'bg-[#00d2ff]' },
              { name: 'WebSockets', xp: '2,931', change: '7.59', color: 'bg-[#10b981]' },
            ].map(skill => (
              <div key={skill.name} className="border border-[#333] rounded-2xl bg-[#111318] p-4 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${skill.color}`} />
                    <span className="text-sm font-semibold">{skill.name}</span>
                  </div>
                  <button className="text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold font-mono"># {skill.xp} XP</span>
                  <span className="text-xs font-mono text-[#10b981]">↑ {skill.change} %</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=a${skill.name}${i}`} alt="" className="w-6 h-6 rounded-full border-2 border-[#111318] object-cover" />
                    ))}
                    <span className="w-6 h-6 rounded-full bg-[#1a1d24] border-2 border-[#111318] flex items-center justify-center text-[8px] font-bold text-white/60">99+</span>
                  </div>
                  <button className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 2: XP Balance + AI Mentor (spans 4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Total XP Balance</h2>
              <p className="text-xs text-white/40 mt-0.5">The sum of all points on my profile</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-white/60 border border-[#333] rounded-full px-3 py-1.5 hover:bg-white/5 transition-colors cursor-pointer">
              All Time
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>

          {/* XP Card */}
          <div className="border border-[#333] rounded-2xl bg-[#111318] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold font-mono">★ 23,094</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Compared to last month</span>
              <span className="text-sm font-mono text-red-400">- 37.16 %</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-b border-[#333]">
              <span className="text-xs text-white/50 flex items-center gap-1.5">
                Yearly avg: <strong className="text-white font-mono">★ 34,502</strong>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </span>
              <a href="#" className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                How it works?
              </a>
            </div>

            {/* AI Mentor Box */}
            <div className="border border-[#00d2ff]/20 rounded-xl bg-[#00d2ff]/5 p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00d2ff]" />
                  AI Mentor
                </h4>
                <p className="text-[11px] text-white/40 mt-0.5">Technical help, interview prep, and project guidance</p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#00d2ff]">
                <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse" />
                Ready to help you learn
              </div>

              {/* Chat bubble */}
              <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-3">
                <p className="text-xs text-white/80 leading-relaxed">
                  <strong>Hi Hruday.</strong> Ask me a technical question and I will explain it clearly, give examples, and suggest what to practice next.
                </p>
              </div>

              {/* Suggestion pills */}
              <div className="flex flex-wrap gap-2">
                {['React hooks', 'DSA prep', 'Project idea'].map(tag => (
                  <button key={tag} className="text-[11px] font-medium px-2.5 py-1 border border-[#333] rounded-full text-white/60 hover:text-white hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/5 transition-colors cursor-pointer">
                    {tag}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Ask about React, Node.js, DSA, projects..."
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-xl h-10 px-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d2ff]/40"
                />
                <button className="h-10 px-4 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 3: Upgrade Promo (spans 3 cols) ── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Upgrade</h2>
              <p className="text-xs text-white/40 mt-0.5">Powered by Upzeal</p>
            </div>
            <button className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Next →</button>
          </div>

          <div className="border border-[#333] rounded-2xl bg-[#111318] p-5 space-y-4 relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00d2ff] bg-[#00d2ff]/10 px-2.5 py-1 rounded-full border border-[#00d2ff]/20">
              Just for today!
            </span>

            <h3 className="text-xl font-bold tracking-tight">
              ⚡ Let's Go Pro with <span className="text-[#f59e0b] bg-[#f59e0b]/10 px-1.5 py-0.5 rounded">40%</span>
            </h3>
            <p className="text-xs text-white/50 font-medium">This is your amazing chance!</p>
            <p className="text-xs text-white/60 leading-relaxed">
              Premium unlocks unlimited AI mentorship, recruiter visibility, and advanced analytics for your developer profile.
            </p>
            <a href="#" className="text-xs text-[#00d2ff] hover:underline">Learn more →</a>

            <div className="flex items-center justify-between pt-4 border-t border-[#333]">
              <span className="text-[11px] text-white/30 cursor-pointer hover:text-white/50 transition-colors">Don't show again</span>
              <button className="text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Active Challenges Table (full width) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Active Challenges</h2>
          <button className="flex items-center gap-1.5 text-xs font-medium text-white/60 border border-[#333] rounded-full px-3 py-1.5 hover:bg-white/5 transition-colors cursor-pointer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            as List
            <ChevronRight className="w-3 h-3 rotate-90" />
          </button>
        </div>

        <div className="border border-[#333] rounded-2xl bg-[#111318] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#333] text-[11px] uppercase tracking-wider text-white/30 font-medium">
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Challenge</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Stack</th>
                <th className="px-5 py-3">Participants</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { rank: '#1', name: 'Smart City Noise Map (Real-time)', author: 'Samuel', avatar: 'sam', date: '02/14/2024', stack: 'Go', participants: '99+', status: 'Public', statusColor: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' },
                { rank: '#2', name: 'Design System from Scratch', author: 'You', avatar: 'hoss', date: '09/23/2023', stack: 'React', participants: '64', status: 'Public', statusColor: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' },
                { rank: '#3', name: 'K8s Cluster Autoscaler', author: 'Maria', avatar: 'maria', date: '04/05/2024', stack: 'DevOps', participants: '91', status: '🔒 Private', statusColor: 'text-white/50 bg-white/5 border-[#333]' },
                { rank: '#4', name: 'GraphQL Federation Gateway', author: 'Steph', avatar: 'steph', date: '11/18/2023', stack: 'Node', participants: '42', status: 'Public', statusColor: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' },
              ].map(row => (
                <tr key={row.rank} className="border-b border-[#333] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-white/40">{row.rank}</td>
                  <td className="px-5 py-4 font-semibold text-white/90">{row.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <img src={`https://i.pravatar.cc/150?u=${row.avatar}`} alt="" className="w-6 h-6 rounded-full border border-[#333] object-cover" />
                      <span className="text-white/70">{row.author}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-white/40 text-xs">{row.date}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-black border border-[#333] text-white/70 rounded">{row.stack}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex -space-x-1.5">
                      <img src={`https://i.pravatar.cc/150?u=p${row.rank}1`} alt="" className="w-5 h-5 rounded-full border border-[#111318] object-cover" />
                      <img src={`https://i.pravatar.cc/150?u=p${row.rank}2`} alt="" className="w-5 h-5 rounded-full border border-[#111318] object-cover" />
                      <span className="w-5 h-5 rounded-full bg-[#1a1d24] border border-[#111318] flex items-center justify-center text-[7px] font-bold text-white/50">{row.participants}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${row.statusColor}`}>{row.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-xs font-semibold text-black bg-white px-3.5 py-1.5 rounded-lg hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer">Join</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentProfileView({ userId, firstName, lastName, email }: { userId: string; firstName: string; lastName: string; email: string }) {
  const [commits] = useState(() => {
    const grid = [];
    for (let col = 0; col < 52; col++) {
      const column = [];
      for (let row = 0; row < 7; row++) {
        const val = Math.random();
        let intensity = 0;
        if (val > 0.9) intensity = 4;
        else if (val > 0.7) intensity = 3;
        else if (val > 0.5) intensity = 2;
        else if (val > 0.3) intensity = 1;
        
        column.push(intensity);
      }
      grid.push(column);
    }
    return grid;
  });

  const getColor = (intensity: number) => {
    switch(intensity) {
      case 4: return 'bg-[#39d353] border-[#39d353]';
      case 3: return 'bg-[#26a641] border-[#26a641]';
      case 2: return 'bg-[#006d32] border-[#006d32]';
      case 1: return 'bg-[#0e4429] border-[#0e4429]';
      default: return 'bg-[#161b22] border-[#333]';
    }
  };

  // Profile editable states
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Full-stack engineer passionate about distributed systems and real-time data streaming. Building tools that empower developers to write better code faster. Currently exploring the intersection of WebSockets and geospatial mapping.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Temp states during editing
  const [tempBio, setTempBio] = useState(bio);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');

  // Load profile details from database
  useEffect(() => {
    if (!userId) return;
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .single();

      if (data?.profile_details) {
        const details = data.profile_details;
        if (details.bio) {
          setBio(details.bio);
          setTempBio(details.bio);
        }
        if (details.location) {
          setLocation(details.location);
          setTempLocation(details.location);
        }
        if (details.avatar_url) {
          setAvatarUrl(details.avatar_url);
          setTempAvatarUrl(details.avatar_url);
        }
      }
    };
    loadProfile();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setTempAvatarUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setEditError(null);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          profile_details: {
            bio: tempBio,
            location: tempLocation,
            avatar_url: tempAvatarUrl
          }
        })
        .eq('id', userId);

      if (error) {
        setEditError(error.message);
      } else {
        setBio(tempBio);
        setLocation(tempLocation);
        setAvatarUrl(tempAvatarUrl);
        setIsEditing(false);
      }
    } catch (e: any) {
      setEditError(e.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempBio(bio);
    setTempLocation(location);
    setTempAvatarUrl(avatarUrl);
    setEditError(null);
    setIsEditing(false);
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      {/* Profile Header Block */}
      {isEditing ? (
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16 border border-white/10 rounded-2xl bg-white/5 p-6 md:p-8 w-full text-left">
          <div className="flex flex-col gap-3 shrink-0 items-center">
            <div className="w-32 h-32 rounded-full border border-[#333] overflow-hidden bg-[#151820] relative">
              {tempAvatarUrl ? (
                <img src={tempAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-4xl text-white">
                  {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="w-32 text-center">
              <label className="text-[10px] text-white/40 block mb-1">Avatar Image</label>
              <div className="relative mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="avatar-upload"
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="w-full text-xs bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-2 py-1.5 text-white transition-all cursor-pointer inline-block font-semibold text-center hover:border-white/30"
                >
                  Upload File
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 text-left w-full">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/60">Location</label>
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full md:max-w-xs bg-brand-gray border border-white/10 rounded-xl h-10 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#00d2ff] focus:outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/60">Bio Description</label>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Describe your tech expertise, hobbies, or achievements..."
                rows={4}
                className="w-full bg-brand-gray border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#00d2ff] focus:outline-none text-sm resize-y leading-relaxed"
              />
            </div>

            {editError && (
              <div className="text-red-400 text-xs mt-2">
                {editError}
              </div>
            )}
            
            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleCancel}
                className="h-10 px-5 border border-white/10 text-white/70 hover:text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="h-10 px-6 bg-[#00d2ff] text-black font-semibold rounded-xl hover:bg-[#00d2ff]/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16 relative group text-left w-full">
          <div className="w-32 h-32 rounded-full border border-[#333] overflow-hidden shrink-0 bg-[#151820]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-4xl text-white">
                {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start text-left pt-2 w-full">
            <div className="flex w-full justify-between items-start">
              <h1 className="text-4xl font-bold tracking-tight">{firstName && lastName ? `${firstName} ${lastName}` : email}</h1>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-xs font-semibold px-4 py-2 border border-white/10 hover:border-white/30 rounded-xl hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer text-white/80 hover:text-white"
              >
                <Edit3 className="w-3 h-3" /> Edit Profile
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 text-white/60 text-sm">
              <span className="font-mono flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {location}</span>
              <span className="font-mono flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {email}</span>
            </div>
            <p className="mt-4 text-white/80 max-w-2xl leading-relaxed whitespace-pre-wrap">
              {bio}
            </p>
          </div>
        </div>
      )}

      {/* GitHub Contribution Graph */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold mb-6">Contributions</h2>
        <div className="p-6 border border-[#333] rounded-2xl bg-[#0d1117] overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {commits.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1">
                {col.map((intensity, rowIdx) => (
                  <div key={`${colIdx}-${rowIdx}`} className={`w-3 h-3 rounded-[2px] border ${getColor(intensity)}`} />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <span className="font-mono">842 contributions in the last year</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span>Less</span>
              <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-[#333]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#0e4429] border border-[#0e4429]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#006d32] border border-[#006d32]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#26a641] border border-[#26a641]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#39d353] border border-[#39d353]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline / Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-6">Timeline</h2>
        <div className="relative border-l border-[#333] ml-3 space-y-10 pb-8">
          
          <div className="relative pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#00d2ff] border-2 border-[#0e1015]" />
            <div className="text-sm font-mono text-[#00d2ff] mb-1">June 2026</div>
            <h3 className="text-base font-medium">Presented project at techno meet</h3>
            <p className="text-sm text-white/60 mt-1">Showcased the Smart City Noise Map architecture to a local group of 150+ developers, detailing the WebSocket implementation for low-latency streaming.</p>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#333] border-2 border-[#0e1015]" />
            <div className="text-sm font-mono text-white/50 mb-1">March 2026</div>
            <h3 className="text-base font-medium text-white/80">Completed Advanced FastAPI Certification</h3>
            <p className="text-sm text-white/60 mt-1">Verified via Upzeal with a 98% technical accuracy score.</p>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#333] border-2 border-[#0e1015]" />
            <div className="text-sm font-mono text-white/50 mb-1">January 2026</div>
            <h3 className="text-base font-medium text-white/80">Joined the Upzeal Platform</h3>
            <p className="text-sm text-white/60 mt-1">Started tracking Git history and building the technical portfolio.</p>
          </div>

        </div>
      </div>

    </div>
  );
}

function StudentFeedView() {
  const feedPosts = [
    {
      company: 'DataStream Inc.',
      time: '2 hours ago',
      content: 'Just scaled our real-time streaming infrastructure to handle 10k concurrent WebSocket connections. Read the post-mortem here.',
      tags: ['WebSockets', 'Scaling', 'Infrastructure'],
      highlight: true,
    },
    {
      company: 'NeuralForge AI',
      time: '5 hours ago',
      content: 'We\'re open-sourcing our internal model evaluation framework. 12k lines of Python, battle-tested across 200+ LLM deployments. Star us on GitHub.',
      tags: ['Python', 'AI/ML', 'Open Source'],
      highlight: false,
    },
    {
      company: 'CloudVault',
      time: '8 hours ago',
      content: 'Migrated our entire Kubernetes fleet from EKS to bare-metal. Reduced cloud costs by 68% while improving p99 latency. Here\'s exactly how we did it.',
      tags: ['Kubernetes', 'DevOps', 'Cost Optimization'],
      highlight: false,
    },
    {
      company: 'Lattice Security',
      time: '1 day ago',
      content: 'Hiring: Senior Rust Engineer to work on our zero-knowledge proof infrastructure. Remote-first, competitive equity. We process 2M+ transactions/day.',
      tags: ['Rust', 'Cryptography', 'Hiring'],
      highlight: false,
    },
    {
      company: 'SyncStack',
      time: '2 days ago',
      content: 'Our GraphQL Federation gateway now handles 50k req/s with sub-10ms overhead. Published a deep dive into our custom DataLoader batching strategy.',
      tags: ['GraphQL', 'Node.js', 'Performance'],
      highlight: false,
    },
  ];

  return (
    <div className="relative min-h-full flex flex-col lg:flex-row bg-[#0e1015]">
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* Main Feed (60%) */}
      <div className="w-full lg:w-[60%] border-r border-[#333] p-6 md:p-10 relative z-10 overflow-y-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Company Feed</h1>
        
        {feedPosts.map((post, idx) => (
          <div key={idx} className="bg-[#151820] border border-[#333] rounded-xl p-5 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0 border border-[#333] text-white/60">
                <span className="text-sm font-bold">{post.company.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{post.company}</h3>
                <p className="text-xs text-white/50 font-mono">{post.time}</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-2 mb-5">
              {post.tags.map(tag => (
                <span key={tag} className={`px-1.5 py-0.5 text-[10px] font-mono bg-black border border-[#333] rounded-sm ${post.highlight && tag === post.tags[0] ? 'text-[#00d2ff]' : 'text-white/60'}`}>{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 border-t border-[#333] pt-4">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-none active:scale-95 cursor-pointer">
                <Star className="w-3.5 h-3.5" /><span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-none active:scale-95 cursor-pointer">
                <Archive className="w-3.5 h-3.5" /><span>Save</span>
              </button>
              <div className="flex-1" />
              <button className="flex items-center gap-1.5 text-xs font-semibold text-black bg-white hover:bg-white/80 px-4 py-1.5 rounded transition-none active:scale-95 cursor-pointer">
                <span>Apply Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Tags Sidebar (40%) */}
      <div className="w-full lg:w-[40%] p-6 md:p-10 relative z-10 bg-[#0a0a0a]">
        <h2 className="text-sm font-semibold mb-6 text-white/80 uppercase tracking-widest">Trending Tags</h2>
        <div className="flex flex-wrap gap-2">
          {['FastAPI', 'React', 'WebSockets', 'GraphQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'Go', 'Rust', 'Python', 'AI/ML', 'TypeScript'].map(tag => (
            <button key={tag} className="px-2.5 py-1 text-xs font-mono border border-[#333] bg-[#151820] text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-none cursor-pointer">
              #{tag}
            </button>
          ))}
        </div>

        {/* Top Companies */}
        <h2 className="text-sm font-semibold mt-10 mb-5 text-white/80 uppercase tracking-widest">Top Companies</h2>
        <div className="space-y-3">
          {['DataStream Inc.', 'NeuralForge AI', 'CloudVault', 'Lattice Security', 'SyncStack'].map(name => (
            <div key={name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded bg-white/5 border border-[#333] flex items-center justify-center text-xs font-bold text-white/60 shrink-0">{name.charAt(0)}</div>
              <span className="text-sm text-white/70 font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentChatView({ userId, firstName, lastName, email }: { userId: string; firstName: string; lastName: string; email: string }) {
  const [conversations, setConversations] = useState([
    { id: '1', name: 'Upzeal AI Assistant', lastMessage: 'Ask me anything about your projects!', unread: 1, avatar: '⚡' },
    { id: '2', name: 'HR - Microsoft', lastMessage: 'We reviewed your React assessment. Let\'s schedule a call.', unread: 0, avatar: '💼' },
    { id: '3', name: 'Mentor - Sarah Jenkins', lastMessage: 'Make sure to submit the Git repository URL.', unread: 0, avatar: '👩‍🏫' },
  ]);

  const [activeConvId, setActiveConvId] = useState('1');
  
  const [messages, setMessages] = useState<Record<string, Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>>>({
    '1': [
      { id: '1-1', sender: 'them', text: 'Hi! I am your Upzeal AI workspace assistant. I can help you guide your project learning, review stack structures, or outline skills to score!', time: '10:02 AM' },
      { id: '1-2', sender: 'me', text: 'Hey, I want to review my FastAPI integration for the main dashboard.', time: '10:05 AM' },
      { id: '1-3', sender: 'them', text: 'FastAPI connects seamlessly using standard HTTP handlers or WebSockets. Your public schemas are fully synced in Supabase. What would you like to build next?', time: '10:06 AM' }
    ],
    '2': [
      { id: '2-1', sender: 'them', text: 'Hello Hruda! We saw your profile on the Upzeal developer platform. Your skill score in React is impressive.', time: 'Yesterday' },
      { id: '2-2', sender: 'me', text: 'Thank you! I\'ve spent a lot of time working with Next.js and Tailwind lately.', time: 'Yesterday' },
      { id: '2-3', sender: 'them', text: 'Excellent. We reviewed your React assessment. Let\'s schedule a call for this Friday.', time: '1:14 PM' }
    ],
    '3': [
      { id: '3-1', sender: 'them', text: 'Hi team, welcome to the weekly sprint checkup. Please submit your updates here.', time: '2 days ago' },
      { id: '3-2', sender: 'me', text: 'I completed the onboarding flow database integrations.', time: '2 days ago' },
      { id: '3-3', sender: 'them', text: 'Make sure to submit the Git repository URL.', time: 'Yesterday' }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'error' | 'success'>('idle');
  const [searchMessage, setSearchMessage] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConvId] || [];

  // Load existing messages and distinct chat users on mount/user shift
  useEffect(() => {
    if (!userId) return;

    const fetchAllMessages = async () => {
      // 1. Fetch all messages involving the current user
      const { data: dbMessages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error.message);
        return;
      }

      // Group messages by conversation ID
      const grouped: Record<string, Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>> = {
        '1': [
          { id: '1-1', sender: 'them', text: 'Hi! I am your Upzeal AI workspace assistant. I can help you guide your project learning, review stack structures, or outline skills to score!', time: '10:02 AM' },
          { id: '1-2', sender: 'me', text: 'Hey, I want to review my FastAPI integration for the main dashboard.', time: '10:05 AM' },
          { id: '1-3', sender: 'them', text: 'FastAPI connects seamlessly using standard HTTP handlers or WebSockets. Your public schemas are fully synced in Supabase. What would you like to build next?', time: '10:06 AM' }
        ]
      };

      // Find distinct user IDs we have chatted with
      const otherUserIds = new Set<string>();
      
      dbMessages.forEach((msg: any) => {
        const isMe = msg.sender_id === userId;
        const otherId = isMe ? msg.receiver_id : msg.sender_id;
        otherUserIds.add(otherId);

        if (!grouped[otherId]) {
          grouped[otherId] = [];
        }

        grouped[otherId].push({
          id: msg.id,
          sender: isMe ? 'me' : 'them',
          text: msg.text,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });

      setMessages(prev => ({
        ...prev,
        ...grouped
      }));

      if (otherUserIds.size > 0) {
        // Fetch profiles of those other users to show their names in the sidebar
        const { data: userProfiles, error: profileErr } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, username')
          .in('id', Array.from(otherUserIds));

        if (profileErr) {
          console.error("Error fetching profiles:", profileErr.message);
          return;
        }

        const newConversations = userProfiles.map((p: any) => {
          // Get the last message text for this user
          const chatMsgs = grouped[p.id] || [];
          const lastMsgText = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1].text : 'Start chatting';
          
          return {
            id: p.id,
            name: p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : p.username || p.email,
            lastMessage: lastMsgText,
            unread: 0,
            avatar: '👤'
          };
        });

        // Merge static default ones and unique dynamically loaded channels
        setConversations(prev => {
          const staticConvs = prev.filter(c => ['1', '2', '3'].includes(c.id));
          const merged = [...staticConvs];
          newConversations.forEach(nc => {
            if (!merged.find(mc => mc.id === nc.id)) {
              merged.push(nc);
            }
          });
          return merged;
        });
      }
    };

    fetchAllMessages();

    // 2. Real-time listener for incoming messages
    const channel = supabase
      .channel('chat-messages-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMsg = payload.new;
          
          // Verify if the message concerns this user
          if (newMsg.sender_id === userId || newMsg.receiver_id === userId) {
            const isMe = newMsg.sender_id === userId;
            const otherId = isMe ? newMsg.receiver_id : newMsg.sender_id;

            // Formulate message block
            const msgObj = {
              id: newMsg.id,
              sender: isMe ? 'me' as const : 'them' as const,
              text: newMsg.text,
              time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Check if conversation exists, if not fetch profile first to add to sidebar
            setConversations(prev => {
              const existing = prev.find(c => c.id === otherId);
              if (!existing) {
                // Trigger async profile load to insert to sidebar
                supabase.from('users').select('id, email, first_name, last_name, username').eq('id', otherId).maybeSingle().then(({ data }) => {
                  if (data) {
                    const newConv = {
                      id: data.id,
                      name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.username || data.email,
                      lastMessage: newMsg.text,
                      unread: isMe ? 0 : 1,
                      avatar: '👤'
                    };
                    setConversations(current => {
                      if (!current.find(c => c.id === otherId)) {
                        return [newConv, ...current];
                      }
                      return current;
                    });
                  }
                });
              } else {
                // Update lastMessage text
                return prev.map(c => c.id === otherId ? { ...c, lastMessage: newMsg.text, unread: isMe ? 0 : c.unread + 1 } : c);
              }
              return prev;
            });

            // Append to messages map
            setMessages(prev => ({
              ...prev,
              [otherId]: [...(prev[otherId] || []), msgObj]
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchUsername.trim().toLowerCase();
    if (!query) return;

    setSearchStatus('searching');
    setSearchMessage('');

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, username')
        .eq('username', query)
        .maybeSingle();

      if (error) {
        setSearchStatus('error');
        setSearchMessage('Failed to search: ' + error.message);
        return;
      }

      if (!data) {
        setSearchStatus('error');
        setSearchMessage('User not found');
        return;
      }

      if (data.id === userId) {
        setSearchStatus('error');
        setSearchMessage('Cannot chat with yourself');
        return;
      }

      const existing = conversations.find(c => c.id === data.id);
      if (existing) {
        setActiveConvId(data.id);
        setSearchStatus('success');
        setSearchUsername('');
        return;
      }

      const newConv = {
        id: data.id,
        name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.username || data.email,
        lastMessage: 'Conversation started',
        unread: 0,
        avatar: '👤'
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(data.id);
      
      setMessages(prev => ({
        ...prev,
        [data.id]: [
          { id: `${data.id}-init`, sender: 'them', text: `Hi! I found your profile under username: @${data.username || 'user'}. Let's chat!`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }));

      setSearchStatus('success');
      setSearchUsername('');
    } catch (err: any) {
      setSearchStatus('error');
      setSearchMessage(err.message || 'An error occurred');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const queryText = inputText.trim();
    setInputText('');

    if (activeConvId === '1') {
      const newMsg = {
        id: `1-${Date.now()}`,
        sender: 'me' as const,
        text: queryText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        '1': [...(prev['1'] || []), newMsg]
      }));

      setTimeout(() => {
        const replyMsg = {
          id: `1-reply-${Date.now()}`,
          sender: 'them' as const,
          text: `Got your message! I'm scanning your Upzeal environment database configurations. Your current user id is ${userId || 'guest'}. How else can I assist your coding today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
          ...prev,
          '1': [...(prev['1'] || []), replyMsg]
        }));
      }, 1000);
      
      return;
    }

    if (activeConvId === '2' || activeConvId === '3') {
      const newMsg = {
        id: `${activeConvId}-${Date.now()}`,
        sender: 'me' as const,
        text: queryText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), newMsg]
      }));
      return;
    }

    // Dynamic Peer-to-Peer messaging persistence
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: activeConvId,
          text: queryText
        });

      if (error) {
        console.error("Error inserting message:", error.message);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err.message || err);
    }
  };

  return (
    <div className="flex h-full bg-[#0e1015] w-full overflow-hidden">
      {/* Channels List */}
      <div className="w-80 border-r border-[#333] bg-[#0a0a0a]/50 flex flex-col shrink-0">
        <div className="p-6 border-b border-[#333] flex flex-col gap-3 bg-[#0d0e12]">
          <h2 className="text-lg font-bold text-left">Messages</h2>
          <form onSubmit={handleSearchUser} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="w-full bg-[#1b1e28] border border-[#333] rounded-xl py-2 px-3 text-xs text-white placeholder:text-white/20 focus:ring-1 focus:ring-[#00d2ff] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
          {searchStatus === 'searching' && (
            <p className="text-[10px] text-white/40 font-mono">Searching...</p>
          )}
          {searchStatus === 'error' && (
            <p className="text-[10px] text-red-400 font-mono">{searchMessage}</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((c) => {
            const isActive = c.id === activeConvId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  setConversations(prev => prev.map(conv => conv.id === c.id ? { ...conv, unread: 0 } : conv));
                }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left cursor-pointer border ${
                  isActive 
                    ? 'bg-white/10 border-[#333] shadow-md' 
                    : 'border-transparent hover:bg-white/5 hover:border-white/5 text-white/70 hover:text-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1b1e28] flex items-center justify-center text-lg border border-[#333] shrink-0">
                  {c.avatar}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-sm truncate">{c.name}</span>
                    {c.unread > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    )}
                  </div>
                  <p className="text-xs text-white/40 truncate leading-normal">{c.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Messaging pane */}
      <div className="flex-1 flex flex-col bg-[#0e1015] justify-between relative h-full min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="h-[73px] border-b border-[#333] bg-[#0d0e12] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1b1e28] flex items-center justify-center text-md border border-[#333]">
              {activeConv.avatar}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">{activeConv.name}</p>
              <p className="text-[10px] text-[#00d2ff] font-mono">online</p>
            </div>
          </div>
        </div>

        {/* Message bubbles list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col justify-end min-h-0 pb-24">
          <div className="space-y-4 overflow-y-auto max-h-full pr-1">
            {activeMessages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div 
                  key={m.id} 
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                    isMe 
                      ? 'bg-white text-black border-white text-left font-medium' 
                      : 'bg-[#1b1e28] text-white border-[#333] text-left'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[9px] mt-1.5 block text-right font-mono ${
                      isMe ? 'text-black/50' : 'text-white/40'
                    }`}>{m.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Input box */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/95 to-transparent shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-3 p-2 bg-[#0a0a0a] border border-[#333] rounded-2xl relative shadow-lg">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv.name}...`}
              className="flex-1 bg-transparent border-none py-2 px-3 text-white placeholder:text-white/20 focus:ring-0 focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-white text-black hover:bg-white/90 flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-95 border-none"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RecruiterDashboard({ firstName, lastName, email, onLogout }: { firstName: string; lastName: string; email: string; onLogout: () => void }) {
  const [recruiterView, setRecruiterView] = useState<'pipeline' | 'talent'>('pipeline');

  const candidates = [
    { id: 1, name: 'John Doe', role: 'Full Stack Engineer', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', skills: ['FastAPI', 'React'], status: 'new', xp: 12400, match: 94 },
    { id: 2, name: 'Alice Chen', role: 'Backend Developer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', skills: ['Go', 'Kubernetes'], status: 'new', xp: 9800, match: 91 },
    { id: 3, name: 'Marcus Johnson', role: 'Data Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', skills: ['Python', 'PostgreSQL'], status: 'new', xp: 15200, match: 88 },
    { id: 4, name: 'Elena Rodriguez', role: 'Frontend Architect', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', skills: ['Vue', 'TypeScript'], status: 'screening', xp: 11050, match: 86 },
    { id: 5, name: 'David Kim', role: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', skills: ['Docker', 'AWS'], status: 'screening', xp: 8700, match: 82 },
    { id: 6, name: 'Sarah Miller', role: 'Machine Learning', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', skills: ['PyTorch', 'CUDA'], status: 'interviewing', xp: 18900, match: 97 },
  ];

  const columns = [
    { id: 'new', title: 'New Applicants' },
    { id: 'screening', title: 'Screening' },
    { id: 'interviewing', title: 'Interviewing' }
  ];

  return (
    <div className="flex h-screen bg-[#0e1015] text-white overflow-hidden">
      {/* Recruiter Sidebar */}
      <aside className="w-16 md:w-64 border-r border-[#333] bg-[#0a0a0a] flex flex-col justify-between shrink-0 transition-all">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-10">
            <Briefcase className="w-6 h-6 text-white" />
            <span className="font-bold text-lg tracking-tight hidden md:block">Upzeal Recruiter</span>
          </div>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setRecruiterView('pipeline')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'pipeline' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block">Pipeline</span>
            </button>
            <button
              onClick={() => setRecruiterView('talent')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'talent' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block">Talent Pool</span>
            </button>
          </nav>
        </div>
        <div className="p-4 md:p-6 border-t border-[#333] flex flex-col gap-4">
           <div className="flex items-center justify-center md:justify-start gap-3">
             <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold shrink-0">
                {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'R'}
             </div>
             <div className="overflow-hidden hidden md:block flex-1 text-left">
               <p className="text-sm font-semibold truncate">{firstName && lastName ? `${firstName} ${lastName}` : email}</p>
               <p className="text-xs text-white/50 font-mono truncate">{email}</p>
             </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full text-xs font-semibold text-white/60 hover:text-white border border-[#333] rounded-lg py-2 hover:bg-white/5 transition-colors cursor-pointer hidden md:block"
           >
             Log Out
           </button>
           <button 
             onClick={onLogout}
             title="Log Out"
             className="w-full text-xs font-semibold text-white/60 hover:text-white border border-[#333] rounded-lg py-2 hover:bg-white/5 transition-colors cursor-pointer block md:hidden"
           >
             ←
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-auto overflow-y-auto bg-[#0e1015] p-6 md:p-10 flex flex-col">
        {recruiterView === 'pipeline' ? (
          <>
            <header className="mb-8 shrink-0">
              <h1 className="text-2xl font-bold tracking-tight text-white">Engineering Pipeline</h1>
              <p className="text-sm text-white/50 mt-1 font-mono">Q3 Hiring Cycle</p>
            </header>
            <div className="flex gap-6 flex-1 overflow-x-auto pb-4 items-start">
              {columns.map(col => {
                const colCandidates = candidates.filter(c => c.status === col.id);
                return (
                  <div key={col.id} className="w-[320px] shrink-0 flex flex-col bg-[#0a0a0a] border border-[#333] rounded-lg max-h-full">
                    <div className="p-3 border-b border-[#333] bg-[#111] flex items-center justify-between shrink-0 rounded-t-lg">
                      <h2 className="text-sm font-semibold tracking-tight text-white/90">{col.title}</h2>
                      <span className="text-xs font-mono text-white/50 px-1.5 py-0.5 bg-[#222] rounded border border-[#333]">{colCandidates.length}</span>
                    </div>
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                      {colCandidates.map(candidate => (
                        <div key={candidate.id} className="bg-[#151820] border border-[#333] rounded p-3 hover:border-white/20 transition-colors cursor-pointer group text-left">
                          <div className="flex items-start gap-3">
                            <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded border border-[#333] object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" />
                            <div className="overflow-hidden">
                              <h3 className="text-sm font-semibold text-white truncate">{candidate.name}</h3>
                              <p className="text-xs text-white/50 truncate mb-2">{candidate.role}</p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {candidate.skills.map(skill => (
                                  <span key={skill} className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-black border border-[#333] text-white/70 rounded-sm">{skill}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* ── Talent Pool View ── */
          <>
            <header className="mb-8 shrink-0">
              <h1 className="text-2xl font-bold tracking-tight text-white">Talent Pool</h1>
              <p className="text-sm text-white/50 mt-1 font-mono">All verified candidates across your hiring pipeline</p>
            </header>

            {/* Filters Bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-2 bg-[#111318] border border-[#333] rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-white/30" />
                <input type="text" placeholder="Search candidates..." className="bg-transparent text-sm text-white placeholder:text-white/30 border-none focus:outline-none w-48" />
              </div>
              {['All Roles', 'Engineering', 'DevOps', 'ML/AI'].map(f => (
                <button key={f} className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                  f === 'All Roles' ? 'bg-white/10 border-[#333] text-white' : 'border-[#333] text-white/50 hover:text-white hover:bg-white/5'
                }`}>{f}</button>
              ))}
            </div>

            {/* Talent Table */}
            <div className="border border-[#333] rounded-xl bg-[#111318] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[11px] uppercase tracking-wider text-white/30 font-medium">
                    <th className="px-5 py-3">Candidate</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Skills</th>
                    <th className="px-5 py-3">XP Score</th>
                    <th className="px-5 py-3">Match</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {candidates.map(c => (
                    <tr key={c.id} className="border-b border-[#333] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full border border-[#333] object-cover" />
                          <div>
                            <span className="font-semibold text-white">{c.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white/60">{c.role}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          {c.skills.map(s => (
                            <span key={s} className="px-1.5 py-0.5 text-[10px] font-mono bg-black border border-[#333] text-white/70 rounded-sm">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-semibold text-[#00d2ff]">{c.xp?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#1a1d24] rounded-full overflow-hidden">
                            <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${c.match}%` }} />
                          </div>
                          <span className="text-xs font-mono text-white/50">{c.match}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                          c.status === 'new' ? 'text-[#00d2ff] bg-[#00d2ff]/10 border-[#00d2ff]/20'
                          : c.status === 'screening' ? 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20'
                          : 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20'
                        }`}>{c.status === 'new' ? 'New' : c.status === 'screening' ? 'Screening' : 'Interview'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-xs font-semibold text-black bg-white px-3.5 py-1.5 rounded-lg hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
