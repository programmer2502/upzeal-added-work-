import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from './assets/logo.png';
import { supabase } from './supabaseClient';
import { apiService } from './services/api';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  Star,
  Send,
  Archive,
  MoreHorizontal,
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
  MessageSquare,
  ThumbsDown
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

const BackgroundVideo = React.memo(({ isFixed = false }: { isFixed?: boolean }) => (
  <div className={`${isFixed ? 'fixed' : 'absolute'} inset-0 w-full h-full z-0 pointer-events-none`}>
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover pointer-events-none"
    >
      <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" type="video/mp4" />
    </video>
  </div>
));

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
  const [, setSession] = useState<any>(null);
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

  interface AppToast {
    id: string;
    title: string;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
    type: 'success' | 'info';
  }
  const [toasts, setToasts] = useState<AppToast[]>([]);

  // FastAPI WebSocket connection for real-time push events from the backend
  useEffect(() => {
    if (!user) return;

    const wsUrl = `${apiService.getWsBaseUrl()}/ws/${user.id}`;
    let ws: WebSocket | null = null;
    let reconnectTimeout: number;

    const connectWebSocket = () => {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'APPLICATION_ACCEPTED' && data.payload) {
            const { app_id, project_title } = data.payload;
            const toastId = `ws-hired-${app_id}`;
            setToasts(prev => {
              if (prev.find(t => t.id === toastId)) return prev;
              return [
                ...prev,
                {
                  id: toastId,
                  title: 'Requirement Accepted! 🎉',
                  message: `Congratulations! Your partnership/application for "${project_title}" has been accepted!`,
                  type: 'success'
                }
              ];
            });
          } else if (data.type === 'NEW_APPLICATION' && data.payload) {
            const { app_id, project_title, applicant_name } = data.payload;
            const toastId = `toast-${app_id}`;
            setToasts(prev => {
              if (prev.find(t => t.id === toastId)) return prev;
              return [
                ...prev,
                {
                  id: toastId,
                  title: 'New Requirement Application',
                  message: `${applicant_name} applied to your requirement: "${project_title}"`,
                  type: 'info',
                  action: {
                    label: 'Accept Application',
                    onClick: async () => {
                      try {
                        await apiService.acceptApplication(app_id);
                        setToasts(current => current.filter(t => t.id !== toastId));
                      } catch (error: any) {
                        alert(error.message || "Failed to accept application");
                      }
                    }
                  }
                }
              ];
            });
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      ws.onclose = () => {
        // Simple reconnect logic
        reconnectTimeout = window.setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        ws.onclose = null; // Prevent reconnect on unmount
        ws.close();
      }
    };
  }, [user]);

  // Listen to Supabase Auth state shifts
  useEffect(() => {
    const handleUserMetadataSync = async (session: any) => {
      if (!session?.user) return;
      const userIdVal = session.user.id;
      
      const { data, error: _error } = await supabase
        .from('users')
        .select('first_name, last_name, role, username, onboarding_phase, dashboard_config')
        .eq('id', userIdVal)
        .single();
        
      let finalFirstName = '';
      let finalLastName = '';
      let finalRole = '';
      let finalUsername = '';
      
      if (data) {
        finalFirstName = data.first_name || '';
        finalLastName = data.last_name || '';
        finalRole = data.role || '';
        finalUsername = data.username || '';
        setFirstName(finalFirstName);
        setLastName(finalLastName);
        setAccountType(data.role as any);
        if (data.dashboard_config?.tech_stack) {
          setSelectedTech(data.dashboard_config.tech_stack);
        }
      }

      // Automatically generate a username if one does not exist
      if (!finalUsername) {
        const emailLocalPart = session.user.email ? session.user.email.split('@')[0] : '';
        const fullNameCombined = (session.user.user_metadata?.full_name || session.user.user_metadata?.name || '').replace(/\s+/g, '_').toLowerCase();
        
        let candidateUsername = (
          session.user.user_metadata?.user_name ||
          session.user.user_metadata?.username ||
          session.user.user_metadata?.preferred_username ||
          emailLocalPart ||
          fullNameCombined ||
          `user_${userIdVal.substring(0, 5)}`
        ).trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

        if (!candidateUsername) {
          candidateUsername = `user_${userIdVal.substring(0, 5)}`;
        }

        let uniqueUsername = candidateUsername;
        let isTaken = true;
        let attempt = 0;
        
        while (isTaken && attempt < 10) {
          const suffix = attempt === 0 ? '' : `_${Math.floor(100 + Math.random() * 900)}`;
          const testUsername = `${uniqueUsername}${suffix}`.substring(0, 30);
          
          const { data: duplicate } = await supabase
            .from('users')
            .select('id')
            .eq('username', testUsername)
            .maybeSingle();
            
          if (!duplicate) {
            uniqueUsername = testUsername;
            isTaken = false;
          } else {
            attempt++;
          }
        }
        
        if (isTaken) {
          uniqueUsername = `${candidateUsername}_${userIdVal.substring(0, 5)}`.substring(0, 30);
        }

        await supabase
          .from('users')
          .update({ username: uniqueUsername })
          .eq('id', userIdVal);
          
        finalUsername = uniqueUsername;
      }

      // If user profile metadata is empty (e.g. new Google/GitHub signup), synchronize name and role
      if (session.user.user_metadata && (!finalFirstName || !finalRole)) {
        const storedRole = localStorage.getItem('oauth_intended_role') || 'developer';
        localStorage.removeItem('oauth_intended_role');
        
        const fullName = session.user.user_metadata.full_name || session.user.user_metadata.name || '';
        const parts = fullName.split(' ');
        const fName = finalFirstName || parts[0] || '';
        const lName = finalLastName || parts.slice(1).join(' ') || '';
        const roleVal = finalRole || storedRole;

        await supabase
          .from('users')
          .update({ 
            first_name: fName,
            last_name: lName,
            role: roleVal,
            username: finalUsername
          })
          .eq('id', userIdVal);
          
        setFirstName(fName);
        setLastName(lName);
        setAccountType(roleVal as any);
      }
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        setEmail(session.user.email || '');
        await handleUserMetadataSync(session);
        setView('dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        setUser(session.user);
        setEmail(session.user.email || '');
        await handleUserMetadataSync(session);
      } else {
        setUser(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setSelectedTech([]);
        setAccountType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsSocialLoading(true);
    setAuthError(null);
    setLoginError(null);
    
    // Store intended role in localStorage if signup flow is active
    if (accountType) {
      localStorage.setItem('oauth_intended_role', accountType);
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        setAuthError(error.message);
        setLoginError(error.message);
      }
    } catch (err: any) {
      setAuthError(err.message);
      setLoginError(err.message);
    } finally {
      setIsSocialLoading(false);
    }
  };

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
    
    const { data: _companyData, error: companyError } = await supabase
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
          <BackgroundVideo isFixed />

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
              <div className="flex h-[560px] text-white">

                {/* Sidebar Mockup */}
                <div className="w-48 border-r border-white/5 bg-black/30 p-4 flex flex-col justify-between hidden md:flex select-none text-left">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1 text-[#00d2ff]">
                      <code className="text-sm font-bold">&lt;/&gt;</code>
                      <span className="font-semibold text-xs tracking-tight text-white">Upzeal</span>
                    </div>
                    <nav className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 text-white text-xs font-semibold">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 text-xs font-medium hover:bg-white/5 hover:text-white transition-all">
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 text-xs font-medium hover:bg-white/5 hover:text-white transition-all">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Company Feed</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60 text-xs font-medium hover:bg-white/5 hover:text-white transition-all">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </div>
                    </nav>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-[9px] text-white">
                        RN
                      </div>
                      <div className="text-[10px] text-left leading-tight truncate">
                        <p className="font-semibold text-white truncate">R.R.NAVEEN RAJ</p>
                        <p className="text-white/40 truncate text-[8px]">kidsinfo.naveen@gmail.com</p>
                      </div>
                    </div>
                    <button onClick={() => setView('signup')} className="w-full text-center text-[10px] text-white/50 bg-white/5 py-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer border-none mt-2 font-mono">
                      Join Platform
                    </button>
                  </div>
                </div>

                {/* Main content dashboard area mockup */}
                <div className="flex-1 bg-[#0c0d10] p-5 overflow-y-auto space-y-6 text-left select-none scrollbar-thin">
                  {/* Row 1: Skill Progress + Total XP Balance + AI Evaluation */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* 1. Skill Progress Card (6 cols) */}
                    <div className="lg:col-span-6 border border-white/5 rounded-2xl bg-[#111318] p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xs font-bold text-white">Skill Progress</h3>
                          <span className="text-[9px] text-white/40 font-mono px-2 py-0.5 bg-white/5 border border-white/5 rounded">All Skills</span>
                        </div>
                        <p className="text-[10px] text-white/40 mb-4">3 mentors and @team have access.</p>
                        
                        {/* Overview Box */}
                        <div className="border border-white/5 rounded-xl bg-black/20 p-3 mb-4">
                          <div className="flex items-center justify-between text-[8px] uppercase tracking-wider text-white/30 font-mono mb-2">
                            <span>Overview</span>
                            <span>Growth Rate</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-tight">Commit Throughput</p>
                              <p className="text-xs font-bold text-white font-mono">0 joined challenges</p>
                            </div>
                            <span className="text-xs font-bold text-[#10b981] font-mono">+ 24.0 %</span>
                          </div>
                        </div>

                        {/* Chart Line preview (SVG) */}
                        <div className="h-24 w-full relative overflow-hidden">
                          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 25 Q 25 22 50 18 T 100 5 L 100 30 L 0 30 Z" fill="url(#chartGlow)" />
                            <path d="M 0 25 Q 25 22 50 18 T 100 5" fill="none" stroke="#00d2ff" strokeWidth="1.5" />
                          </svg>
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1a1d24] border border-[#333] px-2 py-0.5 rounded text-[8px] font-mono leading-none">
                            <span className="text-white/40">Aug 7:</span> <span className="font-bold text-[#00d2ff]">3800 XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3 text-[9px] font-mono">
                        <span className="text-[#10b981]">+ 24.0 %</span>
                        <span className="text-white/30">Last updated Today, 07:23 PM</span>
                      </div>
                    </div>

                    {/* 2. Total XP Balance Card (3 cols) */}
                    <div className="lg:col-span-3 border border-white/5 rounded-2xl bg-[#111318] p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-white mb-0.5">Total XP Balance</h3>
                        <p className="text-[9px] text-white/40 mb-4">The sum of all points on my profile</p>
                        
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-base font-bold text-white">★ 10,000</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono mb-4 text-[#10b981]">
                          <span>Compared to last month</span>
                          <span>+ 14.0 %</span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[9px] text-white/40 font-mono">
                          <span>Yearly avg: ★ 15000</span>
                          <span className="underline hover:text-white cursor-pointer">How it works?</span>
                        </div>
                      </div>

                      {/* AI Mentor widget inside XP Balance */}
                      <div className="border border-[#00d2ff]/10 rounded-xl bg-[#00d2ff]/5 p-3 mt-4 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#00d2ff] fill-[#00d2ff]/10" />
                            <span className="text-[10px] font-bold text-white">AI Mentor</span>
                          </div>
                          <span className="text-[8px] font-bold text-[#10b981] uppercase font-mono">Ready</span>
                        </div>
                        <p className="text-[8px] text-white/50 mb-2 leading-tight">Hi R.R.NAVEEN. Ask me a technical question...</p>
                        <div className="flex gap-1">
                          <span className="px-1.5 py-0.5 text-[7px] bg-black border border-white/5 text-white/60 rounded">React hooks</span>
                          <span className="px-1.5 py-0.5 text-[7px] bg-black border border-white/5 text-white/60 rounded">DSA prep</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. AI Evaluation Card (3 cols) */}
                    <div className="lg:col-span-3 border border-white/5 rounded-2xl bg-[#111318] p-4 flex flex-col justify-between border-dashed border-white/20">
                      <div>
                        <h3 className="text-xs font-bold text-white mb-0.5">AI Evaluation</h3>
                        <p className="text-[9px] text-white/40 mb-4">Powered by AI Engine</p>
                        
                        <span className="inline-block text-[8px] font-bold text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20 px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider font-mono">Not Evaluated Yet</span>
                        
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]/10" />
                          <span>Run AI Diagnostics</span>
                        </div>
                        <p className="text-[9px] text-white/40 leading-relaxed mb-4">
                          Verify your skill scores, receive actionable career guidelines, and compute your ranking on Upzeal.
                        </p>
                      </div>
                      
                      <button onClick={() => setView('signup')} className="w-full py-2 bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black font-semibold text-xs rounded-xl shadow-lg shadow-[#00d2ff]/10 active:scale-[0.98] transition-all cursor-pointer border-none uppercase tracking-wider font-mono">
                        Evaluate Now
                      </button>
                    </div>

                  </div>

                  {/* Row 2: My Top Skills header and 4 skill cards */}
                  <div>
                    <h3 className="text-xs font-bold text-white mb-4 text-left uppercase tracking-wider font-mono">My Top Skills</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'React Best Practices', color: 'bg-[#00d2ff]' },
                        { name: 'NodeJS Best Practices', color: 'bg-[#10b981]' },
                        { name: 'AWS Cloud Architecture', color: 'bg-[#fbbf24]' },
                        { name: 'Database Design & Postgres', color: 'bg-[#2563eb]' },
                      ].map((skill) => (
                        <div key={skill.name} className="border border-white/5 rounded-2xl bg-[#111318] p-3 flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${skill.color}`} />
                              <span className="text-[10px] font-semibold text-white/90 truncate">{skill.name}</span>
                            </div>
                            <span className="text-xs font-bold font-mono text-white"># 60 XP</span>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                            <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/2 border border-white/5 text-white/30">UNVERIFIED</span>
                            <button onClick={() => setView('signup')} className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border-none">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                          </div>
                        </div>
                      ))}
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
            <BackgroundVideo />

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
                    <SocialButton icon={<Chrome className="w-4 h-4 text-white" />} label="Google" isLoading={isSocialLoading} onClick={() => handleSocialLogin('google')} />
                    <SocialButton icon={<Github className="w-4 h-4 text-white" />} label="GitHub" isLoading={isSocialLoading} onClick={() => handleSocialLogin('github')} />
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
          userId={user?.id || ''}
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
          developerSkills={selectedTech}

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

            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon={<Chrome className="w-4 h-4 text-white" />} label="Google" isLoading={isSocialLoading} onClick={() => handleSocialLogin('google')} />
              <SocialButton icon={<Github className="w-4 h-4 text-white" />} label="GitHub" isLoading={isSocialLoading} onClick={() => handleSocialLogin('github')} />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-white/40 uppercase tracking-widest bg-[#0c0c0c] px-4 select-none">
                Or
              </span>
              <div className="flex-grow border-t border-white/10"></div>
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
      {/* Real-time Toast Notifications list */}
      <div className="fixed bottom-6 right-6 z-[250] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full bg-[#111318] border border-[#333] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-left relative"
            >
              <button 
                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                className="absolute right-4 top-4 text-white/30 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  t.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-[#00d2ff]/10 border-[#00d2ff]/20 text-[#00d2ff]'
                }`}>
                  {t.type === 'success' ? <Check className="w-4 h-4 stroke-[3.5]" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden flex-1 pr-4">
                  <h4 className="text-sm font-bold text-white">{t.title}</h4>
                  <p className="text-xs text-white/50 mt-1 leading-normal">{t.message}</p>
                </div>
              </div>

              {t.action && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={t.action.onClick}
                    className="px-4 py-2 bg-white text-black hover:bg-white/95 rounded-xl font-bold text-xs transition-colors cursor-pointer border-none"
                  >
                    {t.action.label}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
function StudentDashboard({ userId, firstName, lastName, email, developerSkills, onLogout }: { userId: string; firstName: string; lastName: string; email: string; developerSkills: string[]; onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'feed' | 'chat'>('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);
  const [, setToasts] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem(`upzeal_user_avatar_${userId}`) || '';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchAvatar = async () => {
      const { data } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      if (data?.profile_details?.avatar_url) {
        setAvatarUrl(data.profile_details.avatar_url);
        localStorage.setItem(`upzeal_user_avatar_${userId}`, data.profile_details.avatar_url);
      }
    };
    fetchAvatar();
  }, [userId]);

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    if (userId) {
      localStorage.setItem(`upzeal_user_avatar_${userId}`, newUrl);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden font-sans antialiased text-left relative">
      {/* Sidebar Backdrop Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative top-0 bottom-0 left-0 z-50 w-64 border-r border-[#333] bg-[#111318] flex flex-col justify-between shrink-0 transition-transform duration-300 md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold font-mono tracking-wider text-white flex items-center gap-1">
              <span className="text-[#00d2ff]">&lt;/&gt;</span> Upzeal
            </span>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer border-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => { setCurrentView('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'dashboard' ? 'bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button 
              onClick={() => { setCurrentView('profile'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'profile' ? 'bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <User className="w-4 h-4" />
              <span className="font-medium text-sm">Profile</span>
            </button>
            <button 
              onClick={() => { setCurrentView('feed'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'feed' ? 'bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <Activity className="w-4 h-4" />
              <span className="font-medium text-sm">Company Feed</span>
            </button>
            <button 
              onClick={() => { setCurrentView('chat'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${currentView === 'chat' ? 'bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Chat</span>
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-[#333] flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-[#333] shrink-0 bg-[#151820]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-white text-xs">
                    {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'U'}
                  </div>
                )}
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

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#111318] border-b border-[#333] shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer border-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold font-mono tracking-wider text-white flex items-center gap-1">
              <span className="text-[#00d2ff]">&lt;/&gt;</span> Upzeal
            </span>
          </div>
          <div 
            className="w-8 h-8 rounded-full overflow-hidden border border-[#333] bg-[#151820] cursor-pointer shrink-0" 
            onClick={() => setCurrentView('profile')}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-white text-xs">
                {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 bg-[#0e1015] ${currentView === 'chat' ? 'overflow-hidden h-full' : 'overflow-y-auto h-full'}`}>
          {currentView === 'dashboard' ? (
            <StudentBentoDashboard userId={userId} firstName={firstName} developerSkills={developerSkills} setToasts={setToasts} onSelectCompany={setSelectedCompanyId} />
          ) : currentView === 'profile' ? (
            <StudentProfileView userId={userId} firstName={firstName} lastName={lastName} email={email} onAvatarChange={handleAvatarChange} />
          ) : currentView === 'feed' ? (
            <StudentFeedView 
              userId={userId} 
              developerSkills={developerSkills} 
              onSelectCompany={setSelectedCompanyId} 
              onStartChat={(partnerId) => {
                setActiveChatPartnerId(partnerId);
                setCurrentView('chat');
              }}
            />
          ) : (
            <StudentChatView 
              userId={userId} 
              firstName={firstName} 
              lastName={lastName} 
              email={email} 
              onSelectCompany={setSelectedCompanyId} 
              initialPartnerId={activeChatPartnerId}
              onClearInitialPartner={() => setActiveChatPartnerId(null)}
            />
          )}
        </main>
      </div>

      {selectedCompanyId && (
        <CompanyProfileModal 
          companyId={selectedCompanyId} 
          onClose={() => setSelectedCompanyId(null)} 
          onStartChat={(partnerId) => {
            setActiveChatPartnerId(partnerId);
            setCurrentView('chat');
            setSelectedCompanyId(null);
          }}
        />
      )}
    </div>
  );
}

function MarkdownReportViewer({ reportText }: { reportText: string }) {
  if (!reportText) return null;
  const lines = reportText.split('\n');
  return (
    <div className="space-y-3 text-xs leading-relaxed text-white/70 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-sm font-bold text-white border-b border-[#333] pb-1.5 mt-4 mb-2">{trimmed.slice(4)}</h3>;
        }
        if (trimmed.startsWith('#### ')) {
          return <h4 key={idx} className="text-xs font-bold text-[#00d2ff] mt-3 mb-1">{trimmed.slice(5)}</h4>;
        }
        if (trimmed.startsWith('- ')) {
          const content = trimmed.slice(2);
          const parts = content.split('**');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="text-[#00d2ff] select-none">•</span>
              <span>
                {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part)}
              </span>
            </div>
          );
        }
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          return <p key={idx} className="font-semibold text-white mt-1.5">{trimmed.slice(2, -2)}</p>;
        }
        if (trimmed === '') return <div key={idx} className="h-1.5" />;
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="mt-1">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part)}
          </p>
        );
      })}
    </div>
  );
}

function StudentBentoDashboard({ userId, firstName, developerSkills, setToasts, onSelectCompany }: { userId: string; firstName: string; developerSkills: string[]; setToasts: React.Dispatch<React.SetStateAction<any[]>>; onSelectCompany: (id: string) => void }) {
  const [xp, setXp] = useState(0);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [challengeFilter, setChallengeFilter] = useState<'all' | 'matched'>('all');
  const [skillScores, setSkillScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mentorInput, setMentorInput] = useState('');
  const [mentorMessage, setMentorMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [evaluationReport, setEvaluationReport] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    setMentorMessage(`Hi ${firstName || 'Developer'}. Ask me a technical question and I will explain it clearly, give examples, and suggest what to practice next.`);
  }, [firstName]);

  const formatSkillTitle = (rawName: string) => {
    const mapping: Record<string, string> = {
      'react': 'React Best Practices',
      'react-best-practices': 'React Best Practices',
      'node': 'NodeJS Best Practices',
      'nodejs-best-practices': 'NodeJS Best Practices',
      'aws': 'AWS Cloud Architecture',
      'aws-skills': 'AWS Cloud Architecture',
      'database': 'Database Design & Postgres',
      'database-design': 'Database Design & Postgres',
      'python': 'Python Pro',
      'python-pro': 'Python Pro',
      'fastapi': 'FastAPI Pro',
      'fastapi-pro': 'FastAPI Pro',
      'docker': 'Docker Expert',
      'docker-expert': 'Docker Expert',
      'kubernetes': 'Kubernetes Architect',
      'kubernetes-architect': 'Kubernetes Architect',
      'systematic-debugging': 'Systematic Debugging',
      'ui-ux-pro-max': 'UI/UX Pro Max'
    };

    const key = rawName.toLowerCase().trim();
    if (mapping[key]) return mapping[key];

    return rawName.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleUpgrade = () => {
    setToasts(prev => [
      ...prev,
      {
        id: `upgrade-${Date.now()}`,
        title: 'Upzeal Pro Activated! ⚡',
        message: 'Your developer profile now has 40% bonus XP multiplier and priority recruiter visibility.',
        type: 'success'
      }
    ]);
    setXp(prev => Math.round(prev + 50));
  };

  const handleMentorSend = async (query?: string) => {
    const q = query || mentorInput;
    if (!q.trim()) return;
    setIsAiThinking(true);
    if (!query) setMentorInput('');

    // Attempt professional API service call to backend AI mentor
    const backendReply = await apiService.askMentor(q);
    if (backendReply) {
      setMentorMessage(backendReply);
      setIsAiThinking(false);
      return;
    }

    setTimeout(() => {
      let response = `Here is a tip on "${q}": Focus on mastering core fundamentals and building real-world projects. Practice clean code standards and write tests!`;
      const lower = q.toLowerCase();
      if (lower.includes('react')) {
        response = `For React: Master hooks like useEffect and useMemo, state composition patterns, and scalable React application architectures.`;
      } else if (lower.includes('dsa') || lower.includes('algorithm')) {
        response = `For DSA Prep: Practice Big-O complexity, hash tables, linked lists, sliding window array problems, and binary search trees.`;
      } else if (lower.includes('project')) {
        response = `Project Idea: Build a collaborative dev tools app with WebSocket communication, state syncing, and structured SQL/NoSQL storage.`;
      } else if (lower.includes('aws') || lower.includes('cloud')) {
        response = `For AWS: Focus on S3 asset delivery, Lambda serverless endpoints, API Gateway routing, and VPC networks.`;
      } else if (lower.includes('database') || lower.includes('postgres')) {
        response = `For Database: Learn database indexes, transaction isolation, connection pools, and query optimization.`;
      }
      setMentorMessage(response);
      setIsAiThinking(false);
    }, 400);
  };

  const formatDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Dynamic Chart SVG calculations based on user's real XP
  const maxScale = Math.max(100, xp);
  const getY = (val: number) => 120 - (val / maxScale) * 100;

  const p0 = 0;
  const p1 = Math.round(xp * 0.2);
  const p2 = Math.round(xp * 0.5);
  const p3 = Math.round(xp * 0.8);
  const p4 = xp;

  const y0 = getY(p0);
  const y1 = getY(p1);
  const y2 = getY(p2);
  const y3 = getY(p3);
  const y4 = getY(p4);

  const chartStrokeD = `M 0 ${y0} C 55 ${y0}, 55 ${y1}, 110 ${y1} C 165 ${y1}, 165 ${y2}, 220 ${y2} C 275 ${y2}, 275 ${y3}, 330 ${y3} C 385 ${y3}, 385 ${y4}, 440 ${y4}`;
  const chartFillD = `${chartStrokeD} L 440 140 L 0 140 Z`;

  const focusX = 330;
  const focusY = y3;

  const handleTriggerEvaluation = async () => {
    try {
      setIsEvaluating(true);
      const evalData = await apiService.triggerEvaluation();
      if (evalData) {
        setEvaluationReport(evalData);
        if (evalData.xp !== undefined) {
          setXp(evalData.xp);
        }
        if (evalData.skills) {
          setSkillScores(evalData.skills.map((s: any) => ({
            id: s.name,
            skill_name: s.name,
            score: s.score,
            verified: s.verified
          })));
        }
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setToasts(prev => [
          ...prev,
          {
            id: `eval-${Date.now()}`,
            title: 'AI Evaluation Complete! 🎯',
            message: 'Your developer ranking, percentile, and skills scores have been updated.',
            type: 'success'
          }
        ]);
      }
    } catch (err) {
      console.error("Error triggering evaluation:", err);
      setToasts(prev => [
        ...prev,
        {
          id: `eval-err-${Date.now()}`,
          title: 'Evaluation Failed ⚠️',
          message: 'Unable to run AI evaluation. Please try again later.',
          type: 'error'
        }
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const fetchEvaluationAndXp = async () => {
      try {
        const evalData = await apiService.getEvaluation();
        if (evalData) {
          setEvaluationReport(evalData);
          if (evalData.xp !== undefined) {
            setXp(evalData.xp);
          }
          if (evalData.skills) {
            setSkillScores(evalData.skills.map((s: any) => ({
              id: s.name,
              skill_name: s.name,
              score: s.score,
              verified: s.verified
            })));
          }
        } else {
          // Fallback to fetch raw XP if no evaluation exists yet
          const { data, error } = await supabase
            .from('users')
            .select('profile_details')
            .eq('id', userId)
            .maybeSingle();
          if (!error && data && data.profile_details?.xp !== undefined) {
            setXp(Number(data.profile_details.xp));
          }
        }
      } catch (err) {
        console.error("Error fetching evaluation report on mount:", err);
      }
    };
    fetchEvaluationAndXp();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const [apiProjects, scoresRes] = await Promise.all([
          apiService.getChallenges(),
          supabase.from('skill_scores').select('*').eq('user_id', userId)
        ]);

        if (scoresRes.error) throw scoresRes.error;

        const normalizedDevSkills = (developerSkills || []).map(s => s.toLowerCase());

        const mapped = apiProjects.map((proj: any) => {
          const projSkills = proj.skills || [];
          const isMatched = projSkills.some((s: string) => 
            normalizedDevSkills.some(ds => ds.includes(s.toLowerCase()) || s.toLowerCase().includes(ds))
          );

          return {
            id: proj.id,
            rank: proj.rank,
            name: proj.name,
            companyId: proj.companyId,
            author: proj.author,
            avatar: proj.avatar || `https://i.pravatar.cc/150?u=${proj.author || 'company'}`,
            date: new Date(proj.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            stack: projSkills.map(formatSkillTitle).join(', '),
            participants: proj.participants,
            status: proj.status,
            statusColor: proj.status === 'Public' ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' : 'text-white/50 bg-white/5 border-[#333]',
            appStatus: proj.appStatus,
            skills: projSkills,
            isMatched
          };
        });

        setChallenges(mapped);

        // Initialize and set skill scores starting from 0
        let userScores = scoresRes.data || [];
        if (userScores.length === 0 && developerSkills && developerSkills.length > 0) {
          const rowsToInsert = developerSkills.map(skill => ({
            user_id: userId,
            skill_name: skill,
            score: 0,
            verified: false
          }));
          const { data: inserted, error: insertError } = await supabase
            .from('skill_scores')
            .insert(rowsToInsert)
            .select();
          if (!insertError && inserted) {
            userScores = inserted;
          } else {
            userScores = rowsToInsert;
          }
        }
        setSkillScores(userScores);

      } catch (err) {
        console.error("Error loading active challenges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, [userId, developerSkills]);

  const handleJoin = async (projectId: string) => {
    try {
      const res = await apiService.joinChallenge(projectId);
      if (!res) {
        alert("Failed to join challenge.");
        return;
      }
      
      setChallenges(prev => prev.map(c => {
        if (c.id === projectId) {
          return { ...c, appStatus: 'pending', participants: (parseInt(c.participants) + 1).toString() };
        }
        return c;
      }));

      // Concurrently fetch updated skill scores and user profile details from backend updates
      const [scoresRes, userRes] = await Promise.all([
        supabase.from('skill_scores').select('*').eq('user_id', userId),
        supabase.from('users').select('profile_details').eq('id', userId).maybeSingle()
      ]);

      if (scoresRes.data) {
        setSkillScores(scoresRes.data);
      }
      if (userRes.data?.profile_details?.xp !== undefined) {
        setXp(Number(userRes.data.profile_details.xp));
      }

      setToasts(prev => [
        ...prev,
        {
          id: `joined-${projectId}`,
          title: 'Project Joined! 🚀',
          message: 'You registered for this project. +50 XP added to your total balance and skills!',
          type: 'success'
        }
      ]);
    } catch (err: any) {
      console.error("Error joining challenge:", err);
    }
  };

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
                <p className="text-sm text-white/80 mt-0.5">{challenges.filter(c => c.appStatus).length} joined challenge{challenges.filter(c => c.appStatus).length === 1 ? '' : 's'}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Growth rate</span>
                <p className="text-sm font-mono text-[#00d2ff] mt-0.5">+ {(skillScores.reduce((acc, s) => acc + (s.score || 0), 0) / 10).toFixed(1)} %</p>
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
                <path d={chartFillD} fill="url(#gFill)"/>
                <path d={chartStrokeD} fill="none" stroke="#00d2ff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx={focusX} cy={focusY} r="4.5" fill="#111318" stroke="#00d2ff" strokeWidth="2.5"/>
                <circle cx={focusX} cy={focusY} r="1.5" fill="white"/>
                <line x1={focusX} y1={focusY} x2={focusX} y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
              </svg>
              {/* Tooltip */}
              <div 
                className="absolute bg-[#1a1d24] border border-[#333] rounded-lg px-3 py-2 pointer-events-none transition-all"
                style={{ left: `${(focusX / 440) * 100}%`, transform: 'translateX(-50%)', top: `${Math.max(0, focusY - 50)}px` }}
              >
                <span className="text-[10px] text-white/50 block font-mono">{formatDate(10)}</span>
                <span className="text-sm font-semibold font-mono">★ {p3} XP</span>
                <span className="text-[10px] text-[#00d2ff] font-mono ml-1">+ {xp > 0 ? '10.0' : '0.0'} %</span>
              </div>
            </div>

            {/* Chart X-axis */}
            <div className="flex justify-between text-[10px] text-white/30 font-mono -mt-1">
              <span>{formatDate(30)}</span><span>{formatDate(20)}</span><span>{formatDate(10)}</span><span>Today</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#333]">
              <span className="text-2xl font-bold font-mono text-[#00d2ff]">+ {(skillScores.reduce((acc, s) => acc + (s.score || 0), 0) / 10).toFixed(1)} <span className="text-base">%</span></span>
              <div className="text-right">
                <span className="text-[10px] text-white/30 block">Last updated</span>
                <span className="text-xs text-white/60 font-mono">Today, {lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* My Top Skills */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">My Top Skills</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-mono">
                {String(Math.min(5, skillScores.length)).padStart(2, '0')} of {skillScores.length}
              </span>
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
            {skillScores.length === 0 ? (
              <div className="col-span-2 border border-dashed border-[#333] rounded-2xl p-6 text-center text-white/40 font-mono text-xs">
                No skills set. Select your skills in profile setup!
              </div>
            ) : (
              skillScores.slice(0, 4).map((skill, index) => {
                const colors = ['bg-[#00d2ff]', 'bg-[#10b981]', 'bg-[#fbbf24]', 'bg-[#2563eb]'];
                const color = colors[index % colors.length];
                const capitalizedName = formatSkillTitle(skill.skill_name);
                const points = skill.score;
                const changeMetric = skill.score > 0 ? (skill.score / 5 + (index + 1) * 1.2).toFixed(2) : '0.00';

                return (
                  <div key={skill.id || skill.skill_name} className="border border-[#333] rounded-2xl bg-[#111318] p-4 hover:border-white/20 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="text-sm font-semibold">{capitalizedName}</span>
                      </div>
                      <button className="text-white/30 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold font-mono"># {points.toLocaleString()} XP</span>
                      <span className="text-xs font-mono text-[#10b981]">↑ {changeMetric} %</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold font-mono px-2.5 py-1 rounded-md border ${
                        skill.verified 
                          ? 'text-[#10b981] bg-[#10b981]/5 border-[#10b981]/25' 
                          : 'text-white/30 bg-white/2 border-white/5'
                      }`}>
                        {skill.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                      <button className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border-none">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
              <span className="text-3xl font-bold font-mono">★ {xp.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Compared to last month</span>
              <span className="text-sm font-mono text-[#10b981]">+ {(skillScores.length * 3.5).toFixed(1)} %</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-b border-[#333]">
              <span className="text-xs text-white/50 flex items-center gap-1.5">
                Yearly avg: <strong className="text-white font-mono">★ {(xp * 1.5).toFixed(0)}</strong>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </span>
              <a href="#" onClick={(e) => { e.preventDefault(); handleUpgrade(); }} className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
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
                {isAiThinking ? (
                  <div className="flex items-center gap-2 text-xs text-white/50 py-1 font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00d2ff]" />
                    <span>AI Mentor is analyzing...</span>
                  </div>
                ) : (
                  <p className="text-xs text-white/80 leading-relaxed">
                    {mentorMessage}
                  </p>
                )}
              </div>

              {/* Suggestion pills */}
              <div className="flex flex-wrap gap-2">
                {['React hooks', 'DSA prep', 'Project idea'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => handleMentorSend(tag)}
                    className="text-[11px] font-medium px-2.5 py-1 border border-[#333] rounded-full text-white/60 hover:text-white hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/5 transition-colors cursor-pointer"
                  >
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
                  value={mentorInput}
                  onChange={e => setMentorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleMentorSend()}
                  className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-xl h-10 px-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d2ff]/40"
                />
                <button 
                  onClick={() => handleMentorSend()}
                  className="h-10 px-4 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 3: AI Evaluation (spans 3 cols) ── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">AI Evaluation</h2>
              <p className="text-xs text-white/40 mt-0.5">Powered by AI Engine</p>
            </div>
            <button 
              onClick={handleTriggerEvaluation} 
              disabled={isEvaluating}
              className={`text-xs text-[#00d2ff] hover:text-[#00d2ff]/80 transition-colors cursor-pointer flex items-center gap-1 bg-transparent border-none ${isEvaluating ? 'animate-pulse' : ''}`}
            >
              {isEvaluating ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          <div className="border border-[#333] rounded-2xl bg-[#111318] p-5 space-y-4 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            {/* Decorative gradient blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />

            {isEvaluating ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#00d2ff]" />
                <p className="text-xs text-white/60 font-mono animate-pulse">Running AI evaluation...</p>
              </div>
            ) : evaluationReport ? (
              <>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#00d2ff] bg-[#00d2ff]/10 px-2.5 py-1 rounded-full border border-[#00d2ff]/20">
                      Evaluation Active
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">Synced</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Global Rank</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold font-mono text-white">
                          🏆 {evaluationReport.ranking.split(' of ')[0].replace('Rank ', '')}
                        </span>
                        <span className="text-xs text-white/40 font-mono">
                          of {evaluationReport.ranking.split(' of ')[1] || 'devs'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Percentile Grade</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold font-mono text-[#10b981]">
                          ★ {evaluationReport.percentile}%
                        </span>
                        <span className="text-xs text-white/40 font-mono">percentile</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                    Your skills and XP are verified by the AI Engine. View the full report to check Strengths, Improvements, and Actionable Steps.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#333] mt-auto relative z-10">
                  <button 
                    onClick={handleTriggerEvaluation}
                    className="text-[11px] text-white/40 cursor-pointer hover:text-white/60 transition-colors bg-transparent border-none"
                  >
                    Re-run
                  </button>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer border-none"
                  >
                    View Report
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 relative z-10">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-1 rounded-full border border-[#f59e0b]/20">
                    Not Evaluated Yet
                  </span>

                  <h3 className="text-lg font-bold tracking-tight text-white">
                    🎯 Run AI Diagnostics
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Verify your skill scores, receive actionable career guidelines, and compute your official ranking and percentile grade on Upzeal.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#333] mt-auto relative z-10">
                  <span className="text-[11px] text-white/30">Free verification</span>
                  <button 
                    onClick={handleTriggerEvaluation}
                    className="text-xs font-bold bg-[#00d2ff] text-black px-4 py-2 rounded-lg hover:bg-[#00d2ff]/90 active:scale-[0.97] transition-all cursor-pointer border-none shadow-lg shadow-[#00d2ff]/20"
                  >
                    Evaluate Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Active Challenges Table (full width) ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Active Challenges</h2>
            <p className="text-xs text-white/40 mt-0.5">Explore open projects posted by partner companies and clients</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-[#0a0a0a] rounded-lg p-1 border border-[#333]">
              <button 
                onClick={() => setChallengeFilter('all')}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-md cursor-pointer transition-colors ${challengeFilter === 'all' ? 'bg-[#1a1d24] text-white border border-[#333]' : 'text-white/40 hover:text-white/70'}`}
              >
                All Projects ({challenges.length})
              </button>
              <button 
                onClick={() => setChallengeFilter('matched')}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-md cursor-pointer transition-colors ${challengeFilter === 'matched' ? 'bg-[#1a1d24] text-white border border-[#333]' : 'text-white/40 hover:text-white/70'}`}
              >
                Matched ({challenges.filter(c => c.isMatched).length})
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-[#333] rounded-2xl bg-[#111318] overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#333] text-[11px] text-white/40 uppercase tracking-wider font-medium bg-[#0a0a0a]/50">
                  <th className="px-5 py-3 w-12">#</th>
                  <th className="px-5 py-3">Challenge</th>
                  <th className="px-5 py-3">Company / Author</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Required Tech Stack</th>
                  <th className="px-5 py-3">Applicants</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-white/40" />
                    </td>
                  </tr>
                ) : (challenges.filter(c => challengeFilter === 'all' || c.isMatched)).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-white/40 font-mono text-xs">
                      {challengeFilter === 'matched' ? 'No projects match your exact tech stack. Click "All Projects" to view all company postings!' : 'No open challenges posted yet.'}
                    </td>
                  </tr>
                ) : (
                  challenges
                    .filter(c => challengeFilter === 'all' || c.isMatched)
                    .map(row => (
                      <tr key={row.id} className="border-b border-[#333] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-white/40">{row.rank}</td>
                        <td className="px-5 py-4 font-semibold text-white/90">
                          <div className="flex items-center gap-2">
                            <span>{row.name}</span>
                            {row.isMatched && (
                              <span className="text-[10px] font-bold text-[#00d2ff] bg-[#00d2ff]/10 border border-[#00d2ff]/20 px-2 py-0.5 rounded-full">
                                ★ Recommended
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div 
                            onClick={() => row.companyId && onSelectCompany && onSelectCompany(row.companyId)}
                            className={`flex items-center gap-2 ${row.companyId ? 'cursor-pointer hover:opacity-85 transition-opacity group' : ''}`}
                          >
                            <img src={row.avatar} alt="" className="w-6 h-6 rounded-full border border-[#333] object-cover" />
                            <span className={`text-white/80 font-medium ${row.companyId ? 'group-hover:text-[#00d2ff] group-hover:underline' : ''}`}>{row.author}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-white/40 text-xs">{row.date}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {row.skills.map((skill: string) => (
                              <span key={skill} className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#0a0a0a] border border-[#333] text-white/70 rounded">
                                {formatSkillTitle(skill)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-white/80 font-mono font-semibold">
                            {row.participants}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${row.statusColor}`}>{row.status}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {row.appStatus ? (
                            <span className="inline-block text-xs font-semibold text-white/40 bg-white/5 border border-[#333] px-3.5 py-1.5 rounded-lg select-none">
                              {row.appStatus === 'hired' ? 'Hired' : row.appStatus === 'shortlisted' ? 'Shortlisted' : row.appStatus === 'rejected' ? 'Rejected' : 'Applied'}
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleJoin(row.id)}
                              className="text-xs font-semibold text-black bg-white px-4 py-1.5 rounded-lg hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer border-none"
                            >
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Evaluation Report Modal */}
      <AnimatePresence>
        {showReportModal && evaluationReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-[#111318] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#333] bg-[#0a0a0a]/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00d2ff]" />
                  <h3 className="text-base font-bold text-white">AI Evaluation Insights</h3>
                </div>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Report Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stats Summary Panel */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Global Ranking</span>
                    <p className="text-sm font-bold text-white font-mono">{evaluationReport.ranking}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Percentile Grade</span>
                    <p className="text-sm font-bold text-[#10b981] font-mono">{evaluationReport.percentile}% percentile</p>
                  </div>
                </div>

                {/* Markdown Viewer */}
                <div className="border border-[#333] rounded-2xl bg-[#0a0a0a] p-5">
                  <MarkdownReportViewer reportText={evaluationReport.feedback_report} />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#333] flex justify-end bg-[#0a0a0a]/50">
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 transition-all cursor-pointer border-none"
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface UserProject {
  id: string;
  title: string;
  company: string;
  budget: string;
  status: string;
  projectStatus: string;
  dateStr: string;
}

interface TimelineEvent {
  id: string;
  dateStr: string;
  timestamp: number;
  title: string;
  description: string;
  isHighlight: boolean;
}

interface PostItem {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  likedByUser?: boolean;
  createdAt: string;
}

function StudentProfileView({ userId, firstName, lastName, email, onAvatarChange }: { userId: string; firstName: string; lastName: string; email: string; onAvatarChange?: (url: string) => void }) {
  const [xp, setXp] = useState(0);
  const [contributionsMap, setContributionsMap] = useState<Record<string, number>>({});
  const [onboardedProjects, setOnboardedProjects] = useState<UserProject[]>([]);
  const [activeProjects, setActiveProjects] = useState<UserProject[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Instagram Gallery states
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editCaptionText, setEditCaptionText] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Post creation states
  const [postImage, setPostImage] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Image Cropping states
  const [originalImage, setOriginalImage] = useState('');
  const [cropScale, setCropScale] = useState(1.0);
  const [cropRotation, setCropRotation] = useState(0);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const commits = React.useMemo(() => {
    const grid = [];
    const today = new Date();

    for (let col = 0; col < 52; col++) {
      const column = [];
      for (let row = 0; row < 7; row++) {
        const diffDays = 363 - (col * 7 + row);
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - diffDays);

        const year = cellDate.getFullYear();
        const month = String(cellDate.getMonth() + 1).padStart(2, '0');
        const day = String(cellDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        const count = contributionsMap[dateKey] || 0;

        let intensity = 0;
        if (count >= 4) intensity = 4;
        else if (count === 3) intensity = 3;
        else if (count === 2) intensity = 2;
        else if (count === 1) intensity = 1;

        column.push(intensity);
      }
      grid.push(column);
    }
    return grid;
  }, [contributionsMap]);

  const totalContributions = React.useMemo(() => {
    let total = 0;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const oneDayMs = 24 * 60 * 60 * 1000;

    Object.entries(contributionsMap).forEach(([dateStr, count]) => {
      const cellDate = new Date(dateStr);
      const diffDays = Math.floor((today.getTime() - cellDate.getTime()) / oneDayMs);
      if (diffDays >= 0 && diffDays < 364) {
        total += count;
      }
    });
    return total;
  }, [contributionsMap]);

  const getColor = (intensity: number) => {
    switch(intensity) {
      case 4: return 'bg-[#39d353] border-[#39d353]';
      case 3: return 'bg-[#26a641] border-[#26a641]';
      case 2: return 'bg-[#006d32] border-[#006d32]';
      case 1: return 'bg-[#0e4429] border-[#0e4429]';
      default: return 'bg-[#161b22] border-[#333]';
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Full-stack engineer passionate about distributed systems and real-time data streaming. Building tools that empower developers to write better code faster. Currently exploring the intersection of WebSockets and geospatial mapping.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Temp states during editing
  const [tempBio, setTempBio] = useState(bio);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  const [tempUsername, setTempUsername] = useState('');

  // Load profile details from database
  useEffect(() => {
    if (!userId) return;
    const loadProfile = async () => {
      // 1. Fetch user registration and details
      const { data: userData } = await supabase
        .from('users')
        .select('created_at, username, profile_details')
        .eq('id', userId)
        .single();

      // 2. Fetch applications with joined project and company details
      const { data: appsData } = await supabase
        .from('applications')
        .select(`
          created_at,
          status,
          project:projects (
            title,
            status,
            budget,
            company:companies (
              name
            )
          )
        `)
        .eq('developer_id', userId);

      // 3. Fetch reviews received
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('created_at')
        .eq('reviewee_id', userId);

      const map: Record<string, number> = {};

      const addDate = (dateStr: string | null) => {
        if (!dateStr) return;
        const dateKey = dateStr.slice(0, 10); // YYYY-MM-DD
        map[dateKey] = (map[dateKey] || 0) + 1;
      };

      const formatMonthYear = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[d.getMonth()]} ${d.getFullYear()}`;
      };

      const eventsList: TimelineEvent[] = [];
      const onboarded: UserProject[] = [];
      const active: UserProject[] = [];

      if (userData) {
        addDate(userData.created_at);
        
        eventsList.push({
          id: 'signup',
          dateStr: formatMonthYear(userData.created_at),
          timestamp: new Date(userData.created_at).getTime(),
          title: 'Joined the Upzeal Platform',
          description: 'Started tracking Git history, building developer profile, and accessing AI mentor sessions.',
          isHighlight: false
        });

        if (userData.username) {
          setUsername(userData.username);
          setTempUsername(userData.username);
        }
        if (userData.profile_details) {
          const details = userData.profile_details;
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
            if (onAvatarChange) onAvatarChange(details.avatar_url);
          }
          if (details.xp) {
            setXp(Number(details.xp) || 0);
          }
          if (details.posts) {
            setPosts(Array.isArray(details.posts) ? details.posts : []);
          }
        }
      }

      if (appsData) {
        const apps = appsData as any[];
        apps.forEach((app, index) => {
          addDate(app.created_at);
          
          const proj = app.project;
          if (!proj) return;
          
          const companyName = proj.company?.name || 'Upzeal Client';
          const budget = proj.budget || 'N/A';
          const isHired = app.status === 'hired';
          const isCompleted = proj.status === 'completed';

          const mappedProj = {
            id: app.created_at,
            title: proj.title,
            company: companyName,
            budget: budget,
            status: app.status,
            projectStatus: proj.status,
            dateStr: formatMonthYear(app.created_at)
          };

          if (isHired) {
            onboarded.push(mappedProj);
          }
          
          if (!isCompleted && (app.status === 'pending' || app.status === 'shortlisted' || app.status === 'hired')) {
            active.push(mappedProj);
          }

          if (isHired && isCompleted) {
            eventsList.push({
              id: `finished-${app.created_at}-${index}`,
              dateStr: formatMonthYear(app.created_at),
              timestamp: new Date(app.created_at).getTime() + 10,
              title: `Finished Project: ${proj.title}`,
              description: `Successfully completed code asset delivery and final review requirements for ${companyName}.`,
              isHighlight: true
            });
          } else {
            const titlePrefix = isHired ? 'Onboarded to Project' : 'Applied to Project';
            const statusDesc = isHired ? 'Hired and actively working on the challenge.' : 'Application submitted and pending recruiter review.';
            
            eventsList.push({
              id: `onboarded-${app.created_at}-${index}`,
              dateStr: formatMonthYear(app.created_at),
              timestamp: new Date(app.created_at).getTime(),
              title: `${titlePrefix}: ${proj.title}`,
              description: `Partnered with ${companyName} for technical challenges. Current Status: ${statusDesc}`,
              isHighlight: isHired
            });
          }
        });
      }

      if (reviewsData) {
        reviewsData.forEach(rev => addDate(rev.created_at));
      }

      eventsList.sort((a, b) => b.timestamp - a.timestamp);
      if (eventsList.length > 0) {
        eventsList[0].isHighlight = true;
      }

      setContributionsMap(map);
      setOnboardedProjects(onboarded);
      setActiveProjects(active);
      setTimelineEvents(eventsList);
    };
    loadProfile();
  }, [userId]);

  const handlePostFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; // Load higher res image for cropping
        const MAX_HEIGHT = 1200;
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPostImage(dataUrl);
          setOriginalImage(dataUrl);
          // Reset crop adjustments
          setCropScale(1.0);
          setCropRotation(0);
          setCropX(0);
          setCropY(0);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setPostImage(url);
    setOriginalImage(url);
    // Reset crop adjustments
    setCropScale(1.0);
    setCropRotation(0);
    setCropX(0);
    setCropY(0);
  };

  // Drag and touch handlers for panning crop box
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropX, y: e.clientY - cropY });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropX(e.clientX - dragStart.x);
    setCropY(e.clientY - dragStart.y);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - cropX, y: touch.clientY - cropY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setCropX(touch.clientX - dragStart.x);
    setCropY(touch.clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const generateCroppedImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!originalImage) {
        resolve(postImage);
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const cropSize = 600; // Final square output size
        canvas.width = cropSize;
        canvas.height = cropSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, cropSize, cropSize);

        ctx.save();
        ctx.translate(cropSize / 2, cropSize / 2);
        ctx.rotate((cropRotation * Math.PI) / 180);
        ctx.scale(cropScale, cropScale);

        const screenSize = 280; // matches crop container aspect-square width on screen
        const scaleFactor = cropSize / screenSize;
        ctx.translate((cropX * scaleFactor) / cropScale, (cropY * scaleFactor) / cropScale);

        const imgWidth = img.width;
        const imgHeight = img.height;
        let drawWidth = cropSize;
        let drawHeight = cropSize;

        if (imgWidth > imgHeight) {
          drawWidth = cropSize * (imgWidth / imgHeight);
        } else {
          drawHeight = cropSize * (imgHeight / imgWidth);
        }

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(croppedDataUrl);
      };
      img.onerror = () => {
        resolve(originalImage || postImage);
      };
      img.src = originalImage;
    });
  };

  const handleCreatePost = async () => {
    if (!postImage.trim()) {
      setPostError("Please select or paste an image.");
      return;
    }
    setIsPosting(true);
    setPostError(null);

    try {
      // Generate the final cropped/adjusted Base64
      const croppedImage = await generateCroppedImage();

      const newPost: PostItem = {
        id: `post_${Date.now()}`,
        imageUrl: croppedImage,
        caption: postCaption.trim(),
        likes: 0,
        likedByUser: false,
        createdAt: new Date().toISOString()
      };

      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const currentPosts = Array.isArray(details.posts) ? details.posts : [];
      const updatedPosts = [newPost, ...currentPosts];

      const mergedDetails = {
        ...details,
        posts: updatedPosts
      };

      const { error } = await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      if (error) {
        setPostError(error.message);
      } else {
        setPosts(updatedPosts);
        setPostImage('');
        setOriginalImage('');
        setPostCaption('');
        setShowCreatePostModal(false);
      }
    } catch (err: any) {
      setPostError(err.message || "An error occurred");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      });

      if (selectedPost && selectedPost.id === postId) {
        const liked = !selectedPost.likedByUser;
        setSelectedPost({
          ...selectedPost,
          likedByUser: liked,
          likes: liked ? selectedPost.likes + 1 : Math.max(0, selectedPost.likes - 1)
        });
      }

      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const mergedDetails = {
        ...details,
        posts: updatedPosts
      };

      await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleSavePostCaption = async (postId: string) => {
    try {
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            caption: editCaptionText.trim()
          };
        }
        return p;
      });

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          caption: editCaptionText.trim()
        });
      }

      // Fetch current profile details
      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const mergedDetails = {
        ...details,
        posts: updatedPosts
      };

      // Save to database
      await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      setPosts(updatedPosts);
      setIsEditingCaption(false);
    } catch (err) {
      console.error("Error updating caption:", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const updatedPosts = posts.filter(p => p.id !== postId);

      // Fetch current profile details
      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const mergedDetails = {
        ...details,
        posts: updatedPosts
      };

      // Save to database
      await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      setPosts(updatedPosts);
      setSelectedPost(null);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

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
      const normalizedUsername = tempUsername.trim().toLowerCase();
      if (!normalizedUsername) {
        setEditError("Username cannot be empty");
        setIsSaving(false);
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
        setEditError("Username can only contain letters, numbers, and underscores");
        setIsSaving(false);
        return;
      }

      if (normalizedUsername !== username) {
        const { data: existingUser, error: checkErr } = await supabase
          .from('users')
          .select('id')
          .eq('username', normalizedUsername)
          .maybeSingle();

        if (checkErr) {
          setEditError("Error checking username availability: " + checkErr.message);
          setIsSaving(false);
          return;
        }

        if (existingUser) {
          setEditError("Username is already taken by another user");
          setIsSaving(false);
          return;
        }
      }

      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const mergedDetails = {
        ...(currentData?.profile_details || {}),
        bio: tempBio,
        location: tempLocation,
        avatar_url: tempAvatarUrl
      };

      const { error } = await supabase
        .from('users')
        .update({
          username: normalizedUsername,
          profile_details: mergedDetails
        })
        .eq('id', userId);

      if (error) {
        setEditError(error.message);
      } else {
        setBio(tempBio);
        setLocation(tempLocation);
        setAvatarUrl(tempAvatarUrl);
        setUsername(normalizedUsername);
        if (onAvatarChange) onAvatarChange(tempAvatarUrl);
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
    setTempUsername(username);
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
              <input
                type="text"
                value={tempAvatarUrl}
                onChange={e => setTempAvatarUrl(e.target.value)}
                placeholder="Or paste URL..."
                className="w-full bg-[#1b1e28] border border-[#333] rounded-md h-7 px-2 text-[10px] text-white placeholder:text-white/20 focus:outline-none mb-2"
              />
              <span className="text-[10px] text-white/40 block mb-1">Presets:</span>
              <div className="flex justify-center gap-1.5">
                {['dev1', 'dev2', 'dev3', 'dev4'].map(u => (
                  <img
                    key={u}
                    src={`https://i.pravatar.cc/150?u=${u}`}
                    alt=""
                    onClick={() => setTempAvatarUrl(`https://i.pravatar.cc/150?u=${u}`)}
                    className="w-6 h-6 rounded-full border border-white/20 hover:border-[#00d2ff] cursor-pointer object-cover hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 text-left w-full">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/60">Username (Chat Handle)</label>
              <div className="relative w-full md:max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="username"
                  className="w-full bg-brand-gray border border-white/10 rounded-xl h-10 pl-8 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#00d2ff] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">Other developers and recruiters can search for you in Chat using this handle.</p>
            </div>

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
        <div className="flex flex-col md:flex-row gap-8 items-start mb-10 p-6 md:p-8 bg-[#121520]/45 border border-white/5 rounded-3xl relative group text-left w-full shadow-xl overflow-hidden">
          {/* Top subtle gradient glow bar inside card */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Avatar Container */}
          <div className="w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden shrink-0 bg-[#0d1117] shadow-lg group-hover:border-[#00d2ff]/40 transition-colors">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-4xl text-white">
                {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : email[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start text-left pt-1.5 w-full">
            <div className="flex w-full justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{firstName && lastName ? `${firstName} ${lastName}` : email}</h1>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-xs font-bold px-4 py-2 border border-white/10 hover:border-[#00d2ff]/30 hover:bg-[#00d2ff]/5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-white/80 hover:text-[#00d2ff] shrink-0"
              >
                <Edit3 className="w-3 h-3" /> Edit Profile
              </button>
            </div>
            <div className="flex items-center gap-3.5 mt-3 text-white/50 text-xs flex-wrap">
              {username && (
                <span className="font-mono flex items-center gap-1 bg-white/2 border border-white/5 rounded-md px-2 py-0.5 text-[#00d2ff]">
                  <span className="font-bold text-[#00d2ff] opacity-60">@</span>{username}
                </span>
              )}
              <span className="font-mono flex items-center gap-1 bg-white/2 border border-white/5 rounded-md px-2 py-0.5"><MapPin className="w-3 h-3 text-[#00d2ff]" /> {location}</span>
              <span className="font-mono flex items-center gap-1 bg-white/2 border border-white/5 rounded-md px-2 py-0.5"><User className="w-3 h-3 text-[#00d2ff]" /> {email}</span>
            </div>
            <p className="mt-4 text-sm text-white/70 max-w-2xl leading-relaxed whitespace-pre-wrap font-sans font-medium">
              {bio}
            </p>
          </div>
        </div>
      )}

      {/* GitHub Contribution Graph */}
      <div className="mb-10">
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 text-left">Contributions</h2>
        <div className="p-6 border border-white/5 rounded-2xl bg-[#121520]/45 overflow-x-auto shadow-md">
          <div className="flex gap-1 min-w-max">
            {commits.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1">
                {col.map((intensity, rowIdx) => (
                  <div key={`${colIdx}-${rowIdx}`} className={`w-3 h-3 rounded-[2px] border ${getColor(intensity)}`} />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-white/50 flex-wrap gap-2">
            <span className="font-mono font-medium">{totalContributions} contributions in the last year</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span>Less</span>
              <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-white/5" />
              <div className="w-3 h-3 rounded-[2px] bg-[#0e4429] border border-[#0e4429]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#006d32] border border-[#006d32]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#26a641] border border-[#26a641]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#39d353] border border-[#39d353]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarded and Active Projects Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Onboarded Projects Column */}
        <div className="border border-white/5 rounded-3xl bg-[#121520]/45 p-6 md:p-8 space-y-5 text-left shadow-lg">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(0,210,255,0.3)]"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Onboarded Projects
          </h3>
          <div className="space-y-4">
            {onboardedProjects.length === 0 ? (
              <div className="border border-dashed border-white/5 bg-[#07090e]/30 rounded-2xl p-6 text-center text-white/30">
                <p className="text-xs font-mono">No onboarded projects yet.</p>
              </div>
            ) : (
              onboardedProjects.map((proj, idx) => (
                <div key={idx} className="border border-white/5 rounded-2xl p-5 bg-[#07090e]/60 hover:border-[#00d2ff]/30 transition-all duration-300 space-y-3 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#00d2ff] transition-colors">{proj.title}</h4>
                    <span className="text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/25 shrink-0">
                      Hired
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/50 border-t border-white/5 pt-3">
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block font-semibold">Client</span>
                      <strong className="text-white/80">{proj.company}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block font-semibold">Budget</span>
                      <strong className="text-white/80 font-mono">{proj.budget}</strong>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-[10px] text-white/30 uppercase block font-semibold">Hired On</span>
                      <span className="font-mono text-white/70">{proj.dateStr}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Projects Column */}
        <div className="border border-white/5 rounded-3xl bg-[#121520]/45 p-6 md:p-8 space-y-5 text-left shadow-lg">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Active Projects
          </h3>
          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <div className="border border-dashed border-white/5 bg-[#07090e]/30 rounded-2xl p-6 text-center text-white/30">
                <p className="text-xs font-mono">No active projects yet.</p>
              </div>
            ) : (
              activeProjects.map((proj, idx) => (
                <div key={idx} className="border border-white/5 rounded-2xl p-5 bg-[#07090e]/60 hover:border-[#10b981]/30 transition-all duration-300 space-y-3 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#10b981]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#10b981] transition-colors">{proj.title}</h4>
                    <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded border shrink-0 ${
                      proj.status === 'hired'
                        ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/25'
                        : proj.status === 'shortlisted'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25'
                        : 'bg-white/5 text-white/60 border-white/10'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/50 border-t border-white/5 pt-3">
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block font-semibold">Client</span>
                      <strong className="text-white/80">{proj.company}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/30 uppercase block font-semibold">Budget</span>
                      <strong className="text-white/80 font-mono">{proj.budget}</strong>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-[10px] text-white/30 uppercase block font-semibold">Applied On</span>
                      <span className="font-mono text-white/70">{proj.dateStr}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-16 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4.5">
          <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Posts
          </h2>
          <button
            onClick={() => setShowCreatePostModal(true)}
            className="text-xs font-bold px-4 py-2 bg-[#00d2ff] hover:bg-[#00d2ff]/90 hover:shadow-[0_0_15px_rgba(0,210,255,0.3)] text-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-white/5 rounded-2xl p-12 text-center text-white/40 space-y-3.5 bg-[#121520]/25">
            <div className="w-12 h-12 rounded-full bg-white/2 border border-white/5 flex items-center justify-center mx-auto text-white/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white/70">No posts yet</p>
              <p className="text-xs text-white/30 max-w-sm mx-auto">Share screenshots of your workstation, development highlights, or certifications with partner recruiters!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => setSelectedPost(post)}
                  className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-[#00d2ff]/30 cursor-pointer bg-[#0d1117] shadow-lg transition-all duration-300"
                >
                  <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                  {/* Premium Instagram Hover Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center select-none">
                    <div className="flex items-center gap-1.5 text-white font-mono text-xs font-bold mb-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {post.likes}
                    </div>
                    {post.caption && (
                      <p className="text-white/80 text-[10px] leading-snug line-clamp-3 max-w-full font-medium font-sans">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Post Upload Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e1015] border border-[#333] w-full max-w-md rounded-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#07090e]">
              <h3 className="text-base font-semibold text-white">Create New Post</h3>
              <button onClick={() => { setShowCreatePostModal(false); setPostImage(''); setPostCaption(''); setPostError(null); }} className="text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-white/60">Image Upload</label>
                {originalImage ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* Cropper Viewport Container */}
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-xl border border-[#333] bg-[#07090e] select-none group">
                      <div 
                        className="w-full h-full flex items-center justify-center pointer-events-none"
                        style={{
                          transform: `translate(${cropX}px, ${cropY}px) scale(${cropScale}) rotate(${cropRotation}deg)`,
                          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                        }}
                      >
                        <img src={originalImage} alt="Crop preview" className="max-w-none max-h-none select-none pointer-events-none" style={{ width: '100%', height: 'auto' }} />
                      </div>
                      {/* Drag overlay receiver */}
                      <div 
                        className="absolute inset-0 z-10 cursor-move"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      />
                      {/* Delete file button */}
                      <button 
                        onClick={() => { setPostImage(''); setOriginalImage(''); }} 
                        className="absolute top-2 right-2 z-20 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors cursor-pointer border-none"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>

                    {/* Adjustments Panel */}
                    <div className="w-full max-w-[280px] space-y-3">
                      {/* Zoom/Scale Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold text-white/50 w-8 text-left">Zoom</span>
                        <input 
                          type="range" 
                          min="1.0" 
                          max="3.0" 
                          step="0.05"
                          value={cropScale}
                          onChange={(e) => setCropScale(parseFloat(e.target.value))}
                          className="flex-1 accent-[#00d2ff] bg-white/10 h-1 rounded-lg cursor-pointer appearance-none"
                        />
                        <span className="text-[10px] font-mono text-white/50 w-6 text-right">{cropScale.toFixed(2)}x</span>
                      </div>

                      {/* Rotation controls & Reset */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCropRotation((prev) => (prev + 90) % 360)}
                          className="flex-1 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                          Rotate 90°
                        </button>
                        <button
                          onClick={() => { setCropScale(1.0); setCropRotation(0); setCropX(0); setCropY(0); }}
                          className="flex-1 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-dashed border-[#333] rounded-xl p-8 text-center hover:border-white/20 transition-all bg-[#07090e] relative flex flex-col items-center justify-center min-h-[160px]">
                      <input type="file" accept="image/*" onChange={handlePostFileChange} id="post-file-upload" className="hidden" />
                      <label htmlFor="post-file-upload" className="flex flex-col items-center gap-2 text-white/50 hover:text-white cursor-pointer select-none">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        <span className="text-xs font-semibold">Upload Photo</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={postImage}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="flex-1 bg-[#1b1e28] border border-[#333] rounded-xl h-10 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-white/60">Caption</label>
                <textarea
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Write a caption..."
                  rows={3}
                  className="w-full bg-[#1b1e28] border border-[#333] rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none resize-none"
                />
              </div>

              {postError && (
                <div className="text-red-400 text-xs text-left">
                  {postError}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#333] flex gap-3 justify-end bg-[#07090e]">
              <button
                onClick={() => { setShowCreatePostModal(false); setPostImage(''); setPostCaption(''); setPostError(null); }}
                className="h-10 px-5 border border-white/10 text-white/70 hover:text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={isPosting || !postImage.trim()}
                className="h-10 px-6 bg-[#00d2ff] disabled:bg-[#00d2ff]/50 disabled:text-black/50 text-black font-semibold rounded-xl hover:bg-[#00d2ff]/90 active:scale-[0.98] transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 border-none"
              >
                {isPosting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Zoom Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="bg-[#0e1015] border border-[#333] w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] max-h-[85vh]">
            {/* Image display */}
            <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              <img src={selectedPost.imageUrl} alt={selectedPost.caption} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Sidebar content */}
            <div className="md:w-2/5 flex flex-col border-l border-[#333] bg-[#0e1015]">
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#07090e]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#333] bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {firstName ? firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-white">{firstName && lastName ? `${firstName} ${lastName}` : email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {/* Edit Caption Button */}
                  <button 
                    onClick={() => {
                      setIsEditingCaption(true);
                      setEditCaptionText(selectedPost.caption || '');
                    }}
                    title="Edit Caption"
                    className="text-white/60 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>

                  {/* Delete Post Button */}
                  <button 
                    onClick={() => handleDeletePost(selectedPost.id)}
                    title="Delete Post"
                    className="text-red-400 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>

                  <div className="w-[1px] h-4 bg-[#333] mx-0.5" />

                  {/* Close Modal Button */}
                  <button onClick={() => { setSelectedPost(null); setIsEditingCaption(false); }} className="text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto text-left space-y-4">
                {isEditingCaption ? (
                  <div className="space-y-3">
                    <textarea
                      value={editCaptionText}
                      onChange={(e) => setEditCaptionText(e.target.value)}
                      placeholder="Edit caption..."
                      rows={4}
                      className="w-full bg-[#1b1e28] border border-[#333] rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsEditingCaption(false)}
                        className="h-8 px-3 border border-white/10 hover:bg-white/5 rounded-lg text-[10px] font-semibold text-white/70 hover:text-white cursor-pointer transition-all border-none bg-transparent"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSavePostCaption(selectedPost.id)}
                        className="h-8 px-4 bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black rounded-lg text-[10px] font-semibold transition-all cursor-pointer border-none"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : selectedPost.caption ? (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full border border-[#333] bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                      {firstName ? firstName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="text-white/90 leading-relaxed">
                        <strong className="text-white mr-1.5">{firstName || 'User'}</strong>
                        {selectedPost.caption}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/30 italic">No caption provided.</p>
                )}
              </div>

              <div className="p-4 border-t border-[#333] bg-[#07090e] space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`transition-all hover:scale-110 cursor-pointer border-none bg-transparent ${
                      selectedPost.likedByUser ? 'text-red-500' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={selectedPost.likedByUser ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <span className="text-xs text-white/50">
                    Shared on <span className="font-mono">{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-white font-mono">
                  {selectedPost.likes} {selectedPost.likes === 1 ? 'like' : 'likes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Confirmation Overlay */}
      {showDeleteSuccess && (
        <DeleteSuccessOverlay onClose={() => setShowDeleteSuccess(false)} />
      )}

    </div>
  );
}

function SuccessTickOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-8 bg-[#111318] border border-[#333] rounded-3xl shadow-2xl animate-pulse">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
          <Check className="w-12 h-12 stroke-[3]" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">Application Submitted</h3>
        <p className="text-xs text-white/50 mt-1 font-mono">Successfully sent to partner organization</p>
      </div>
    </div>
  );
}

function DeleteSuccessOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center justify-center p-8 bg-[#111318] border border-[#333] rounded-3xl shadow-2xl scale-up">
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 animate-bounce">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">Post Deleted</h3>
        <p className="text-xs text-white/50 mt-1 font-mono">Removed successfully from your profile</p>
      </div>
    </div>
  );
}

function StudentFeedView({ userId, developerSkills, onSelectCompany, setSkillScores, setXp, onStartChat }: { userId: string; developerSkills: string[]; onSelectCompany?: (id: string) => void; setSkillScores?: (scores: any) => void; setXp?: (xp: number) => void; onStartChat?: (partnerId: string) => void }) {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);
  const [appliedProjectIds, setAppliedProjectIds] = useState<string[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [showSuccessTick, setShowSuccessTick] = useState(false);

  const handleSelectCompany = (id: string) => {
    if (onSelectCompany) {
      onSelectCompany(id);
    } else {
      setSelectedCompanyId(id);
    }
  };

  useEffect(() => {
    const loadFeedData = async () => {
      try {
        const apiProjects = await apiService.getChallenges();

        const projectsWithSkills = apiProjects.map((proj: any) => ({
          id: proj.id,
          companyId: proj.companyId,
          company: proj.author,
          logoUrl: proj.avatar,
          time: new Date(proj.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          title: proj.name,
          description: proj.description,
          content: `${proj.name} - ${proj.description}`,
          budget: proj.budget || '',
          tags: proj.skills || [],
          highlight: true,
          isDbProject: true
        }));

        setDbProjects(projectsWithSkills);
        setAppliedProjectIds(apiProjects.filter((p: any) => p.appStatus).map((p: any) => p.id));
      } catch (err: any) {
        console.error("Error loading feed data:", err.message || err);
      }
    };

    loadFeedData();
  }, [userId]);

  const handleApply = async (projectId: string, _companyName: string) => {
    if (!userId) {
      alert("Please log in to apply");
      return;
    }

    try {
      const res = await apiService.joinChallenge(projectId);
      if (!res) {
        alert("Failed to apply to project.");
        return;
      }
      
      setShowSuccessTick(true);
      setAppliedProjectIds(prev => [...prev, projectId]);
      
      // Concurrently fetch updated skill scores and user profile details from backend updates
      const [scoresRes, userRes] = await Promise.all([
        supabase.from('skill_scores').select('*').eq('user_id', userId),
        supabase.from('users').select('profile_details').eq('id', userId).maybeSingle()
      ]);

      if (scoresRes.data && setSkillScores) {
        setSkillScores(scoresRes.data);
      }
      if (userRes.data?.profile_details?.xp !== undefined && setXp) {
        setXp(Number(userRes.data.profile_details.xp));
      }
    } catch (err: any) {
      alert(`An error occurred: ${err.message}`);
    }
  };

  const feedPosts: any[] = [];

  const allPosts = [...dbProjects, ...feedPosts];

  const trendingTags = (() => {
    const counts: Record<string, number> = {};
    dbProjects.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((tag: string) => {
          // Normalize formatting (e.g. capitalize nicely)
          const formatted = tag.trim().split(/[-_ ]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
          if (formatted) {
            counts[formatted] = (counts[formatted] || 0) + 1;
          }
        });
      }
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const defaults = ['FastAPI', 'React', 'TypeScript', 'NodeJS', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Go', 'Rust', 'Kubernetes', 'GraphQL'];
    const unique = new Set(sorted);
    for (const d of defaults) {
      if (unique.size >= 12) break;
      const lowerD = d.toLowerCase();
      const exists = Array.from(unique).some(u => u.toLowerCase() === lowerD);
      if (!exists) {
        unique.add(d);
      }
    }
    return Array.from(unique).slice(0, 12);
  })();

  const matchedPosts = allPosts.filter(post => {
    if (showAllOpportunities) return true;
    if (!developerSkills || developerSkills.length === 0) return true;

    const normalizedDevSkills = developerSkills.map(s => s.toLowerCase());
    return post.tags.some((tag: any) => normalizedDevSkills.includes(tag.toLowerCase()));
  });

  return (
    <div className="relative min-h-full flex flex-col lg:flex-row bg-[#0e1015]">
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* Main Feed (60%) */}
      <div className="w-full lg:w-[60%] border-r border-white/5 p-6 md:p-10 relative z-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">Company Feed</h1>
          <div className="flex bg-[#111318] border border-white/5 p-1 rounded-xl relative">
            <button
              onClick={() => setShowAllOpportunities(false)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 cursor-pointer border-none ${
                !showAllOpportunities
                  ? 'bg-gradient-to-r from-[#00b5ec] to-[#00d2ff] text-white shadow-md'
                  : 'text-white/40 hover:text-white/80 bg-transparent'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setShowAllOpportunities(true)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 cursor-pointer border-none ${
                showAllOpportunities
                  ? 'bg-gradient-to-r from-[#00b5ec] to-[#00d2ff] text-white shadow-md'
                  : 'text-white/40 hover:text-white/80 bg-transparent'
              }`}
            >
              All Opportunities
            </button>
          </div>
        </div>
        
        {matchedPosts.length === 0 ? (
          <div className="border border-dashed border-white/5 rounded-2xl p-10 text-center text-white/40 bg-[#121520]/25">
            <p className="text-sm font-mono mb-2">No matching opportunities found</p>
            <p className="text-xs">Adjust your skills list or switch to "All Opportunities" to browse all requirements.</p>
          </div>
        ) : (
          matchedPosts.map((post, idx) => {
            const hasApplied = post.id && appliedProjectIds.includes(post.id);
            const title = post.title || (post.content && post.content.split(' - ')[0]) || '';
            const description = post.description || (post.content && post.content.split(' - ').slice(1).join(' - ')) || post.content || '';
            
            return (
              <div key={idx} className="bg-[#121520]/60 border border-white/5 hover:border-[#00d2ff]/30 rounded-2xl p-6 mb-6 text-left transition-all duration-300 shadow-xl relative overflow-hidden group">
                {/* Accent glow top line on card hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between gap-4 mb-5">
                  <div 
                    onClick={() => post.companyId && handleSelectCompany(post.companyId)}
                    className={`flex items-center gap-3.5 ${post.companyId ? 'cursor-pointer hover:opacity-85 transition-opacity group/author' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00d2ff]/10 to-[#0B2551]/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden shadow group-hover/author:border-[#00d2ff]/40 transition-colors">
                      {post.logoUrl ? (
                        <img src={post.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span>{post.company.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold text-white leading-tight ${post.companyId ? 'group-hover/author:text-[#00d2ff] group-hover/author:underline' : ''}`}>{post.company}</h3>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">{post.time}</p>
                    </div>
                  </div>
                  
                  {post.budget && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded font-mono shrink-0">
                      {post.budget}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mb-4">
                  <h4 className="text-base font-bold text-white leading-snug tracking-tight font-sans">{title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-sans font-medium">{description}</p>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                    {post.tags.map((tag: any) => {
                      const isDeveloperSkill = developerSkills.map(s => s.toLowerCase()).includes(tag.toLowerCase());
                      return (
                        <span 
                          key={tag} 
                          className={`px-2 py-0.5 text-[9px] font-bold font-mono border rounded ${
                            isDeveloperSkill 
                              ? 'text-[#00d2ff] bg-[#00d2ff]/5 border-[#00d2ff]/20' 
                              : 'text-white/40 bg-white/2 border-white/5'
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-3 border-t border-white/5 pt-4.5">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 hover:text-yellow-400 hover:bg-yellow-500/5 border border-transparent hover:border-yellow-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95 bg-transparent">
                    <Star className="w-3.5 h-3.5 text-white/40 hover:text-yellow-400 transition-colors" /><span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-white/40 hover:text-[#00d2ff] hover:bg-[#00d2ff]/5 border border-transparent hover:border-[#00d2ff]/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95 bg-transparent">
                    <Archive className="w-3.5 h-3.5 text-white/40 hover:text-[#00d2ff] transition-colors" /><span>Save</span>
                  </button>
                  <div className="flex-1" />
                  {post.isDbProject ? (
                    <button 
                      onClick={() => handleApply(post.id, post.company)}
                      disabled={hasApplied}
                      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer border-none ${
                        hasApplied 
                          ? 'bg-[#1b1e28] text-white/20 border border-white/5 cursor-not-allowed' 
                          : 'bg-white hover:bg-white/90 text-black shadow-md'
                      }`}
                    >
                      <span>{hasApplied ? 'Applied' : 'Apply Now'}</span>
                    </button>
                  ) : (
                    <button className="flex items-center gap-1.5 text-xs font-bold text-black bg-white hover:bg-white/90 px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer border-none shadow-md">
                      <span>Apply Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trending Tags Sidebar (40%) */}
      <div className="w-full lg:w-[40%] p-6 md:p-10 relative z-10 bg-[#07090e]/95 border-l border-white/5 text-left flex flex-col gap-8">
        
        {/* Trending Tags Card */}
        <div className="bg-[#121520]/45 border border-white/5 rounded-2xl p-6 shadow-md">
          <h2 className="text-[10px] font-bold mb-5 text-white/40 uppercase tracking-widest flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Trending Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <button key={tag} className="px-2.5 py-1 text-xs font-mono border border-white/5 bg-[#07090e]/60 text-white/50 hover:text-[#00d2ff] hover:border-[#00d2ff]/30 hover:bg-[#00d2ff]/5 rounded transition-all cursor-pointer">
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Top Companies Card */}
        <div className="bg-[#121520]/45 border border-white/5 rounded-2xl p-6 shadow-md">
          <h2 className="text-[10px] font-bold mb-4 text-white/40 uppercase tracking-widest flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Registered Organizations
          </h2>
          <div className="space-y-2">
            {dbProjects.filter((p, i, self) => p.companyId && self.findIndex(t => t.companyId === p.companyId) === i).map(p => (
              <div 
                key={p.companyId} 
                onClick={() => handleSelectCompany(p.companyId)}
                className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00d2ff]/10 to-[#0B2551]/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden shadow group-hover:border-[#00d2ff]/30 transition-colors">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{p.company.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-white/70 group-hover:text-[#00d2ff] group-hover:underline transition-colors">{p.company}</span>
              </div>
            ))}
            {dbProjects.filter(p => p.companyId).length === 0 && (
              <div className="text-xs text-white/40 italic p-2">No registered organizations</div>
            )}
          </div>
        </div>

      </div>
      {selectedCompanyId && (
        <CompanyProfileModal 
          companyId={selectedCompanyId} 
          onClose={() => setSelectedCompanyId(null)} 
          onStartChat={(partnerId) => {
            onStartChat?.(partnerId);
            setSelectedCompanyId(null);
          }}
        />
      )}
      {showSuccessTick && (
        <SuccessTickOverlay onClose={() => setShowSuccessTick(false)} />
      )}
    </div>
  );
}

function CompanyProfileModal({ companyId, onClose, onStartChat }: { companyId: string; onClose: () => void; onStartChat?: (partnerId: string) => void }) {
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyPosts, setCompanyPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    if (!companyId) return;
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const { data: comp, error: _compErr } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (comp) {
          setCompany(comp);
          const { data: projs } = await supabase
            .from('projects')
            .select('*')
            .eq('company_id', companyId);

          if (projs) {
            const { data: skillsData } = await supabase
              .from('required_skills')
              .select('project_id, skill_name');

            const projsWithSkills = projs.map(p => ({
              ...p,
              tags: skillsData?.filter(s => s.project_id === p.id).map(s => s.skill_name) || []
            }));
            setProjects(projsWithSkills);
          }

          // Fetch company posts from creator's user record
          const defaultMockPosts = [
            {
              id: 'mock-1',
              imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
              caption: `Building the future of developer verification at ${comp.name || 'our organization'}! 🚀`,
              likes: 42,
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              likedByUser: false
            },
            {
              id: 'mock-2',
              imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
              caption: "Our main engineering team hard at work on the scaling roadmap. 🛠️",
              likes: 88,
              createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
              likedByUser: false
            },
            {
              id: 'mock-3',
              imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
              caption: "Hackathon week! Ideas turned into working commits. 💡💻",
              likes: 67,
              createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
              likedByUser: false
            }
          ];

          if (comp.created_by) {
            const { data: userData } = await supabase
              .from('users')
              .select('profile_details')
              .eq('id', comp.created_by)
              .maybeSingle();
            if (userData && userData.profile_details && Array.isArray(userData.profile_details.company_posts) && userData.profile_details.company_posts.length > 0) {
              setCompanyPosts(userData.profile_details.company_posts);
            } else {
              setCompanyPosts(defaultMockPosts);
            }
          } else {
            setCompanyPosts(defaultMockPosts);
          }
        }
      } catch (err) {
        console.error("Error loading company profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyId]);

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPosts = companyPosts.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      });

      if (selectedPost && selectedPost.id === postId) {
        const liked = !selectedPost.likedByUser;
        setSelectedPost({
          ...selectedPost,
          likedByUser: liked,
          likes: liked ? selectedPost.likes + 1 : Math.max(0, selectedPost.likes - 1)
        });
      }

      if (company?.created_by) {
        const { data: currentData } = await supabase
          .from('users')
          .select('profile_details')
          .eq('id', company.created_by)
          .maybeSingle();

        const details = currentData?.profile_details || {};
        const mergedDetails = {
          ...details,
          company_posts: updatedPosts
        };

        await supabase
          .from('users')
          .update({ profile_details: mergedDetails })
          .eq('id', company.created_by);

        setCompanyPosts(updatedPosts);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-2xl border border-white/10 rounded-3xl bg-[#07090e]/95 text-left relative flex flex-col max-h-[85vh] overflow-hidden shadow-[0_0_50px_rgba(0,210,255,0.08)]">
        {/* Top gradient accent line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00b5ec] via-[#0B2551] to-[#00d2ff] shrink-0" />

        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300 cursor-pointer bg-transparent border-none flex items-center justify-center z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center p-20 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-[#00d2ff]" />
          </div>
        ) : !company ? (
          <div className="p-10 text-center text-white/50 font-mono flex-1 flex items-center justify-center">Company details not found</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 custom-scrollbar">
            <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap w-full">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00d2ff]/10 to-[#0B2551]/20 border border-white/15 flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden shadow-lg group hover:border-[#00d2ff]/50 transition-colors duration-300">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span>{company.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{company.name}</h2>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00d2ff] hover:underline font-mono mt-1 flex items-center gap-1.5 font-semibold">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>

              {company.created_by && onStartChat && (
                <button
                  onClick={() => onStartChat(company.created_by)}
                  className="text-xs font-bold px-4 py-2.5 bg-[#00d2ff] text-black hover:bg-[#00d2ff]/90 active:scale-[0.97] rounded-xl transition-all flex items-center gap-2 cursor-pointer border-none shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with Recruiter</span>
                </button>
              )}
            </div>

            <div className="border-t border-white/5 pt-5 text-left">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2.5">About Organization</h3>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line font-medium font-sans">
                {company.description || 'No description provided by the organization.'}
              </p>
            </div>

            <div className="border-t border-white/5 pt-5 text-left">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Active Opportunities</h3>
              {projects.length === 0 ? (
                <div className="border border-dashed border-white/5 bg-[#121520]/25 rounded-2xl p-6 text-center text-white/30">
                  <p className="text-xs font-mono">No active requirements posted at this time.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {projects.map(p => (
                    <div key={p.id} className="bg-[#121520]/60 border border-white/5 hover:border-[#00d2ff]/30 rounded-2xl p-5 text-left transition-all duration-300 shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#00d2ff] transition-colors">{p.title}</h4>
                        {p.budget && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded font-mono shrink-0">
                            {p.budget}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 mt-2 leading-relaxed font-medium font-sans">{p.description}</p>
                      {p.tags?.length > 0 && (
                        <div className="flex gap-1.5 mt-3.5 flex-wrap">
                          {p.tags.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 text-[9px] font-bold font-mono bg-[#07090e] border border-white/5 text-white/50 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-5 text-left">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Company Posts</h3>
              {companyPosts.length === 0 ? (
                <div className="border border-dashed border-white/5 bg-[#121520]/25 rounded-2xl p-6 text-center text-white/30">
                  <p className="text-xs font-mono">No posts published by this organization yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {companyPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-[#00d2ff]/30 cursor-pointer bg-[#0d1117] shadow-lg transition-all duration-300"
                    >
                      <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-3 text-center select-none">
                        <div className="flex items-center gap-1.5 text-white font-mono text-[11px] font-bold mb-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          {post.likes}
                        </div>
                        {post.caption && (
                          <p className="text-white/80 text-[9px] line-clamp-3 leading-snug px-1 font-medium font-sans">{post.caption}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Zoom Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="bg-[#0e1015] border border-[#333] w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] max-h-[85vh]">
            <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              <img src={selectedPost.imageUrl} alt={selectedPost.caption} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="md:w-2/5 flex flex-col border-l border-[#333] bg-[#0e1015]">
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#07090e]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#333] bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {company?.name ? company.name[0].toUpperCase() : 'C'}
                  </div>
                  <span className="text-xs font-semibold text-white">{company?.name || 'Company Profile'}</span>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto text-left space-y-4">
                {selectedPost.caption ? (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full border border-[#333] bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                      {company?.name ? company.name[0].toUpperCase() : 'C'}
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="text-white/90 leading-relaxed">
                        <strong className="text-white mr-1.5">{company?.name || 'Company'}</strong>
                        {selectedPost.caption}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/30 italic">No caption provided.</p>
                )}
              </div>

              <div className="p-4 border-t border-[#333] bg-[#07090e] space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`transition-all hover:scale-110 cursor-pointer border-none bg-transparent ${
                      selectedPost.likedByUser ? 'text-red-500' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={selectedPost.likedByUser ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <span className="text-xs text-white/50">
                    Shared on <span className="font-mono">{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-white font-mono">
                  {selectedPost.likes} {selectedPost.likes === 1 ? 'like' : 'likes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeveloperProfileModal({ 
  developer, 
  recruiterUserId, 
  onClose, 
  onUpdateDeveloper,
  onStartChat
}: { 
  developer: any; 
  recruiterUserId?: string; 
  onClose: () => void; 
  onUpdateDeveloper?: (updatedDev: any) => void;
  onStartChat?: (partnerId: string) => void;
}) {
  const [recruiterProjects, setRecruiterProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [xpActionMessage, setXpActionMessage] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentXp, setCurrentXp] = useState<number>(Number(developer.profile_details?.xp !== undefined ? developer.profile_details.xp : (developer.xp || 23094)));

  useEffect(() => {
    if (!recruiterUserId) return;
    const fetchRecruiterCompanyProjects = async () => {
      try {
        const { data: comp } = await supabase
          .from('companies')
          .select('id')
          .eq('created_by', recruiterUserId)
          .maybeSingle();

        if (comp) {
          const { data: projs } = await supabase
            .from('projects')
            .select('id, title')
            .eq('company_id', comp.id);
          if (projs) {
            setRecruiterProjects(projs);
            if (projs.length > 0) {
              setSelectedProjectId(projs[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Error loading recruiter projects:", err);
      }
    };
    fetchRecruiterCompanyProjects();
  }, [recruiterUserId]);

  useEffect(() => {
    setCurrentXp(Number(developer.profile_details?.xp !== undefined ? developer.profile_details.xp : (developer.xp || 23094)));
    setXpActionMessage('');
  }, [developer.id, developer.profile_details?.xp, developer.xp]);

  const commits = (() => {
    const grid = [];
    for (let col = 0; col < 26; col++) {
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
  })();

  const getColor = (intensity: number) => {
    switch(intensity) {
      case 4: return 'bg-[#39d353] border-[#39d353]';
      case 3: return 'bg-[#26a641] border-[#26a641]';
      case 2: return 'bg-[#006d32] border-[#006d32]';
      case 1: return 'bg-[#0e4429] border-[#0e4429]';
      default: return 'bg-[#161b22] border-[#333]';
    }
  };

  const handleSelectCandidate = async () => {
    setActionLoading(true);
    setXpActionMessage('');
    try {
      const nextXp = currentXp + 100;
      setCurrentXp(nextXp);

      if (developer.isDbDeveloper) {
        const { data: userData } = await supabase
          .from('users')
          .select('profile_details')
          .eq('id', developer.id)
          .single();

        const updatedDetails = {
          ...(userData?.profile_details || {}),
          xp: nextXp
        };

        const { error: userUpdateErr } = await supabase
          .from('users')
          .update({ profile_details: updatedDetails })
          .eq('id', developer.id);

        if (userUpdateErr) throw userUpdateErr;

        if (selectedProjectId) {
          await supabase
            .from('applications')
            .upsert({
              project_id: selectedProjectId,
              developer_id: developer.id,
              status: 'hired'
            }, { onConflict: 'project_id,developer_id' });
        }

        if (onUpdateDeveloper) {
          onUpdateDeveloper({
            ...developer,
            profile_details: updatedDetails
          });
        }
      } else {
        if (onUpdateDeveloper) {
          onUpdateDeveloper({
            ...developer,
            xp: nextXp
          });
        }
      }

      setXpActionMessage(`Successfully selected candidate! Added 100 XP (New Balance: ★${nextXp.toLocaleString()})`);
    } catch (err: any) {
      console.error(err);
      setXpActionMessage(`Failed to select: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeductXp = async () => {
    setActionLoading(true);
    setXpActionMessage('');
    try {
      const nextXp = Math.max(0, currentXp - 5);
      setCurrentXp(nextXp);

      if (developer.isDbDeveloper) {
        const { data: userData } = await supabase
          .from('users')
          .select('profile_details')
          .eq('id', developer.id)
          .single();

        const updatedDetails = {
          ...(userData?.profile_details || {}),
          xp: nextXp
        };

        const { error: userUpdateErr } = await supabase
          .from('users')
          .update({ profile_details: updatedDetails })
          .eq('id', developer.id);

        if (userUpdateErr) throw userUpdateErr;

        if (onUpdateDeveloper) {
          onUpdateDeveloper({
            ...developer,
            profile_details: updatedDetails
          });
        }
      } else {
        if (onUpdateDeveloper) {
          onUpdateDeveloper({
            ...developer,
            xp: nextXp
          });
        }
      }

      setXpActionMessage(`Deducted 5 XP. Current Balance: ★${nextXp.toLocaleString()}`);
    } catch (err: any) {
      console.error(err);
      setXpActionMessage(`Failed to deduct: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const name = developer.first_name && developer.last_name 
    ? `${developer.first_name} ${developer.last_name}` 
    : developer.name || 'Upzeal Developer';

  const username = developer.username || 'developer';
  const email = developer.email || 'No email shared';
  const bio = developer.profile_details?.bio || developer.bio || 'No profile biography shared yet.';
  const location = developer.profile_details?.location || developer.location || 'Remote-First';
  const avatarUrl = developer.profile_details?.avatar_url || developer.avatar_url || '';
  const skills = developer.dashboard_config?.tech_stack || developer.skills || [];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl border border-white/10 rounded-2xl bg-[#0c0c0c]/95 p-6 md:p-8 text-left relative flex flex-col max-h-[85vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap w-full">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-[#333] overflow-hidden bg-[#151820] flex items-center justify-center shrink-0 font-semibold">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-xl text-white">
                    {developer.first_name && developer.last_name 
                      ? `${developer.first_name[0]}${developer.last_name[0]}`.toUpperCase() 
                      : developer.email?.[0]?.toUpperCase() || 'D'}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold text-white tracking-tight truncate">{name}</h2>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-xs text-white/50 font-mono">@{username}</span>
                  <span className="text-xs font-mono font-bold text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-0.5 rounded border border-[#00d2ff]/20">★ {currentXp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {onStartChat && (
              <button
                onClick={() => onStartChat(developer.id)}
                className="text-xs font-bold px-4 py-2.5 bg-[#00d2ff] text-black hover:bg-[#00d2ff]/90 active:scale-[0.97] rounded-xl transition-all flex items-center gap-2 cursor-pointer border-none shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Developer</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Contact Email</span>
              <span className="text-sm font-mono text-[#00d2ff] select-all">{email}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Location</span>
              <span className="text-sm text-white/80 font-mono">{location}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block mb-2">Tech Stack & Skills</span>
            {skills.length === 0 ? (
              <p className="text-xs text-white/40 font-mono">No skills set.</p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {skills.map((s: string) => (
                  <span key={s} className="px-2.5 py-1 text-xs font-mono bg-black border border-[#333] text-white/70 rounded-md">{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block mb-2">Biography</span>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{bio}</p>
          </div>

          {recruiterUserId && (
            <div className="border border-white/10 rounded-xl bg-[#151820]/40 p-4 space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Recruiter Action Center</h3>
                <p className="text-[10px] text-white/50 mt-0.5 font-mono">Manage project selection and quality score adjustments</p>
              </div>

              {xpActionMessage && (
                <div className="px-3 py-2 text-xs font-mono bg-black border border-[#333] text-[#00d2ff] rounded-lg">
                  {xpActionMessage}
                </div>
              )}

              <div className="flex gap-2 w-full">
                <select 
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="flex-1 bg-black border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#00d2ff]"
                >
                  {recruiterProjects.length === 0 ? (
                    <option value="">General Project Assign</option>
                  ) : (
                    recruiterProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))
                  )}
                </select>
                <button 
                  disabled={actionLoading}
                  onClick={handleSelectCandidate}
                  className="px-3.5 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#10b981]/90 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                >
                  Select for Project (+100 XP)
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-4">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block mb-3">Activity Graph (Commits)</span>
            <div className="flex gap-[3px] overflow-x-auto pb-2">
              {commits.map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-[3px]">
                  {col.map((intensity, rIdx) => (
                    <div 
                      key={rIdx} 
                      className={`w-[9px] h-[9px] rounded-sm border ${getColor(intensity)}`} 
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[9px] text-white/30 font-mono mt-1">
              <span>Less</span>
              <div className="w-[8px] h-[8px] rounded bg-[#161b22] border border-[#333]" />
              <div className="w-[8px] h-[8px] rounded bg-[#0e4429] border border-[#0e4429]" />
              <div className="w-[8px] h-[8px] rounded bg-[#006d32] border border-[#006d32]" />
              <div className="w-[8px] h-[8px] rounded bg-[#26a641] border border-[#26a641]" />
              <div className="w-[8px] h-[8px] rounded bg-[#39d353] border border-[#39d353]" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentChatView({ 
  userId, 
  firstName: _firstName, 
  lastName: _lastName, 
  email: _email,
  onSelectCompany,
  onSelectDeveloper,
  initialPartnerId,
  onClearInitialPartner
}: { 
  userId: string; 
  firstName: string; 
  lastName: string; 
  email: string;
  onSelectCompany?: (id: string) => void;
  onSelectDeveloper?: (dev: any) => void;
  initialPartnerId?: string | null;
  onClearInitialPartner?: () => void;
}) {
  const [conversations, setConversations] = useState([
    { id: '1', name: 'Upzeal AI Assistant', lastMessage: 'Ask me anything about your projects!', unread: 0, avatar: '⚡' }
  ]);

  const [activeConvId, setActiveConvId] = useState('1');
  const [mobileShowMessages, setMobileShowMessages] = useState(false);
  
  const [messages, setMessages] = useState<Record<string, Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>>>({
    '1': [
      { id: '1-1', sender: 'them', text: 'Hi! I am your Upzeal AI workspace assistant. I can help you guide your project learning, review stack structures, or outline skills to score!', time: '10:02 AM' }
    ]
  });

  const [inputText, setInputText] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'error' | 'success'>('idle');
  const [searchMessage, setSearchMessage] = useState('');

  useEffect(() => {
    if (!initialPartnerId) return;

    const initDirectChat = async () => {
      const existing = conversations.find(c => c.id === initialPartnerId);
      if (existing) {
        setActiveConvId(initialPartnerId);
        setMobileShowMessages(true);
        onClearInitialPartner?.();
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, role, username')
          .eq('id', initialPartnerId)
          .maybeSingle();

        if (error || !data) {
          onClearInitialPartner?.();
          return;
        }

        let displayName = data.first_name && data.last_name 
          ? `${data.first_name} ${data.last_name}` 
          : data.username || data.email;

        if (data.role === 'recruiter') {
          const { data: comp } = await supabase
            .from('companies')
            .select('name')
            .eq('created_by', data.id)
            .maybeSingle();

          if (comp?.name) {
            displayName = `${displayName} (${comp.name})`;
          }
        }

        const newChan = {
          id: data.id,
          name: displayName,
          lastMessage: 'No messages yet',
          unread: 0,
          avatar: '👤'
        };

        setConversations(prev => {
          if (prev.find(c => c.id === data.id)) return prev;
          return [newChan, ...prev];
        });
        setActiveConvId(data.id);
        setMobileShowMessages(true);
      } catch (e) {
        console.error("Error setting up direct chat partner:", e);
      } finally {
        onClearInitialPartner?.();
      }
    };

    initDirectChat();
  }, [initialPartnerId, conversations, onClearInitialPartner]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeMessages = messages[activeConvId] || [];

  const handleHeaderClick = async () => {
    if (activeConvId === '1') return;

    if (activeConvId === '2') {
      try {
        const { data: comp } = await supabase.from('companies').select('id').ilike('name', '%Microsoft%').maybeSingle();
        if (comp) {
          onSelectCompany?.(comp.id);
        } else {
          const { data: allComps } = await supabase.from('companies').select('id').limit(1);
          if (allComps && allComps.length > 0) {
            onSelectCompany?.(allComps[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (activeConvId === '3') {
      try {
        const { data: dev } = await supabase.from('users').select('*').eq('role', 'developer').limit(1).maybeSingle();
        if (dev) {
          onSelectDeveloper?.(dev);
        }
      } catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      const { data: peerUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', activeConvId)
        .maybeSingle();

      if (peerUser) {
        if (peerUser.role === 'developer') {
          onSelectDeveloper?.(peerUser);
        } else if (peerUser.role === 'recruiter') {
          const { data: comp } = await supabase
            .from('companies')
            .select('id')
            .eq('created_by', peerUser.id)
            .maybeSingle();

          if (comp) {
            onSelectCompany?.(comp.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch peer profile:", err);
    }
  };

  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

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
          { id: '1-1', sender: 'them', text: 'Hi! I am your Upzeal AI workspace assistant. I can help you guide your project learning, review stack structures, or outline skills to score!', time: '10:02 AM' }
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
          .select('id, email, first_name, last_name, role, username')
          .in('id', Array.from(otherUserIds));

        if (profileErr) {
          console.error("Error fetching profiles:", profileErr.message);
          return;
        }

        // Fetch company names for any recruiter in the profiles list
        const recruiterIds = userProfiles.filter((u: any) => u.role === 'recruiter').map((u: any) => u.id);
        const companiesMap: Record<string, string> = {};
        if (recruiterIds.length > 0) {
          const { data: comps } = await supabase
            .from('companies')
            .select('name, created_by')
            .in('created_by', recruiterIds);
          if (comps) {
            comps.forEach((c: any) => {
              if (c.created_by) {
                companiesMap[c.created_by] = c.name;
              }
            });
          }
        }

        const newConversations = userProfiles.map((p: any) => {
          // Get the last message text for this user
          const chatMsgs = grouped[p.id] || [];
          const lastMsgText = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1].text : 'Start chatting';
          
          let displayName = p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : p.username || p.email;
          if (p.role === 'recruiter' && companiesMap[p.id]) {
            displayName = `${displayName} (${companiesMap[p.id]})`;
          }

          return {
            id: p.id,
            name: displayName,
            lastMessage: lastMsgText,
            unread: 0,
            avatar: '👤'
          };
        });

        // Merge keeping dynamically active channels preserved
        setConversations(prev => {
          const merged = [...prev];
          newConversations.forEach(nc => {
            const idx = merged.findIndex(mc => mc.id === nc.id);
            if (idx === -1) {
              merged.push(nc);
            } else {
              merged[idx] = {
                ...merged[idx],
                name: nc.name,
                lastMessage: nc.lastMessage
              };
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
        setMobileShowMessages(true);
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
      setMobileShowMessages(true);
      
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
    <div className="flex h-full bg-[#0e1015] w-full overflow-hidden relative">
      {/* Channels List */}
      <div className={`w-full md:w-80 border-r border-white/5 bg-[#0a0c10]/40 flex-col shrink-0 ${mobileShowMessages ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/5 flex flex-col gap-4 bg-[#0a0c10]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-white/95">Messages</h2>
            <span className="text-[10px] bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-mono font-bold px-2 py-0.5 rounded-full">
              Live Chat
            </span>
          </div>
          <form onSubmit={handleSearchUser} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search username to chat..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="w-full bg-[#12151f] border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs text-white placeholder:text-white/30 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:outline-none transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-3 text-white/40 hover:text-[#00d2ff] transition-colors cursor-pointer border-none bg-transparent"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
          {searchStatus === 'searching' && (
            <p className="text-[10px] text-white/40 font-mono">Searching...</p>
          )}
          {searchStatus === 'error' && (
            <p className="text-[10px] text-red-400 font-mono">{searchMessage}</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {conversations.map((c) => {
            const isActive = c.id === activeConvId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  setConversations(prev => prev.map(conv => conv.id === c.id ? { ...conv, unread: 0 } : conv));
                  setMobileShowMessages(true);
                }}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 text-left cursor-pointer border ${
                  isActive 
                    ? 'bg-gradient-to-r from-white/[0.07] to-transparent border-white/10 shadow-lg backdrop-blur-md' 
                    : 'border-transparent hover:bg-white/[0.02] text-white/70 hover:text-white'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 transition-all border ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-500/20 to-cyan-500/5 border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.15)] scale-105'
                    : 'bg-white/5 border-white/10'
                }`}>
                  {c.avatar}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-semibold text-sm truncate transition-colors ${isActive ? 'text-[#00d2ff]' : 'text-white/90'}`}>{c.name}</span>
                    {c.unread > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]" />
                    )}
                  </div>
                  <p className={`text-xs truncate leading-normal transition-colors ${isActive ? 'text-white/65' : 'text-white/40'}`}>{c.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Messaging pane */}
      <div className={`flex-1 flex flex-col bg-[#0e1015] justify-between relative h-full min-w-0 overflow-hidden ${mobileShowMessages ? 'flex' : 'hidden md:flex'}`}>
        {/* Chat Header */}
        <div className="h-[73px] border-b border-white/5 bg-[#0a0c10] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            {/* Back button on mobile */}
            <button 
              onClick={() => setMobileShowMessages(false)}
              className="md:hidden mr-3 p-1 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div 
              onClick={handleHeaderClick}
              className={`flex items-center gap-3 ${activeConv.id !== '1' ? 'cursor-pointer hover:opacity-85 transition-opacity group' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center text-lg shrink-0">
                {activeConv.avatar}
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold text-white/95 leading-tight ${activeConv.id !== '1' ? 'group-hover:text-[#00d2ff] group-hover:underline' : ''}`}>{activeConv.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                  <span className="text-[9px] text-emerald-400 font-bold font-mono tracking-wider uppercase">online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message bubbles list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 pb-28 text-left">
          {activeMessages.map((m) => {
            const isMe = m.sender === 'me';
            return (
              <div 
                key={m.id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div className={`max-w-[70%] rounded-2xl px-4.5 py-3.5 text-sm leading-relaxed border transition-all duration-300 shadow-md ${
                  isMe 
                    ? 'bg-gradient-to-r from-[#00b5ec] to-[#00d2ff] text-white border-transparent shadow-[0_4px_12px_rgba(0,210,255,0.15)] rounded-br-none font-medium' 
                    : 'bg-[#12151f]/80 backdrop-blur-md text-white/90 border-white/5 rounded-bl-none shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className={`text-[11px] mt-2 block text-right font-mono tracking-tight font-semibold ${
                    isMe ? 'text-white/80' : 'text-white/50'
                  }`}>{m.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        {/* Message Input box */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/95 to-transparent shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-3 p-1.5 bg-[#0a0c10]/90 border border-white/10 backdrop-blur-md rounded-2xl relative shadow-2xl focus-within:border-cyan-500/40 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv.name}...`}
              className="flex-1 bg-transparent border-none py-2.5 px-4 text-white placeholder:text-white/20 focus:ring-0 focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#00b5ec] to-[#00d2ff] hover:shadow-[0_0_12px_rgba(0,210,255,0.35)] text-white flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-95 border-none"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PostJobView({ userId }: { userId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatus('error');
      setErrorMessage('Title and Description are required');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      let { data: company, error: compError } = await supabase
        .from('companies')
        .select('id')
        .eq('created_by', userId)
        .maybeSingle();

      if (compError) {
        setStatus('error');
        setErrorMessage('Failed to resolve company profile: ' + compError.message);
        return;
      }

      let companyId;
      if (!company) {
        const { data: newComp, error: newCompErr } = await supabase
          .from('companies')
          .insert({
            name: 'Upzeal Client Partner',
            description: 'Recruiter organization profile',
            created_by: userId
          })
          .select('id')
          .single();

        if (newCompErr) {
          setStatus('error');
          setErrorMessage('Failed to create company organization: ' + newCompErr.message);
          return;
        }
        companyId = newComp.id;
      } else {
        companyId = company.id;
      }

      const { data: project, error: projErr } = await supabase
        .from('projects')
        .insert({
          company_id: companyId,
          title: title.trim(),
          description: description.trim(),
          budget: budget.trim(),
          status: 'open',
          created_by: userId
        })
        .select('id')
        .single();

      if (projErr) {
        setStatus('error');
        setErrorMessage('Failed to post project: ' + projErr.message);
        return;
      }

      const tagsArray = skills
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);

      if (tagsArray.length > 0) {
        const skillsRows = tagsArray.map(tag => ({
          project_id: project.id,
          skill_name: tag,
          min_score: 50
        }));

        const { error: skillErr } = await supabase
          .from('required_skills')
          .insert(skillsRows);

        if (skillErr) {
          console.error("Error inserting skills:", skillErr.message);
        }
      }

      setStatus('success');
      setTitle('');
      setDescription('');
      setBudget('');
      setSkills('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-2xl text-left bg-[#0e111a]/85 border border-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden w-full">
      {/* Decorative top laser line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />
      
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00d2ff]/20 to-[#00d2ff]/5 border border-[#00d2ff]/30 flex items-center justify-center text-xl shrink-0">
          💼
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white/95">Post Requirement</h2>
          <p className="text-xs text-white/40 mt-1 font-mono">Matched automatically to developers with matching skill sets.</p>
        </div>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs mb-6 font-mono flex items-start gap-2.5">
          <span className="text-base select-none mt-0.5">✓</span>
          <div>
            <p className="font-semibold text-emerald-300">Success!</p>
            <p className="mt-0.5 text-white/70">Requirement posted successfully! Developers with matching skills will now see this opportunity in their feeds.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs mb-6 font-mono flex items-start gap-2.5">
          <span className="text-base select-none mt-0.5">⚠</span>
          <div>
            <p className="font-semibold text-rose-300">Error</p>
            <p className="mt-0.5 text-white/70">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/60 tracking-wider uppercase">Opportunity Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer (FastAPI)"
            className="w-full bg-[#12151f] border border-white/10 rounded-xl h-12 px-4 text-white text-sm placeholder:text-white/20 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/60 tracking-wider uppercase">Requirement Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline role responsibilities, deliverables, and team context..."
            rows={5}
            className="w-full bg-[#12151f] border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:outline-none transition-all duration-300 resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/60 tracking-wider uppercase">Estimated Budget / Salary</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $120k - $140k"
              className="w-full bg-[#12151f] border border-white/10 rounded-xl h-12 px-4 text-white text-sm placeholder:text-white/20 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/60 tracking-wider uppercase">Required Tech Skills (comma-separated)</label>
            <input
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. fastapi, react, python"
              className="w-full bg-[#12151f] border border-white/10 rounded-xl h-12 px-4 text-white text-sm placeholder:text-white/20 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full h-12 bg-gradient-to-r from-[#00b5ec] to-[#00d2ff] hover:shadow-[0_0_15px_rgba(0,210,255,0.35)] text-white font-bold rounded-xl active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-6 border-none"
        >
          {status === 'submitting' ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <>
              Publish Requirement
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function CompanyProfileView({ userId }: { userId: string }) {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Company Posts states
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editCaptionText, setEditCaptionText] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Post creation states
  const [postImage, setPostImage] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Image Cropping states
  const [originalImage, setOriginalImage] = useState('');
  const [cropScale, setCropScale] = useState(1.0);
  const [cropRotation, setCropRotation] = useState(0);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!userId) return;
    const fetchCompanyAndPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, logo_url, website, description')
          .eq('created_by', userId)
          .maybeSingle();

        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
          return;
        }

        if (data) {
          setCompanyId(data.id);
          setName(data.name || '');
          setLogoUrl(data.logo_url || '');
          setWebsite(data.website || '');
          setDescription(data.description || '');
        }

        // Fetch company posts from recruiter's profile_details
        const { data: userData } = await supabase
          .from('users')
          .select('profile_details')
          .eq('id', userId)
          .maybeSingle();

        if (userData && userData.profile_details) {
          const compPosts = Array.isArray(userData.profile_details.company_posts)
            ? userData.profile_details.company_posts
            : [];
          setPosts(compPosts);
        }

        setStatus('idle');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message);
      }
    };
    fetchCompanyAndPosts();
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus('error');
      setErrorMessage('Organization Name is required');
      return;
    }

    setStatus('saving');
    setErrorMessage('');

    try {
      if (companyId) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: name.trim(),
            logo_url: logoUrl.trim(),
            website: website.trim(),
            description: description.trim()
          })
          .eq('id', companyId);

        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
        } else {
          setStatus('success');
        }
      } else {
        const { data, error } = await supabase
          .from('companies')
          .insert({
            name: name.trim(),
            logo_url: logoUrl.trim(),
            website: website.trim(),
            description: description.trim(),
            created_by: userId
          })
          .select('id')
          .single();

        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
        } else {
          if (data) setCompanyId(data.id);
          setStatus('success');
        }
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setLogoUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag and Touch crop listeners
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropX, y: e.clientY - cropY });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCropX(e.clientX - dragStart.x);
    setCropY(e.clientY - dragStart.y);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - cropX, y: e.touches[0].clientY - cropY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setCropX(e.touches[0].clientX - dragStart.x);
    setCropY(e.touches[0].clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePostFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setPostImage(event.target?.result as string);
      setCropScale(1.0);
      setCropRotation(0);
      setCropX(0);
      setCropY(0);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setPostImage(url);
    setOriginalImage(url);
    setCropScale(1.0);
    setCropRotation(0);
    setCropX(0);
    setCropY(0);
  };

  const generateCroppedImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get 2d context"));
          return;
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 600, 600);

        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate((cropRotation * Math.PI) / 180);
        ctx.scale(cropScale, cropScale);

        const screenFactor = 600 / 280;
        const tx = cropX * screenFactor;
        const ty = cropY * screenFactor;
        ctx.translate(tx / cropScale, ty / cropScale);

        const aspect = img.width / img.height;
        let drawW = 600;
        let drawH = 600;

        if (aspect > 1) {
          drawW = 600 * aspect;
        } else {
          drawH = 600 / aspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error("Could not load original image"));
      img.src = originalImage;
    });
  };

  const handleCreatePost = async () => {
    if (!originalImage.trim()) return;
    setIsPosting(true);
    setPostError(null);

    try {
      const finalImage = await generateCroppedImage();
      const newPost = {
        id: Math.random().toString(36).substring(2, 11),
        imageUrl: finalImage,
        caption: postCaption.trim(),
        likes: 0,
        likedByUser: false,
        createdAt: new Date().toISOString()
      };

      const { data: userData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = userData?.profile_details || {};
      const currentPosts = Array.isArray(details.company_posts) ? details.company_posts : [];
      const updatedPosts = [newPost, ...currentPosts];

      const mergedDetails = {
        ...details,
        company_posts: updatedPosts
      };

      const { error } = await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      if (error) {
        setPostError(error.message);
      } else {
        setPosts(updatedPosts);
        setPostImage('');
        setOriginalImage('');
        setPostCaption('');
        setShowCreatePostModal(false);
      }
    } catch (err: any) {
      setPostError(err.message || "An error occurred");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      });

      if (selectedPost && selectedPost.id === postId) {
        const liked = !selectedPost.likedByUser;
        setSelectedPost({
          ...selectedPost,
          likedByUser: liked,
          likes: liked ? selectedPost.likes + 1 : Math.max(0, selectedPost.likes - 1)
        });
      }

      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const mergedDetails = {
        ...details,
        company_posts: updatedPosts
      };

      await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleSavePostCaption = async (postId: string) => {
    try {
      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            caption: editCaptionText.trim()
          };
        }
        return p;
      });

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          caption: editCaptionText.trim()
        });
      }

      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const mergedDetails = {
        ...details,
        company_posts: updatedPosts
      };

      await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      setPosts(updatedPosts);
      setIsEditingCaption(false);
    } catch (err) {
      console.error("Error updating caption:", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const updatedPosts = posts.filter(p => p.id !== postId);

      const { data: currentData } = await supabase
        .from('users')
        .select('profile_details')
        .eq('id', userId)
        .maybeSingle();

      const details = currentData?.profile_details || {};
      const mergedDetails = {
        ...details,
        company_posts: updatedPosts
      };

      await supabase
        .from('users')
        .update({ profile_details: mergedDetails })
        .eq('id', userId);

      setPosts(updatedPosts);
      setSelectedPost(null);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-20 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="w-full text-left bg-[#0e111a]/85 border border-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Glow overlays */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2ff]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Modern Cover Banner */}
      <div className="h-40 bg-gradient-to-r from-[#0a1e3a] via-[#040d1a] to-[#02050b] relative border-b border-white/5 overflow-hidden flex items-end px-8 pb-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,210,255,0.15),rgba(255,255,255,0))]" />
        <div className="absolute top-6 left-6 text-white/30 text-[10px] font-mono tracking-widest uppercase select-none">Organization Profile</div>
      </div>

      {/* Overlapping Avatar & Setup Header */}
      <div className="px-8 pb-2 flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 relative z-10">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-[#0e1015] bg-[#151820] shadow-xl overflow-hidden flex items-center justify-center shrink-0 relative group">
          {logoUrl ? (
            <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-2xl text-white">
              {name ? name[0].toUpperCase() : 'C'}
            </div>
          )}
        </div>
        
        <div className="flex-1 text-left sm:mb-2 space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {name || 'New Organization'}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              id="company-logo-upload-premium"
              className="hidden"
            />
            <label
              htmlFor="company-logo-upload-premium"
              className="text-[10px] bg-white hover:bg-white/90 text-black font-bold rounded-lg px-3 py-1.5 transition-all cursor-pointer select-none"
            >
              Upload Logo
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Presets:</span>
              {['company1', 'company2', 'company3', 'tech1'].map(p => (
                <img
                  key={p}
                  src={`https://i.pravatar.cc/150?u=${p}`}
                  alt=""
                  onClick={() => setLogoUrl(`https://i.pravatar.cc/150?u=${p}`)}
                  className="w-6 h-6 rounded border border-white/10 hover:border-[#00d2ff] cursor-pointer object-cover hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      <div className="px-8 mt-4">
        {status === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-mono">
            Profile changes successfully saved and synchronized.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs font-mono">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Organization Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AeroTech Labs"
              className="w-full bg-[#161922] border border-white/5 rounded-xl h-11 px-4 text-white text-sm placeholder:text-white/20 focus:ring-1 focus:ring-[#00d2ff] focus:border-[#00d2ff] focus:outline-none transition-all"
            />
          </div>

          {/* Website URL field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Website URL</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g. https://aerotech.io"
              className="w-full bg-[#161922] border border-white/5 rounded-xl h-11 px-4 text-white text-sm placeholder:text-white/20 focus:ring-1 focus:ring-[#00d2ff] focus:border-[#00d2ff] focus:outline-none transition-all"
            />
          </div>
        </div>



        {/* Description field */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Organization Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a description of your organization, culture, and key domain areas..."
            rows={4}
            className="w-full bg-[#161922] border border-white/5 rounded-xl p-4 text-white text-sm placeholder:text-white/20 focus:ring-1 focus:ring-[#00d2ff] focus:border-[#00d2ff] focus:outline-none transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="h-11 px-8 bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border-none font-sans text-xs"
          >
            {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Posts Section */}
      <div className="px-8 pb-8 space-y-6 border-t border-white/5 pt-8">
        <div className="flex justify-between items-center pb-2">
          <div className="text-left">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Company Posts
            </h2>
            <p className="text-[10px] text-white/40 mt-0.5">Publish office workspaces, team photos, or certifications</p>
          </div>
          <button
            onClick={() => setShowCreatePostModal(true)}
            className="text-xs font-bold px-4 py-2 bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-[#333] rounded-2xl p-12 text-center text-white/40 space-y-2 bg-[#0d1117]/30">
            <p className="text-sm">No posts yet.</p>
            <p className="text-xs text-white/30">Share photos of your workspace, team events, or company announcements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-w-3xl">
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: 15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => setSelectedPost(post)}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-[#333] cursor-pointer bg-[#0d1117]"
                >
                  <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                  {/* Instagram Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center select-none animate-fade-in">
                    <div className="flex items-center gap-1.5 text-white font-mono text-xs mb-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {post.likes}
                    </div>
                    {post.caption && (
                      <p className="text-white/80 text-[10px] leading-snug line-clamp-3 max-w-full font-medium">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Post Upload Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0e1015] border border-[#333] w-full max-w-md rounded-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#07090e]">
              <h3 className="text-base font-semibold text-white">Create New Post</h3>
              <button onClick={() => { setShowCreatePostModal(false); setPostImage(''); setPostCaption(''); setPostError(null); }} className="text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-white/60">Image Upload</label>
                {originalImage ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* Cropper Viewport Container */}
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-xl border border-[#333] bg-[#07090e] select-none group">
                      <div 
                        className="w-full h-full flex items-center justify-center pointer-events-none"
                        style={{
                          transform: `translate(${cropX}px, ${cropY}px) scale(${cropScale}) rotate(${cropRotation}deg)`,
                          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                        }}
                      >
                        <img src={originalImage} alt="Crop preview" className="max-w-none max-h-none select-none pointer-events-none" style={{ width: '100%', height: 'auto' }} />
                      </div>
                      {/* Drag overlay receiver */}
                      <div 
                        className="absolute inset-0 z-10 cursor-move"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      />
                      {/* Delete file button */}
                      <button 
                        onClick={() => { setPostImage(''); setOriginalImage(''); }} 
                        className="absolute top-2 right-2 z-20 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors cursor-pointer border-none"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>

                    {/* Adjustments Panel */}
                    <div className="w-full max-w-[280px] space-y-3">
                      {/* Zoom/Scale Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold text-white/50 w-8 text-left">Zoom</span>
                        <input 
                          type="range" 
                          min="1.0" 
                          max="3.0" 
                          step="0.05"
                          value={cropScale}
                          onChange={(e) => setCropScale(parseFloat(e.target.value))}
                          className="flex-1 accent-[#00d2ff] bg-white/10 h-1 rounded-lg cursor-pointer appearance-none"
                        />
                        <span className="text-[10px] font-mono text-white/50 w-6 text-right">{cropScale.toFixed(2)}x</span>
                      </div>

                      {/* Rotation controls & Reset */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCropRotation((prev) => (prev + 90) % 360)}
                          className="flex-1 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                          Rotate 90°
                        </button>
                        <button
                          onClick={() => { setCropScale(1.0); setCropRotation(0); setCropX(0); setCropY(0); }}
                          className="flex-1 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-dashed border-[#333] rounded-xl p-8 text-center hover:border-white/20 transition-all bg-[#07090e] relative flex flex-col items-center justify-center min-h-[160px]">
                      <input type="file" accept="image/*" onChange={handlePostFileChange} id="company-post-file-upload-premium" className="hidden" />
                      <label htmlFor="company-post-file-upload-premium" className="flex flex-col items-center gap-2 text-white/50 hover:text-white cursor-pointer select-none">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        <span className="text-xs font-semibold">Upload Photo</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={postImage}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="flex-1 bg-[#1b1e28] border border-[#333] rounded-xl h-10 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-white/60">Caption</label>
                <textarea
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Write a caption..."
                  rows={3}
                  className="w-full bg-[#1b1e28] border border-[#333] rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none resize-none"
                />
              </div>

              {postError && (
                <div className="text-red-400 text-xs text-left">
                  {postError}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#333] flex gap-3 justify-end bg-[#07090e]">
              <button
                onClick={() => { setShowCreatePostModal(false); setPostImage(''); setPostCaption(''); setPostError(null); }}
                className="h-10 px-5 border border-white/10 text-white/70 hover:text-white font-semibold rounded-xl hover:bg-white/5 transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={isPosting || !postImage.trim()}
                className="h-10 px-6 bg-[#00d2ff] disabled:bg-[#00d2ff]/50 disabled:text-black/50 text-black font-semibold rounded-xl hover:bg-[#00d2ff]/90 active:scale-[0.98] transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 border-none"
              >
                {isPosting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Zoom Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
          <div className="bg-[#0e1015] border border-[#333] w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] max-h-[85vh]">
            <div className="md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              <img src={selectedPost.imageUrl} alt={selectedPost.caption} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="md:w-2/5 flex flex-col border-l border-[#333] bg-[#0e1015]">
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#07090e]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#333] bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {name ? name[0].toUpperCase() : 'C'}
                  </div>
                  <span className="text-xs font-semibold text-white">{name || 'Company Profile'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {/* Edit Caption Button */}
                  <button 
                    onClick={() => {
                      setIsEditingCaption(true);
                      setEditCaptionText(selectedPost.caption || '');
                    }}
                    title="Edit Caption"
                    className="text-white/60 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>

                  {/* Delete Post Button */}
                  <button 
                    onClick={() => handleDeletePost(selectedPost.id)}
                    title="Delete Post"
                    className="text-red-400 hover:text-red-500 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>

                  <div className="w-[1px] h-4 bg-[#333] mx-0.5" />

                  {/* Close Modal Button */}
                  <button onClick={() => { setSelectedPost(null); setIsEditingCaption(false); }} className="text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto text-left space-y-4">
                {isEditingCaption ? (
                  <div className="space-y-3">
                    <textarea
                      value={editCaptionText}
                      onChange={(e) => setEditCaptionText(e.target.value)}
                      placeholder="Edit caption..."
                      rows={4}
                      className="w-full bg-[#1b1e28] border border-[#333] rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsEditingCaption(false)}
                        className="h-8 px-3 border border-white/10 hover:bg-white/5 rounded-lg text-[10px] font-semibold text-white/70 hover:text-white cursor-pointer transition-all border-none bg-transparent"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSavePostCaption(selectedPost.id)}
                        className="h-8 px-4 bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black rounded-lg text-[10px] font-semibold transition-all cursor-pointer border-none"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : selectedPost.caption ? (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full border border-[#333] bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                      {name ? name[0].toUpperCase() : 'C'}
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="text-white/90 leading-relaxed">
                        <strong className="text-white mr-1.5">{name || 'Company'}</strong>
                        {selectedPost.caption}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/30 italic">No caption provided.</p>
                )}
              </div>

              <div className="p-4 border-t border-[#333] bg-[#07090e] space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`transition-all hover:scale-110 cursor-pointer border-none bg-transparent ${
                      selectedPost.likedByUser ? 'text-red-500' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={selectedPost.likedByUser ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <span className="text-xs text-white/50">
                    Shared on <span className="font-mono">{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-white font-mono">
                  {selectedPost.likes} {selectedPost.likes === 1 ? 'like' : 'likes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Confirmation Overlay */}
      {showDeleteSuccess && (
        <DeleteSuccessOverlay onClose={() => setShowDeleteSuccess(false)} />
      )}
    </div>
  );
}

function CompanyDirectoryView({ onSelectCompany }: { onSelectCompany: (id: string) => void }) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error: _error } = await supabase
          .from('companies')
          .select('id, name, logo_url, website, description');

        if (data) {
          setCompanies(data);
        }
      } catch (err) {
        console.error("Error loading directory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.website?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col flex-1 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Company Directory
            <span className="text-[10px] bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-bold px-2.5 py-0.5 rounded-full font-mono">
              {filteredCompanies.length} Active
            </span>
          </h1>
          <p className="text-xs text-white/40 mt-1 font-mono">Browse profiles and active requirements of all registered client organizations.</p>
        </div>

        {/* Premium search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search organizations..."
            className="w-full bg-[#161922]/80 border border-white/5 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff]/30 text-white rounded-xl h-10 pl-10 pr-4 text-xs focus:outline-none transition-all placeholder:text-white/20"
          />
          <div className="absolute left-3 top-3 text-white/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 w-full">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center text-white/40 w-full bg-[#121520]/20">
          <svg className="w-8 h-8 mx-auto text-white/20 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <p className="text-sm font-semibold">No organizations found</p>
          <p className="text-xs text-white/30 mt-1">Try widening your search terms or wait for new client signups.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full items-start justify-start">
          {filteredCompanies.map(comp => (
            <div 
              key={comp.id} 
              onClick={() => onSelectCompany(comp.id)}
              className="bg-[#121520]/60 border border-white/5 rounded-2xl p-5 hover:border-[#00d2ff]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-left flex flex-col gap-4 h-full relative overflow-hidden shadow-lg"
            >
              {/* Card top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-3">
                {/* Logo circle frame */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00d2ff]/10 to-[#0B2551]/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white shrink-0 group-hover:border-[#00d2ff]/40 transition-colors overflow-hidden">
                  {comp.logo_url ? (
                    <img src={comp.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span>{comp.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="overflow-hidden text-left flex-1">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-[#00d2ff] transition-colors">{comp.name}</h3>
                  {comp.website && (
                    <p className="text-[10px] text-white/30 truncate font-mono mt-0.5">{comp.website}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-white/50 line-clamp-3 leading-relaxed flex-1 font-medium">
                {comp.description || 'No description provided by the organization.'}
              </p>
              <div className="border-t border-white/5 pt-3.5 text-[10px] text-[#00d2ff] font-mono font-semibold flex items-center justify-between group-hover:text-[#00d2ff]/90 transition-colors">
                <span>View Details</span>
                <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function B2BPartnerProjectsView({ userId, onSelectCompany }: { userId: string; onSelectCompany?: (id: string) => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [appliedProjectIds, setAppliedProjectIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [_myCompanyId, setMyCompanyId] = useState<string | null>(null);
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!userId) return;

    const loadB2BData = async () => {
      setLoading(true);
      try {
        const [myCompRes, apiProjects] = await Promise.all([
          supabase.from('companies').select('id').eq('created_by', userId).maybeSingle(),
          apiService.getChallenges()
        ]);

        let ownCompId = '';
        if (myCompRes.data) {
          setMyCompanyId(myCompRes.data.id);
          ownCompId = myCompRes.data.id;
        }

        const appliedIds = new Set<string>();
        const filtered: any[] = [];

        apiProjects.forEach((proj: any) => {
          if (proj.appStatus) {
            appliedIds.add(proj.id);
          }
          if (proj.companyId !== ownCompId) {
            filtered.push({
              id: proj.id,
              company_id: proj.companyId,
              title: proj.name,
              description: proj.description,
              budget: proj.budget || '',
              created_at: proj.created_at,
              companyName: proj.author || 'Partner Organization',
              logoUrl: proj.avatar || '',
              tags: proj.skills || []
            });
          }
        });

        setAppliedProjectIds(appliedIds);
        setProjects(filtered);
      } catch (err) {
        console.error("Failed to load B2B marketplace projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadB2BData();
  }, [userId]);

  const handleApplyPartner = async (projectId: string) => {
    try {
      const res = await apiService.joinChallenge(projectId);
      if (!res) throw new Error("Failed to join challenge");

      setShowSuccessTick(true);
      setAppliedProjectIds(prev => {
        const next = new Set(prev);
        next.add(projectId);
        return next;
      });
    } catch (err: any) {
      alert("Failed to submit B2B application: " + err.message);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full flex flex-col flex-1 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Partner Board
            <span className="text-[10px] bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20 font-bold px-2.5 py-0.5 rounded-full font-mono">
              {filteredProjects.length} Opportunities
            </span>
          </h1>
          <p className="text-xs text-white/40 mt-1 font-mono">B2B marketplace: Browse and apply to opportunities posted by other organizations</p>
        </div>

        {/* Premium search bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search B2B contracts..."
            className="w-full bg-[#161922]/80 border border-white/5 focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff]/30 text-white rounded-xl h-10 pl-10 pr-4 text-xs focus:outline-none transition-all placeholder:text-white/20"
          />
          <div className="absolute left-3 top-3 text-white/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 w-full">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center text-white/40 w-full bg-[#121520]/20">
          <svg className="w-8 h-8 mx-auto text-white/20 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <p className="text-sm font-semibold">No B2B contracts listed</p>
          <p className="text-xs text-white/30 mt-1">Try widening your search terms or wait for other companies to post requirements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {filteredProjects.map(p => {
            const hasApplied = appliedProjectIds.has(p.id);
            return (
              <div 
                key={p.id} 
                className="bg-[#121520]/60 border border-white/5 rounded-2xl p-5 hover:border-[#00d2ff]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-lg group text-left"
              >
                {/* Card top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div 
                      onClick={() => p.company_id && onSelectCompany && onSelectCompany(p.company_id)}
                      className={`flex items-center gap-3 ${p.company_id && onSelectCompany ? 'cursor-pointer hover:opacity-85 transition-opacity group' : ''}`}
                    >
                      {/* Logo circle frame */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00d2ff]/10 to-[#0B2551]/20 border border-white/10 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden group-hover:border-[#00d2ff]/40 transition-colors">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span>{p.companyName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold text-white leading-tight ${p.company_id && onSelectCompany ? 'group-hover:text-[#00d2ff] group-hover:underline' : ''}`}>{p.companyName}</h3>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">Shared Contract Opportunity</p>
                      </div>
                    </div>

                    {/* High contrast budget pill */}
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/35 px-3 py-1 rounded-full font-mono shrink-0">
                      {p.budget || 'B2B Contract'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white/90 leading-snug group-hover:text-[#00d2ff] transition-colors">{p.title}</h4>
                    <p className="text-xs text-white/50 mt-1.5 leading-relaxed font-medium">{p.description}</p>
                  </div>

                  {p.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap pt-1.5">
                      {p.tags.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 text-[9px] font-bold font-mono bg-[#161922] border border-white/5 text-white/50 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  {hasApplied ? (
                    <button 
                      disabled
                      className="w-full text-xs font-semibold text-[#00d2ff] bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-xl py-2.5 transition-all text-center cursor-not-allowed font-mono flex items-center justify-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      Proposal Sent / Partnership Requested
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApplyPartner(p.id)}
                      className="w-full text-xs font-bold text-black bg-white hover:bg-white/95 active:scale-[0.98] rounded-xl py-2.5 transition-all text-center cursor-pointer font-sans flex items-center justify-center gap-1.5 border-none"
                    >
                      Apply as Partner
                      <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showSuccessTick && (
        <SuccessTickOverlay onClose={() => setShowSuccessTick(false)} />
      )}
    </div>
  );
}

function RecruiterDashboard({ userId, firstName, lastName, email, onLogout }: { userId: string; firstName: string; lastName: string; email: string; onLogout: () => void }) {
  const [recruiterView, setRecruiterView] = useState<'pipeline' | 'talent' | 'post_job' | 'chat' | 'company_profile' | 'companies_directory'>('pipeline');
  const [dbCandidates, setDbCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);

  const fetchDevelopers = async () => {
    try {
      const devs = await apiService.getDevelopers();
      setDbCandidates(devs);
    } catch (err: any) {
      console.error("Error loading developers:", err.message);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const mappedDbCandidates = dbCandidates.map(u => {
    const name = u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username || u.email;
    const skills = u.dashboard_config?.tech_stack || [];
    return {
      id: u.id,
      name,
      role: 'Software Engineer',
      avatar: u.profile_details?.avatar_url || '',
      skills,
      status: u.application_status || 'new',
      xp: u.xp || 0,
      match: skills.length > 0 ? Math.min(100, Math.max(50, 60 + skills.length * 8)) : 0,
      isDbDeveloper: true,
      email: u.email,
      username: u.username,
      profile_details: u.profile_details,
      dashboard_config: u.dashboard_config
    };
  });

  const allCandidates = mappedDbCandidates;

  const handleDeveloperUpdate = (updatedDev: any) => {
    if (updatedDev.isDbDeveloper) {
      setDbCandidates(prev => prev.map(u => u.id === updatedDev.id ? { ...u, profile_details: updatedDev.profile_details } : u));
    }
    setSelectedCandidate((prev: any) => prev && prev.id === updatedDev.id ? {
      ...prev,
      profile_details: updatedDev.profile_details,
      xp: Number(updatedDev.profile_details?.xp !== undefined ? updatedDev.profile_details.xp : (updatedDev.xp || 23094))
    } : prev);
  };

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
              <span className="font-medium text-sm hidden md:block text-left">Pipeline</span>
            </button>
            <button
              onClick={() => setRecruiterView('talent')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'talent' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block text-left">Talent Pool</span>
            </button>
            <button
              onClick={() => setRecruiterView('post_job')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'post_job' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium text-sm hidden md:block text-left">Post Requirement</span>
            </button>
            <button
              onClick={() => setRecruiterView('chat')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'chat' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block text-left">Chat</span>
            </button>
            <button
              onClick={() => setRecruiterView('partner_projects' as any)}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === ('partner_projects' as any) ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block text-left">Partner Board</span>
            </button>
            <button
              onClick={() => setRecruiterView('companies_directory')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'companies_directory' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block text-left">Companies</span>
            </button>
            <button
              onClick={() => setRecruiterView('company_profile')}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl transition-all cursor-pointer ${
                recruiterView === 'company_profile' ? 'bg-white/10 text-white border border-[#333]' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium text-sm hidden md:block text-left">Profile</span>
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
      <main className={`flex-1 bg-[#0e1015] ${
        recruiterView === 'chat' 
          ? 'overflow-hidden h-full' 
          : 'overflow-y-auto p-6 md:p-10 w-full h-full'
      }`}>
        {recruiterView === 'pipeline' ? (
          <div className="w-full flex flex-col flex-1">
            <header className="mb-8 shrink-0 text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white">Engineering Pipeline</h1>
              <p className="text-sm text-white/50 mt-1 font-mono">Q3 Hiring Cycle</p>
            </header>
            <div className="flex gap-6 flex-1 overflow-x-auto pb-4 items-start">
              {columns.map(col => {
                const colCandidates = allCandidates.filter(c => c.status === col.id);
                return (
                  <div key={col.id} className="w-[320px] shrink-0 flex flex-col bg-[#0a0a0a] border border-[#333] rounded-lg max-h-full">
                    <div className="p-3 border-b border-[#333] bg-[#111] flex items-center justify-between shrink-0 rounded-t-lg">
                      <h2 className="text-sm font-semibold tracking-tight text-white/90">{col.title}</h2>
                      <span className="text-xs font-mono text-white/50 px-1.5 py-0.5 bg-[#222] rounded border border-[#333]">{colCandidates.length}</span>
                    </div>
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                      {colCandidates.map(candidate => (
                        <div key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="bg-[#151820] border border-[#333] rounded p-3 hover:border-white/20 transition-colors cursor-pointer group text-left">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded border border-[#333] overflow-hidden bg-[#151820] flex items-center justify-center shrink-0">
                              {candidate.avatar ? (
                                <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-xs text-white shrink-0">
                                  {candidate.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="text-sm font-semibold text-white truncate">{candidate.name}</h3>
                              <p className="text-xs text-white/50 truncate mb-2">{candidate.role}</p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {candidate.skills.map((skill: any) => (
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
          </div>
        ) : recruiterView === 'post_job' ? (
          <PostJobView userId={userId} />
        ) : recruiterView === 'chat' ? (
          <StudentChatView 
            userId={userId} 
            firstName={firstName} 
            lastName={lastName} 
            email={email} 
            onSelectCompany={setSelectedCompanyId}
            onSelectDeveloper={setSelectedCandidate}
            initialPartnerId={activeChatPartnerId}
            onClearInitialPartner={() => setActiveChatPartnerId(null)}
          />
        ) : recruiterView === 'company_profile' ? (
          <CompanyProfileView userId={userId} />
        ) : recruiterView === 'companies_directory' ? (
          <CompanyDirectoryView onSelectCompany={(id) => setSelectedCompanyId(id)} />
        ) : recruiterView === ('partner_projects' as any) ? (
          <B2BPartnerProjectsView userId={userId} onSelectCompany={setSelectedCompanyId} />
        ) : (
          /* ── Talent Pool View ── */
          <div className="w-full flex flex-col flex-1 text-left">
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
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
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
                    {allCandidates.map(c => (
                      <tr key={c.id} className="border-b border-[#333] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div 
                            onClick={() => setSelectedCandidate(c)}
                            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity group"
                          >
                            <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full border border-[#333] object-cover" />
                            <div>
                              <span className="font-semibold text-white group-hover:text-[#00d2ff] group-hover:underline">{c.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-white/60">{c.role}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {c.skills.map((s: any) => (
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
                          <button onClick={() => setSelectedCandidate(c)} className="text-xs font-semibold text-black bg-white px-3.5 py-1.5 rounded-lg hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer border-none">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      {selectedCandidate && (
        <DeveloperProfileModal 
          developer={selectedCandidate} 
          recruiterUserId={userId}
          onClose={() => setSelectedCandidate(null)} 
          onUpdateDeveloper={handleDeveloperUpdate}
          onStartChat={(partnerId) => {
            setActiveChatPartnerId(partnerId);
            setRecruiterView('chat');
            setSelectedCandidate(null);
          }}
        />
      )}
      {selectedCompanyId && (
        <CompanyProfileModal 
          companyId={selectedCompanyId} 
          onClose={() => setSelectedCompanyId(null)} 
          onStartChat={(partnerId) => {
            setActiveChatPartnerId(partnerId);
            setRecruiterView('chat');
            setSelectedCompanyId(null);
          }}
        />
      )}
    </div>
  );
}
