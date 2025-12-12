import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Heart, 
  Share2, 
  Disc, 
  MessageCircle, 
  ChevronDown, 
  Music, 
  Play, 
  ArrowRight, 
  Sun, 
  Moon, 
  Mail, 
  Send, 
  Headphones, 
  Mic2, 
  Speaker, 
  Gift, 
  Music2, 
  Radio, 
  Linkedin, 
  Instagram, 
  QrCode, 
  Globe, 
  Waves, 
  ChevronUp, 
  Eye, 
  Mic, 
  Facebook, 
  Youtube, 
  ArrowLeft 
} from 'lucide-react';
import { 
  PRODUCTS, 
  WHATSAPP_NUMBER, 
  TELEGRAM_LINK, 
  EMAIL_ADDRESS, 
  IMAGES, 
  HERO_VIDEO_URL, 
  FREE_MUSIC_VIDEO_URL, 
  RARITY_VIDEO_URL, 
  ABOUT_VIDEO_URL, 
  CONTACT_VIDEO_URL, 
  GENRES_VIDEO_URL, 
  OWNER_VIDEO_URL 
} from './constants';
import { Product, ChatMessage, FilterType } from './types';
import { generateChatResponse } from './services/geminiService';
import { translations, Language } from './translations';

// Explicitly declare THREE global
declare const THREE: any;

// --- Types ---
type Page = 'home' | 'shop' | 'genres' | 'rarities' | 'about' | 'contact' | 'free-music' | 'share-me';

// --- Helper for deep key access ---
function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let current: any = translations[lang];
  for (const k of keys) {
    if (current[k] === undefined) return path;
    current = current[k];
  }
  return current as string;
}

// --- Components ---

// Word Shine Component for "Word by Word" animation
const WordShine: React.FC<{ 
  text: string; 
  className?: string;
  isTitle?: boolean;
  delay?: number;
}> = ({ text, className = "", isTitle = false, delay = 0 }) => {
  const words = text.split(' ');
  return (
    <div className={`flex flex-wrap justify-center gap-x-4 gap-y-2 ${className}`}>
      {words.map((word, i) => (
        <span 
          key={i} 
          className={`
            inline-block animate-shine-word transition-all duration-500
            ${isTitle 
              ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#aa771c] drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]' 
              : 'text-stone-300 uppercase tracking-[0.3em] font-light'}
          `}
          style={{ 
            animationDelay: `${delay + (i * 0.5)}s`,
            backgroundSize: '200% auto'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

// 0. Flash Transition
const FlashTransition: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white pointer-events-none animate-flash"></div>
  );
};

// Visual Spectrum Analyzer Component
const VisualSpectrum: React.FC<{ className?: string, barCount?: number, height?: string }> = ({ className = "", barCount = 40, height = "100%" }) => {
  return (
    <div className={`flex items-end justify-center gap-[2px] ${className}`} style={{ height }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-gradient-to-t from-vivid-green via-gold-light to-purple-500 rounded-t-sm animate-spectrum opacity-80"
          style={{
            height: '20%',
            animationDelay: `${i * 0.05}s`,
            animationDuration: `${0.6 + Math.random() * 0.5}s`
          }}
        ></div>
      ))}
    </div>
  );
};

// Sunflower Spiral Background Component (Replaced Hero Video)
const SunflowerBackground: React.FC = () => {
  const [dots, setDots] = useState<any[]>([]);

  useEffect(() => {
    const N = 420;
    const SIZE = 500;
    const DOT_R = 1.2;
    const MARGIN = 10;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const MAX_R = CX - MARGIN - DOT_R;
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    const DUR = 2.2;

    const newDots = [];
    for (let i = 0; i < N; i++) {
      const frac = (i + 0.5) / N;
      const r = Math.sqrt(frac) * MAX_R;
      const theta = (i + 0.5) * GOLDEN;
      const x = CX + r * Math.cos(theta);
      const y = CY + r * Math.sin(theta);
      
      newDots.push({
        id: i,
        x,
        y,
        r: DOT_R,
        frac,
        dur: DUR,
        fill: "#fff",
        opacity: 0.5
      });
    }
    setDots(newDots);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 500 500" className="w-full h-full max-w-[120vh] max-h-[120vh] opacity-80">
        <g>
          {dots.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={dot.fill}
              opacity={dot.opacity}
            >
              <animate
                attributeName="r"
                values={`${dot.r * 0.7};${dot.r * 1.4};${dot.r * 0.7}`}
                dur={`${dot.dur}s`}
                begin={`${dot.frac * dot.dur}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              />
              <animate
                attributeName="opacity"
                values="0.33;1;0.33"
                dur={`${dot.dur}s`}
                begin={`${dot.frac * dot.dur}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              />
            </circle>
          ))}
        </g>
      </svg>
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
    </div>
  );
};

// Marketing Strategy Bubble
const SocialProofBubble: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMsgKey, setCurrentMsgKey] = useState('marketing.msg1');
  const [iconType, setIconType] = useState<'view' | 'buy'>('view');

  useEffect(() => {
    // Defines different messages to rotate so it doesn't seem fake
    const messages = [
      { key: 'marketing.msg1', type: 'view' },
      { key: 'marketing.msg2', type: 'buy' },
      { key: 'marketing.msg3', type: 'buy' },
      { key: 'marketing.msg4', type: 'view' },
    ];

    // Timer logic: Every 90 seconds (90000ms), show message for 5 seconds
    const cycle = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMsgKey(randomMsg.key);
      setIconType(randomMsg.type as any);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 90000); 

    // Optional: Also run a quick one shortly after load to engage user immediately
    const initialTimer = setTimeout(() => {
      const randomMsg = messages[0]; // Start with first msg
      setCurrentMsgKey(randomMsg.key);
      setIconType(randomMsg.type as any);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 15000);

    return () => {
      clearInterval(cycle);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
       <div className="glass-panel px-6 py-4 rounded-full flex items-center gap-4 border border-gold-dark/30 shadow-[0_0_20px_rgba(197,160,89,0.2)] bg-black/60 backdrop-blur-xl">
          <div className="p-2 bg-gold-light/10 rounded-full text-gold-light relative">
             {iconType === 'view' ? <Eye size={18} /> : <ShoppingBag size={18} />}
             <span className="absolute top-0 right-0 w-2 h-2 bg-vivid-green rounded-full animate-ping"></span>
          </div>
          <div>
             <p className="text-white text-xs font-bold font-sans tracking-wide">{t(currentMsgKey)}</p>
             <p className="text-[10px] text-stone-400 uppercase tracking-widest">{t('marketing.just_now')}</p>
          </div>
       </div>
    </div>
  );
};

// Reusable Parallax Video Section
const ParallaxSection: React.FC<{
  videoUrl: string;
  children?: React.ReactNode;
  height?: string;
  objectFit?: 'cover' | 'contain';
}> = ({ videoUrl, children, height = "h-[50vh]", objectFit = 'cover' }) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative ${height} overflow-hidden flex items-center justify-center bg-black w-full`}>
      <div
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>
        <video
           autoPlay 
           muted 
           loop 
           playsInline
           className={`w-full h-full object-${objectFit} opacity-80 bg-black`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 text-center w-full max-w-7xl px-4 flex flex-col items-center justify-center h-full">
         {children}
      </div>
    </div>
  );
};

// Aurora Synthwave Background Component
const AuroraBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check if THREE is loaded
    if (typeof THREE === 'undefined') {
        console.warn("Three.js not loaded");
        return;
    }

    let scene: any, camera: any, renderer: any, material: any;
    let startTime = Date.now();
    let animationId: number;

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float iTime;
        uniform vec2 iResolution;
        varying vec2 vUv;

        #define S smoothstep

        vec4 Line(vec2 uv, float speed, float height, vec3 col) {
            uv.y += S(1., 0., abs(uv.x)) * sin(iTime * speed + uv.x * height) * 0.15;
            return vec4(S(0.04 * S(0.2, 0.9, abs(uv.x)), 0., abs(uv.y) - 0.003) * col, 1.0) * S(1., 0.3, abs(uv.x));
        }

        void main() {
            vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
            vec4 O = vec4(0.);
            
            for (float i = 0.; i <= 7.; i += 1.) {
                float t = i / 7.;
                float timeOffset = iTime * 0.2 + t * 1.5;
                
                // Tehran Records Gold & Purple theme adaptation
                vec3 auroraColor = vec3(
                    0.2 + 0.5 * sin(timeOffset + t * 2.5),
                    0.4 + 0.3 * sin(timeOffset * 1.2 + t * 1.8),
                    0.2 + 0.4 * cos(timeOffset * 0.9 + t * 1.3)
                );
                
                // Mix with Gold/Cyan tones
                auroraColor = mix(auroraColor, vec3(0.8, 0.6, 0.2), sin(timeOffset + t) * 0.4 + 0.4);
                auroraColor = mix(auroraColor, vec3(0.1, 0.5, 0.8), cos(timeOffset * 0.8 + t * 1.1) * 0.3 + 0.3);
                
                O += Line(uv, 0.8 + t * 0.6, 3. + t * 1.2, auroraColor);
            }
            
            gl_FragColor = O;
        }
    `;

    const init = () => {
        const container = containerRef.current;
        if (!container) return;

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio * 2, 3));
        
        // Match container size
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = ''; // Clear existing
        container.appendChild(renderer.domElement);

        material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector2(container.clientWidth * 2, container.clientHeight * 2) }
            },
            transparent: true
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        animate();
    };

    const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (material) {
             material.uniforms.iTime.value = (Date.now() - startTime) * 0.001;
        }
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    };

    const onWindowResize = () => {
        if (!containerRef.current || !renderer || !material) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        material.uniforms.iResolution.value.set(width * 2, height * 2);
    };

    init();
    window.addEventListener('resize', onWindowResize);

    return () => {
        window.removeEventListener('resize', onWindowResize);
        cancelAnimationFrame(animationId);
        if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 z-0 ${className}`} />;
};

// Aurora Dashboard UI Component
const AuroraDashboard: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="relative w-full min-h-screen bg-black font-geist overflow-hidden">
        <AuroraBackground />
        
        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
            
            {/* Visual Spectrum Analyzer - Mid Page Loop */}
            <div className="w-full max-w-2xl h-24 mb-16 opacity-70">
                <VisualSpectrum barCount={60} />
            </div>

            {/* Floating Music Visualizer */}
            <div className="mb-16 flex justify-center animate-fade-in-up">
                <div className="aurora-glass music-glow-box rounded-3xl p-8 border border-purple-400/15 animate-float-slow">
                    <div className="flex items-end justify-center space-x-1.5 h-20 mb-6">
                        {[0.25, 0.55, 0.35, 0.75, 0.45, 0.85, 0.65, 0.40, 0.80, 0.30, 0.60].map((h, i) => (
                           <div 
                             key={i}
                             className="visualizer-bar w-3 animate-wave" 
                             style={{ 
                               height: `${h * 100}%`, 
                               animationDelay: `${i * 0.2}s`, 
                               animationDuration: `${3.5 + Math.random()}s` 
                             }}
                           ></div>
                        ))}
                    </div>
                    
                    {/* Play Button */}
                    <div className="flex justify-center">
                        <button className="w-16 h-16 aurora-glass rounded-full flex items-center justify-center border border-purple-400/25 hover:border-purple-400/40 transition-all duration-500 animate-pulse-scale">
                            <Play className="w-6 h-6 text-purple-300 ml-1" fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Heading */}
            <div className="mb-12 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <h1 className="text-5xl md:text-8xl font-light text-white mb-6 leading-tight">
                    <span className="block">{t('dashboard.title').split(' ')[0]}</span>
                    <div className="aurora-text font-medium">
                         {t('dashboard.title').split(' ').slice(1).join(' ')}
                    </div>
                </h1>
                <p className="text-xl md:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed font-light">
                    {t('dashboard.subtitle')}
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 w-full animate-slide-up" style={{ animationDelay: '0.8s' }}>
                
                {/* Streaming Card */}
                <div className="aurora-glass rounded-2xl p-8 border border-blue-400/15 music-glow-box animate-bounce-slow animate-glow">
                    <div className="w-14 h-14 icon-bg rounded-xl flex items-center justify-center mb-6 mx-auto">
                        <Disc className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3 text-center">{t('dashboard.card1_title')}</h3>
                    <p className="text-white/50 leading-relaxed text-center">{t('dashboard.card1_desc')}</p>
                </div>

                {/* Playlist Card */}
                <div className="aurora-glass rounded-2xl p-8 border border-purple-400/15 music-glow-box animate-bounce-slow animate-glow" style={{ animationDelay: '0.3s' }}>
                    <div className="w-14 h-14 icon-bg rounded-xl flex items-center justify-center mb-6 mx-auto">
                        <Music2 className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3 text-center">{t('dashboard.card2_title')}</h3>
                    <p className="text-white/50 leading-relaxed text-center">{t('dashboard.card2_desc')}</p>
                </div>

                {/* Social Card */}
                <div className="aurora-glass rounded-2xl p-8 border border-cyan-400/15 music-glow-box animate-bounce-slow animate-glow" style={{ animationDelay: '0.6s' }}>
                    <div className="w-14 h-14 icon-bg rounded-xl flex items-center justify-center mb-6 mx-auto">
                        <Globe className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3 text-center">{t('dashboard.card3_title')}</h3>
                    <p className="text-white/50 leading-relaxed text-center">{t('dashboard.card3_desc')}</p>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up" style={{ animationDelay: '1.1s' }}>
                <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="px-10 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-medium rounded-2xl transition-all duration-500 transform hover:scale-105 music-glow-box text-lg shadow-lg">
                    {t('dashboard.btn_listen')}
                </a>
                <a href={FREE_MUSIC_VIDEO_URL} target="_blank" rel="noreferrer" className="px-10 py-4 aurora-glass border border-white/15 text-white font-medium rounded-2xl hover:border-white/30 transition-all duration-500 flex items-center text-lg hover:bg-white/5">
                    <Play className="w-5 h-5 mr-3" fill="currentColor" />
                    {t('dashboard.btn_demo')}
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 md:gap-24 animate-slide-up w-full" style={{ animationDelay: '1.4s' }}>
                <div className="text-center">
                    <div className="text-3xl md:text-5xl font-light text-white mb-2 aurora-text">{t('dashboard.stat1_val')}</div>
                    <div className="text-white/50 text-sm uppercase tracking-wider">{t('dashboard.stat1_label')}</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl md:text-5xl font-light text-white mb-2 aurora-text">{t('dashboard.stat2_val')}</div>
                    <div className="text-white/50 text-sm uppercase tracking-wider">{t('dashboard.stat2_label')}</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl md:text-5xl font-light text-white mb-2 aurora-text">{t('dashboard.stat3_val')}</div>
                    <div className="text-white/50 text-sm uppercase tracking-wider">{t('dashboard.stat3_label')}</div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Search Overlay
const SearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (p: Product) => void; t: (k: string) => string }> = ({ isOpen, onClose, onSelect, t }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = PRODUCTS.filter(p => 
    p.album.toLowerCase().includes(query.toLowerCase()) || 
    p.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-300">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-2 text-stone-400 hover:text-white rounded-full border border-stone-800 hover:border-white transition-all">
          <X size={24} />
        </button>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.search_placeholder')}
          className="w-full bg-transparent text-4xl sm:text-6xl font-serif text-white placeholder-stone-700 border-b border-stone-800 pb-4 focus:outline-none focus:border-gold-light transition-colors mb-12"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh]">
          {query && results.map(p => (
            <div key={p.id} onClick={() => { onSelect(p); onClose(); }} className="flex items-center gap-4 group cursor-pointer p-4 rounded-lg hover:bg-white/5 transition">
              <img src={p.coverImage} className="w-16 h-16 object-cover rounded shadow-lg group-hover:scale-105 transition" alt={p.album} />
              <div>
                <h4 className="text-white text-lg font-serif group-hover:text-gold-light">{p.album}</h4>
                <p className="text-stone-500 text-sm uppercase tracking-widest">{p.artist}</p>
              </div>
            </div>
          ))}
          {query && results.length === 0 && (
            <p className="text-stone-500 text-xl font-light">{t('common.no_results')} "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Sidebar Navigation
const Sidebar: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  setPage: (page: Page) => void; 
  currentPage: Page;
  toggleTheme: () => void;
  isDarkMode: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (k: string) => string;
}> = ({ isOpen, onClose, setPage, currentPage, toggleTheme, isDarkMode, language, setLanguage, t }) => {

  const [sidebarView, setSidebarView] = useState<'menu' | 'share'>('menu');

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => setSidebarView('menu'), 300);
    }
  }, [isOpen]);

  const navItems: { labelKey: string; page: Page }[] = [
    { labelKey: 'nav.shop', page: 'shop' },
    { labelKey: 'nav.genres', page: 'genres' },
    { labelKey: 'nav.rarities', page: 'rarities' },
    { labelKey: 'nav.free_music', page: 'free-music' },
    { labelKey: 'nav.about', page: 'about' },
    { labelKey: 'nav.contact', page: 'contact' },
    // share-me is handled separately
  ];

  const handleNavClick = (page: Page) => {
      setPage(page);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-backdrop" onClick={onClose}></div>
      <div className={`sidebar-panel animate-in slide-in-from-left duration-500 ${sidebarView === 'share' ? 'w-[360px]' : 'w-[300px]'}`}>
        
        {/* Header - Chrome Vinyl & Close */}
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-stone-800 relative z-20 bg-inherit">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="text-stone-400 hover:text-gold-light transition">
               <X size={24} />
             </button>
          </div>
          
          {sidebarView === 'share' && (
              <div className="absolute top-4 left-4">
                <button onClick={() => setSidebarView('menu')} className="text-stone-400 hover:text-gold-light transition flex items-center gap-1">
                  <ArrowLeft size={20} />
                </button>
              </div>
          )}

          <div className="w-24 h-24 rounded-full chrome-vinyl animate-spin-subtle shadow-xl flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#bf953f]">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#bf953f] to-[#aa771c] opacity-80 animate-pulse"></div>
              </div>
          </div>
          
          <div className="text-center">
            <h2 className="font-serif font-black text-xl tracking-[0.15em] text-gold-chrome uppercase leading-none mb-1">Tehran</h2>
            <span className="font-sans font-bold text-[10px] tracking-[0.4em] text-stone-500 uppercase">Records</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative">
            
            {/* Menu View */}
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${sidebarView === 'menu' ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="py-6 px-6 space-y-2">
                {navItems.map((item) => (
                    <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`w-full text-left py-3 px-4 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-between group ${
                        currentPage === item.page 
                        ? 'bg-gold-dark/10 text-gold-light border-l-2 border-gold-light' 
                        : 'text-stone-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                    >
                    <span>{t(item.labelKey)}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentPage === item.page ? 'bg-gold-light' : 'bg-transparent group-hover:bg-stone-600'} transition-colors`}></span>
                    </button>
                ))}
                
                {/* Special Share App Button */}
                <button
                    onClick={() => setSidebarView('share')}
                    className="w-full text-left py-3 px-4 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-between group text-vivid-green hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                >
                    <span className="flex items-center gap-2"><Share2 size={16}/> {t('nav.share_me')}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-vivid-green transition-colors"></span>
                </button>
                </nav>
            </div>

            {/* High Def Share Dashboard View */}
            <div className={`absolute inset-0 transition-transform duration-500 ease-in-out bg-black ${sidebarView === 'share' ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col items-center p-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <h3 className="text-xl font-serif font-black text-white mb-2 relative z-10 text-center">SHARE <span className="text-vivid-green text-glow">APP</span></h3>
                    <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-8 text-center">{t('share.invite')}</p>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.15)] mb-8 transform hover:scale-105 transition-transform duration-300 group relative z-10">
                         <img
                            src="https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/QR%20CODE.png"
                            alt="Scan to Visit"
                            className="w-40 h-40 object-contain"
                         />
                         <div className="absolute inset-0 border-2 border-transparent group-hover:border-vivid-green rounded-xl transition-colors pointer-events-none"></div>
                    </div>

                    {/* Neon Social Icons */}
                    <div className="grid grid-cols-3 gap-4 w-full px-2">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https://tehranrecords.vercel.app" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center group-hover:bg-[#1877F2] group-hover:shadow-[0_0_15px_#1877F2] transition-all duration-300">
                                 <Facebook size={20} className="text-[#1877F2] group-hover:text-white" />
                             </div>
                             <span className="text-[8px] text-stone-500 uppercase font-bold group-hover:text-[#1877F2]">Facebook</span>
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/30 flex items-center justify-center group-hover:bg-[#FF0000] group-hover:shadow-[0_0_15px_#FF0000] transition-all duration-300">
                                 <Youtube size={20} className="text-[#FF0000] group-hover:text-white" />
                             </div>
                             <span className="text-[8px] text-stone-500 uppercase font-bold group-hover:text-[#FF0000]">YouTube</span>
                        </a>
                         <a href="https://t.me/share/url?url=https://tehranrecords.vercel.app" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 rounded-lg bg-[#229ED9]/10 border border-[#229ED9]/30 flex items-center justify-center group-hover:bg-[#229ED9] group-hover:shadow-[0_0_15px_#229ED9] transition-all duration-300">
                                 <Send size={20} className="text-[#229ED9] group-hover:text-white" />
                             </div>
                             <span className="text-[8px] text-stone-500 uppercase font-bold group-hover:text-[#229ED9]">Telegram</span>
                        </a>
                        <a href="https://api.whatsapp.com/send?text=https://tehranrecords.vercel.app" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center group-hover:bg-[#25D366] group-hover:shadow-[0_0_15px_#25D366] transition-all duration-300">
                                 <MessageCircle size={20} className="text-[#25D366] group-hover:text-white" />
                             </div>
                             <span className="text-[8px] text-stone-500 uppercase font-bold group-hover:text-[#25D366]">WhatsApp</span>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 rounded-lg bg-[#E1306C]/10 border border-[#E1306C]/30 flex items-center justify-center group-hover:bg-[#E1306C] group-hover:shadow-[0_0_15px_#E1306C] transition-all duration-300">
                                 <Instagram size={20} className="text-[#E1306C] group-hover:text-white" />
                             </div>
                             <span className="text-[8px] text-stone-500 uppercase font-bold group-hover:text-[#E1306C]">Instagram</span>
                        </a>
                         <a href="mailto:?subject=Tehran Records&body=Check out this app!" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:shadow-[0_0_15px_white] transition-all duration-300">
                                 <Mail size={20} className="text-white group-hover:text-black" />
                             </div>
                             <span className="text-[8px] text-stone-500 uppercase font-bold group-hover:text-white">Email</span>
                        </a>
                    </div>
                </div>
            </div>

        </div>

        {/* Bottom Section - Theme & Language */}
        <div className="p-6 border-t border-stone-800 bg-inherit z-20 relative space-y-4">
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-2">
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{t('common.theme')}</span>
             <button 
                onClick={toggleTheme} 
                className="flex items-center gap-2 bg-stone-800/50 p-1 rounded-full border border-stone-700"
             >
                <div className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-transparent text-stone-500' : 'bg-gold-light text-black shadow-lg'}`}>
                   <Sun size={14} />
                </div>
                <div className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-black text-gold-light shadow-lg border border-gold-dark/50' : 'bg-transparent text-stone-500'}`}>
                   <Moon size={14} />
                </div>
             </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between px-2">
             <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{t('common.language')}</span>
             <div className="flex gap-1">
                {(['en', 'fa', 'es'] as Language[]).map(lang => (
                   <button 
                     key={lang}
                     onClick={() => setLanguage(lang)}
                     className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                       language === lang 
                       ? 'bg-gold-light text-black border-gold-light' 
                       : 'bg-transparent text-stone-500 border-stone-800 hover:border-stone-600'
                     }`}
                   >
                     {lang}
                   </button>
                ))}
             </div>
          </div>
        </div>

      </div>
    </>
  );
};


interface HeaderProps {
  cartCount: number;
  currentPage: Page;
  setPage: (page: Page) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  openSearch: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (k: string) => string;
}

// 1. Header
const Header: React.FC<HeaderProps> = ({ cartCount, currentPage, setPage, toggleTheme, isDarkMode, openSearch, language, setLanguage, t }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems: { labelKey: string; page: Page }[] = [
    { labelKey: 'nav.shop', page: 'shop' },
    { labelKey: 'nav.genres', page: 'genres' },
    { labelKey: 'nav.rarities', page: 'rarities' },
    { labelKey: 'nav.free_music', page: 'free-music' },
    { labelKey: 'nav.about', page: 'about' },
    { labelKey: 'nav.contact', page: 'contact' },
    { labelKey: 'nav.share_me', page: 'share-me' },
  ];

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        setPage={setPage} 
        currentPage={currentPage}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />

      <header className="sticky top-0 z-40 glass-header transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col w-full">
            
            {/* Top Row: Logo & Controls */}
            <div className="flex justify-between items-center h-20 relative w-full">
              
              {/* Left: Menu Trigger & Compact Toggles */}
              <div className="flex items-center gap-2 sm:gap-4 z-20">
                <button onClick={() => setIsSidebarOpen(true)} className="text-stone-400 hover:text-gold-light p-1 sm:p-2 transition-transform hover:scale-105">
                  <Menu size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7" />
                </button>
                
                {/* Compact Theme & Language - Optimized for Mobile */}
                <div className="flex flex-col gap-1 border-l border-white/10 pl-2 sm:pl-4">
                   <button onClick={toggleTheme} className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-stone-500 hover:text-gold-light uppercase tracking-wider group">
                      <div className="relative">
                         {isDarkMode ? <Sun size={10} className="sm:w-3 sm:h-3 group-hover:rotate-90 transition-transform" /> : <Moon size={10} className="sm:w-3 sm:h-3 group-hover:-rotate-12 transition-transform" />}
                      </div>
                      <span className="hidden sm:inline opacity-70 group-hover:opacity-100 transition-opacity">{t('common.theme')}</span>
                   </button>
                   <div className="flex gap-0.5 sm:gap-1">
                      {(['en', 'fa', 'es'] as Language[]).map(lang => (
                          <button 
                            key={lang} 
                            onClick={() => setLanguage(lang)}
                            className={`text-[8px] font-bold uppercase px-1 py-0.5 rounded transition-all ${
                              language === lang 
                              ? 'bg-gold-light text-black shadow-sm' 
                              : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'
                            }`}
                          >
                            {lang}
                          </button>
                      ))}
                   </div>
                </div>
              </div>

              {/* Center: Spinning Disc Logo - Visible on Mobile */}
              <div 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer z-10"
                onClick={() => setPage('home')}
              >
                 <div className="flex items-center gap-2 sm:gap-3 group">
                    {/* Gold Chrome Disc Spinning Logo */}
                    <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full gold-record shadow-[0_0_20px_rgba(170,119,28,0.6)] animate-spin-slow group-hover:animate-spin border border-[#fcf6ba]/40 overflow-hidden block">
                        <div className="absolute inset-0 logo-scan-line"></div>
                        <div className="absolute inset-0 rounded-full gold-record-shine"></div>
                        <div className="absolute inset-[35%] bg-black rounded-full border border-[#bf953f] z-10 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-gold-light rounded-full"></div>
                        </div>
                    </div>
                    
                    {/* Text */}
                    <div className="flex flex-col items-center sm:items-start">
                      <span className="font-serif font-black text-lg sm:text-2xl tracking-[0.15em] text-gold-chrome uppercase leading-none scan-text drop-shadow-md">
                        Tehran
                      </span>
                      <span className="font-sans font-bold text-[8px] sm:text-xs tracking-[0.4em] text-gold-light/80 uppercase ml-1 animate-pulse-slow">
                        Records
                      </span>
                    </div>
                 </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 sm:gap-4 z-20">
                <button onClick={openSearch} className="p-2 text-stone-400 hover:text-gold-light transition hover:drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                  <Search size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                  className="p-2 text-stone-400 hover:text-gold-light transition relative hover:drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]"
                >
                  <ShoppingBag size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Row: 7 Links (Desktop Only - 'hidden lg:flex' to keep mobile neat) */}
            <nav className="hidden lg:flex justify-center items-center gap-8 pb-4 pt-1 animate-in slide-in-from-top-2 duration-700 w-full border-t border-white/5 mt-1">
               {navItems.map(item => (
                  <button
                    key={item.page}
                    onClick={() => setPage(item.page)}
                    className={`
                      relative group text-sm font-serif font-black uppercase tracking-[0.15em] 
                      text-gold-chrome transition-all duration-300
                      hover:text-white hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]
                      ${currentPage === item.page ? 'text-white scale-105 drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]' : 'opacity-90'}
                    `}
                  >
                     <span className="relative z-10">{t(item.labelKey)}</span>
                     {/* Hover Line */}
                     <span className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-transparent via-gold-light to-transparent transition-all duration-300 ${currentPage === item.page ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>
               ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

// 2. Hero Section
const Hero: React.FC<{ setPage: (page: Page) => void; t: (k: string) => string }> = ({ setPage, t }) => {
  return (
    <div className="relative h-[80vh] overflow-hidden flex items-center justify-center bg-black">
      {/* Sunflower Spiral SVG Background */}
      <SunflowerBackground />

      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
        <div className="mb-8 relative group">
           <div className="w-32 h-32 mx-auto rounded-full gold-record p-1 shadow-[0_0_50px_rgba(197,160,89,0.4)] animate-spin-slow">
              <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center relative backdrop-blur-sm">
                 <div className="absolute w-1/3 h-1/3 bg-gradient-to-br from-[#bf953f] to-[#aa771c] rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-[10px] font-bold text-black font-serif">TR</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Updated Title: Robotica Font, Gold Chrome, Smaller Size */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-robotica font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#aa771c] mb-6 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)] tracking-wide">
          <span className="block animate-pulse-slow">{t('hero.find_music')}</span>
        </h1>
        
        <span className="text-xl sm:text-2xl font-sans font-light tracking-[0.5em] text-white uppercase block mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] opacity-90">
            {t('hero.spin_city')}
        </span>
        
        <p className="mt-8 text-lg sm:text-xl text-stone-300 max-w-3xl font-sans font-light leading-relaxed text-glow bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/5">
          {t('hero.description')}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-6 animate-float">
          <button 
            onClick={() => setPage('shop')}
            className="px-10 py-4 bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black font-bold text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(191,149,63,0.5)] border border-white/20"
          >
            {t('hero.explore')}
          </button>
          <button 
            onClick={() => setPage('genres')}
            className="px-10 py-4 border border-white/30 bg-black/40 backdrop-blur-md text-white font-bold text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            {t('hero.visit')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  t: (k: string) => string;
}

// 3. Product Card
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, t }) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi Tehran Records, I'm interested in ${product.artist} - ${product.album}`;

  return (
    <div className="group relative glass-panel transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
      <div className="relative aspect-square overflow-hidden cursor-pointer p-4 pb-0" onClick={() => onSelect(product)}>
        <div className="relative w-full h-full shadow-2xl">
            <img 
              src={product.coverImage} 
              alt={product.album} 
              className="w-full h-full object-cover z-10 relative shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                    <ArrowRight className="text-white" />
                </div>
            </div>
        </div>
        
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
           <span className="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">{product.condition}</span>
           {product.rarity !== 'Common' && (
             <span className="bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-lg">{product.rarity}</span>
           )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <h3 className="text-xl font-bold font-serif leading-tight cursor-pointer hover:text-gold-light transition-colors text-white dark:text-white" onClick={() => onSelect(product)}>
              {product.album}
            </h3>
            <p className="text-sm text-stone-400 font-sans uppercase tracking-widest mt-1 group-hover:text-gold-light/70 transition-colors">{product.artist}</p>
          </div>
          <div className="text-right">
             <p className="text-xl font-bold text-gold-chrome">${product.price}</p>
             {product.originalPrice && product.price < product.originalPrice && (
                <p className="text-xs text-stone-500 line-through">${product.originalPrice}</p>
             )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
           <div className="flex gap-3">
              <button className="text-stone-400 hover:text-red-500 transition hover:scale-110"><Heart size={20} /></button>
              <button className="text-stone-400 hover:text-blue-400 transition hover:scale-110"><Share2 size={20} /></button>
           </div>
           <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-vivid-green hover:text-white font-bold text-xs uppercase tracking-widest transition-colors px-4 py-2 border border-vivid-green/30 hover:bg-vivid-green rounded-sm"
           >
             <MessageCircle size={16} />
             <span>{t('common.buy_now')}</span>
           </a>
        </div>
      </div>
    </div>
  );
};

// 4. Product Modal
const ProductModal: React.FC<{ product: Product; onClose: () => void; t: (k: string) => string }> = ({ product, onClose, t }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-black border border-gold-dark/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row animate-float">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white z-50 transition border border-white/10 rounded-full hover:bg-white/10">
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 bg-[#050505] p-10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative w-full max-w-md aspect-square shadow-[0_0_40px_rgba(197,160,89,0.15)] group">
             <div className="absolute top-2 right-2 bottom-2 left-2 rounded-full gold-record animate-spin-slow opacity-80 group-hover:translate-x-12 transition-transform duration-1000 ease-in-out"></div>
            <img src={product.coverImage} alt={product.album} className="w-full h-full object-cover relative z-10 shadow-2xl" />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col bg-gradient-to-br from-[#111] to-black">
          <div className="mb-2 flex items-center gap-3">
             <span className="h-[1px] w-12 bg-gold-dark"></span>
             <span className="text-gold-light uppercase tracking-[0.3em] text-xs">{t('common.featured')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-none">{product.album}</h2>
          <h3 className="text-2xl text-stone-400 mb-8 font-sans font-light tracking-widest uppercase">{product.artist}</h3>

          <div className="grid grid-cols-3 gap-4 mb-8 border-y border-white/10 py-6">
             <div className="text-center border-r border-white/10">
                <span className="block text-gold-chrome text-xl font-bold mb-1">${product.price}</span>
                <span className="text-xs text-stone-500 uppercase tracking-widest">{t('common.price')}</span>
             </div>
             <div className="text-center border-r border-white/10">
                <span className="block text-white text-lg font-bold mb-1">{product.condition}</span>
                <span className="text-xs text-stone-500 uppercase tracking-widest">{t('common.condition')}</span>
             </div>
             <div className="text-center">
                <span className="block text-white text-lg font-bold mb-1">{product.year}</span>
                <span className="text-xs text-stone-500 uppercase tracking-widest">{t('common.year')}</span>
             </div>
          </div>

          <div className="space-y-6 mb-10 font-sans text-stone-300 leading-relaxed text-lg font-light">
            <p>{product.description}</p>
            <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1 border border-white/20 rounded-full text-xs text-stone-400 uppercase tracking-wider">{product.genre}</span>
               <span className="px-3 py-1 border border-white/20 rounded-full text-xs text-stone-400 uppercase tracking-wider">{product.format}</span>
               <span className="px-3 py-1 border border-gold-dark/30 rounded-full text-xs text-gold-light uppercase tracking-wider">{product.rarity}</span>
            </div>
          </div>

          <div className="mt-auto space-y-4">
             <a 
               href={`https://wa.me/${WHATSAPP_NUMBER}?text=I want to buy ${product.artist} - ${product.album}`}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full py-5 bg-vivid-green hover:bg-green-500 text-black font-bold text-lg uppercase tracking-[0.2em] text-center block transition-all shadow-[0_0_20px_rgba(0,214,70,0.3)] hover:shadow-[0_0_30px_rgba(0,214,70,0.5)]"
             >
               {t('common.inquire_whatsapp')}
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Pages Components ---

const ShopPage: React.FC<{ onSelect: (p: Product) => void; t: (k: string) => string }> = ({ onSelect, t }) => (
  <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-700">
    <div className="text-center mb-16">
      <h2 className="text-5xl font-serif font-bold text-gold-chrome mb-4">{t('common.collection')}</h2>
      <p className="text-stone-400 uppercase tracking-widest">{t('common.curated')}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {PRODUCTS.map(product => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} t={t} />
      ))}
    </div>
  </div>
);

const GenresPage: React.FC<{ onSelectGenre: (g: string) => void; t: (k: string) => string }> = ({ onSelectGenre, t }) => {
  const genresList = [
    { 
      name: FilterType.ROCK, 
      img: IMAGES.genres.rock, 
      icon: <Disc size={32} />,
      subgenres: ["Classic Rock", "Psychedelic Rock", "Progressive Rock", "Art Rock", "Hard Rock", "Proto-Punk", "Garage Rock", "Surf Rock", "Krautrock", "Southern Rock", "Blues Rock"]
    },
    { 
      name: FilterType.JAZZ, 
      img: IMAGES.genres.jazz, 
      icon: <Music size={32} />,
      subgenres: ["Bebop", "Hard Bop", "Cool Jazz", "Modal Jazz", "Free Jazz", "Jazz Fusion", "Smooth Jazz", "Swing", "Latin Jazz"]
    },
    { 
      name: "Soul / R&B", 
      img: IMAGES.genres.soul, 
      icon: <Heart size={32} />,
      subgenres: ["Classic Soul", "Motown", "Northern Soul", "Stax Soul", "Neo-Soul", "Funk", "Boogie", "Disco"]
    },
    { 
      name: "Blues", 
      img: IMAGES.genres.blues, 
      icon: <Waves size={32} />,
      subgenres: ["Chicago Blues", "Delta Blues", "Electric Blues", "Country Blues"]
    },
    { 
      name: "Reggae & Dub", 
      img: IMAGES.genres.reggae, 
      icon: <Speaker size={32} />,
      subgenres: ["Roots Reggae", "Rocksteady", "Lovers Rock", "Dub Reggae", "Dancehall Classics"]
    },
    { 
      name: FilterType.HIP_HOP, 
      img: IMAGES.genres.hiphop, 
      icon: <Mic2 size={32} />,
      subgenres: ["Golden Age Hip Hop", "Old School Hip Hop", "Boom Bap", "Underground Hip Hop", "Instrumental Hip Hop", "Trip-Hop", "Turntablism"]
    },
    { 
      name: "Electronic", 
      img: IMAGES.genres.electronic, 
      icon: <Radio size={32} />,
      subgenres: ["House", "Deep House", "Chicago House", "Detroit Techno", "Acid House", "Garage House", "Minimal Techno", "Breakbeat", "Downtempo", "Ambient", "IDM", "Electro (80s)"]
    },
    { 
      name: FilterType.POP, 
      img: IMAGES.genres.pop, 
      icon: <Speaker size={32} />,
      subgenres: ["Dream Pop", "Synthpop", "New Wave", "Italo Disco", "City Pop", "Baroque Pop", "Soft Rock", "Yacht Rock"]
    },
    { 
      name: "World / Cultural", 
      img: IMAGES.genres.world, 
      icon: <Globe size={32} />,
      subgenres: ["Persian Funk", "Persian Pop 70s", "Turkish Psych", "Ethiopian Jazz", "Afrobeat", "Highlife", "Brazilian Bossa Nova", "Samba", "MPB", "Tango", "Flamenco", "Latin Soul", "Cumbia Classics"]
    },
    { 
      name: FilterType.SOUNDTRACKS, 
      img: IMAGES.genres.soundtracks, 
      icon: <Play size={32} />,
      subgenres: ["Film Scores (70s–90s)", "Horror Soundtracks", "Italian Giallo Soundtracks", "Blaxploitation Soundtracks", "Anime Vinyl Soundtracks", "Game OST Classics"]
    },
    { 
      name: "Experimental", 
      img: IMAGES.genres.experimental, 
      icon: <Headphones size={32} />,
      subgenres: ["Avant-Garde", "Post-Rock", "Shoegaze", "Noise Rock", "No Wave", "Minimalism"]
    },
    {
      name: FilterType.METAL,
      img: IMAGES.genres.metal,
      icon: <Disc size={32} />,
      subgenres: ["Heavy Metal", "Thrash Metal", "Death Metal", "Black Metal", "Doom Metal"]
    }
  ];

  return (
    <div>
      <ParallaxSection videoUrl={GENRES_VIDEO_URL} height="h-[60vh]">
         <h1 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-white to-gold-dark mb-4 drop-shadow-2xl text-center">
            {t('genres.title')}
         </h1>
         <p className="text-xl text-stone-200 tracking-[0.2em] font-light uppercase bg-black/30 backdrop-blur-sm p-3 rounded">
            {t('genres.sub')}
         </p>
      </ParallaxSection>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {genresList.map((g) => (
            <div 
              key={g.name} 
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-stone-900/50 flex flex-col h-full shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]"
            >
              {/* Card Header / Image */}
              <div 
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => onSelectGenre(g.name)}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${g.img})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/20 transition-all duration-500"></div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full flex items-center justify-between">
                   <div>
                     <h3 className="text-3xl font-serif font-bold text-white uppercase tracking-widest leading-none drop-shadow-md">{g.name}</h3>
                     <div className="h-1 w-12 bg-gold-light mt-2 group-hover:w-full transition-all duration-700 ease-out"></div>
                   </div>
                   <div className="text-gold-light opacity-80 group-hover:scale-110 transition-transform duration-300 bg-black/50 p-2 rounded-full border border-gold-dark/30">
                     {g.icon}
                   </div>
                </div>
              </div>

              {/* Subgenres List */}
              <div className="p-6 flex-1 bg-black/40 backdrop-blur-sm border-t border-white/5">
                 <div className="flex flex-wrap gap-2">
                    {g.subgenres.map(sub => (
                       <button 
                         key={sub}
                         onClick={() => onSelectGenre(sub)}
                         className="px-3 py-1.5 text-xs text-stone-400 font-bold uppercase tracking-wider border border-white/10 rounded-full hover:border-gold-light hover:text-gold-light hover:bg-gold-light/10 transition-all duration-300"
                       >
                         {sub}
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RaritiesPage: React.FC<{ onSelect: (p: Product) => void; t: (k: string) => string }> = ({ onSelect, t }) => {
  const rares = PRODUCTS.filter(p => p.rarity !== 'Common');
  return (
    <div>
      <ParallaxSection videoUrl={RARITY_VIDEO_URL} height="h-[60vh]">
         <h2 className="text-6xl font-serif font-black text-white mb-4 drop-shadow-xl border-b-4 border-gold-dark inline-block pb-2">{t('rarities.title')}</h2>
         <p className="text-xl text-stone-200 tracking-[0.3em] uppercase font-bold bg-black/40 p-2 rounded backdrop-blur-sm">{t('rarities.sub')}</p>
      </ParallaxSection>
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {rares.map(p => (
             <ProductCard key={p.id} product={p} onSelect={onSelect} t={t} />
           ))}
        </div>
      </div>
    </div>
  );
};

const FreeMusicPage: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="min-h-screen">
       {/* Hero Section for Free Music */}
       <ParallaxSection videoUrl={FREE_MUSIC_VIDEO_URL} height="h-[60vh]">
          <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-telegram via-white to-telegram mb-4 drop-shadow-2xl animate-pulse-slow">
            {t('free_music.title')}
          </h1>
          <p className="text-xl text-stone-200 tracking-[0.2em] font-light uppercase bg-black/30 backdrop-blur-sm p-3 rounded">
            {t('free_music.sub')}
          </p>
       </ParallaxSection>

       {/* Content Section */}
       <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="glass-panel p-10 md:p-16 rounded-3xl border-telegram/20 relative overflow-hidden">
             {/* Dynamic Gift Boxes Animation */}
             <div className="flex justify-center gap-20 mb-16 relative">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="relative group">
                       <Gift 
                         size={80} 
                         className="text-gold-light drop-shadow-[0_0_15px_rgba(252,246,186,0.6)] animate-float"
                         strokeWidth={1}
                       />
                       {/* Floating Music Notes */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
                          <Music2 size={24} className="text-vivid-green absolute animate-float-up" style={{ animationDelay: `${i * 0.5}s`, left: '-10px' }} />
                          <Music size={20} className="text-telegram absolute animate-float-up" style={{ animationDelay: `${i * 0.5 + 0.5}s`, left: '10px' }} />
                          <Radio size={16} className="text-white absolute animate-float-up" style={{ animationDelay: `${i * 0.5 + 1.0}s`, top: '-10px' }} />
                       </div>
                    </div>
                 ))}
             </div>

             <div className="text-center space-y-8 relative z-10">
                <h2 className="text-4xl font-serif font-bold text-white">{t('free_music.gift')}</h2>
                <div className="space-y-6 text-lg text-stone-300 font-light leading-relaxed max-w-4xl mx-auto">
                   <p>
                     {t('free_music.p1')}
                   </p>
                   <p>
                     {t('free_music.p2')}
                   </p>
                   <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest text-stone-400 py-4">
                      <span className="px-4 py-2 border border-white/10 rounded-full flex items-center gap-2"><Disc size={16} className="text-gold-light" /> 320kbps MP3</span>
                      <span className="px-4 py-2 border border-white/10 rounded-full flex items-center gap-2"><Disc size={16} className="text-gold-light" /> WAV Format</span>
                      <span className="px-4 py-2 border border-white/10 rounded-full flex items-center gap-2"><Disc size={16} className="text-gold-light" /> Highest Quality</span>
                   </div>
                   <p>
                     {t('free_music.search')}
                   </p>
                </div>

                <div className="pt-8">
                   <a 
                     href={TELEGRAM_LINK} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-telegram text-white font-bold text-xl uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(34,158,217,0.4)] hover:shadow-[0_0_50px_rgba(34,158,217,0.8)] hover:scale-105 transition-all duration-300 group"
                   >
                     <Send size={32} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                     <span>{t('free_music.download_btn')}</span>
                   </a>
                   <p className="mt-4 text-xs text-stone-500 uppercase tracking-widest">{t('free_music.opens_telegram')}</p>
                </div>
             </div>
          </div>
       </div>

       {/* New Dashboard Section at bottom of Free Music Page */}
       <AuroraDashboard t={t} />
    </div>
  );
};

const AboutPage: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <div>
    <ParallaxSection videoUrl={ABOUT_VIDEO_URL} height="h-[60vh]">
       <h2 className="text-6xl font-serif font-black text-white drop-shadow-2xl">{t('about.title')}</h2>
       <div className="mt-4 h-1 w-24 bg-gold-dark mx-auto"></div>
    </ParallaxSection>
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
         <div className="space-y-8 animate-in slide-in-from-left-10 duration-700">
            <h2 className="text-5xl md:text-6xl font-serif font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] relative">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-scan opacity-50 pointer-events-none"></span>
                {t('about.chrome_title')}
            </h2>
            <div className="h-1 w-20 bg-gold-dark"></div>
            <p className="text-lg text-stone-300 leading-relaxed font-light">
              {t('about.p1')}
            </p>
            <p className="text-lg text-stone-300 leading-relaxed font-light">
              {t('about.p2')}
            </p>
         </div>
         <div className="relative animate-in slide-in-from-right-10 duration-700">
            <div className="absolute -inset-4 border-2 border-gold-dark/30 rounded-xl"></div>
            <video autoPlay muted loop playsInline className="rounded-xl shadow-2xl relative z-10 w-full object-cover">
               <source src={OWNER_VIDEO_URL} type="video/mp4" />
            </video>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
         <div className="p-8 glass-panel rounded-xl">
            <Disc size={48} className="mx-auto text-gold-light mb-6 animate-spin-slow" />
            <h3 className="text-xl font-serif font-bold text-white mb-4">{t('about.card1_title')}</h3>
            <p className="text-stone-400">{t('about.card1_desc')}</p>
         </div>
         <div className="p-8 glass-panel rounded-xl">
            <Speaker size={48} className="mx-auto text-gold-light mb-6" />
            <h3 className="text-xl font-serif font-bold text-white mb-4">{t('about.card2_title')}</h3>
            <p className="text-stone-400">{t('about.card2_desc')}</p>
         </div>
         <div className="p-8 glass-panel rounded-xl">
            <MessageCircle size={48} className="mx-auto text-gold-light mb-6" />
            <h3 className="text-xl font-serif font-bold text-white mb-4">{t('about.card3_title')}</h3>
            <p className="text-stone-400">{t('about.card3_desc')}</p>
         </div>
      </div>
    </div>
  </div>
);

const ContactPage: React.FC<{ t: (k: string) => string }> = ({ t }) => (
  <div>
    <ParallaxSection videoUrl={CONTACT_VIDEO_URL} height="h-[60vh]">
      <h2 className="text-6xl font-serif font-bold text-center text-white drop-shadow-2xl">{t('contact.title')}</h2>
    </ParallaxSection>
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="glass-panel p-10 rounded-2xl border border-gold-dark/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-gold-light/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         {/* Dynamic Moving Music Icons - High Definition */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             <Music size={120} className="absolute -top-10 -left-10 text-white/5 animate-float shadow-lg" />
             <Disc size={150} className="absolute top-20 -right-20 text-gold-light/5 animate-spin-slow shadow-lg" />
             <Headphones size={80} className="absolute bottom-10 left-10 text-white/5 animate-float" style={{animationDelay: '1s'}} />
             <Mic2 size={60} className="absolute bottom-20 right-20 text-white/5 animate-pulse-slow" style={{animationDelay: '2s'}} />
             <Music2 size={40} className="absolute top-1/2 left-1/2 text-gold-light/10 animate-float" style={{animationDelay: '1.5s'}} />
             <Waves size={100} className="absolute top-10 right-1/3 text-white/5 animate-pulse-slow" />
             <Speaker size={90} className="absolute top-1/4 left-1/4 text-white/5 animate-float" style={{animationDelay: '0.5s'}} />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.visit')}</h3>
                  <p className="text-stone-300">{t('contact.address')}<br/>{t('contact.city')}</p>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.management')}</h3>
                  <p className="text-stone-300">
                    <span className="font-bold text-white">{t('contact.owner_name')}</span><br/>
                    {t('contact.owner_role')}
                  </p>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.hours')}</h3>
                  <p className="text-stone-300">{t('contact.time')}<br/>{t('contact.fri')}</p>
               </div>
               <div>
                  <h3 className="text-2xl font-serif text-gold-light mb-2">{t('contact.direct')}</h3>
                  <p className="text-stone-300 flex items-center gap-2"><Mail size={16}/> {EMAIL_ADDRESS}</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 justify-center">
               <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-4 bg-vivid-green hover:bg-green-500 text-black font-bold uppercase tracking-widest rounded transition-all shadow-lg hover:shadow-green-500/30">
                  <MessageCircle size={20} /> {t('contact.whatsapp')}
               </a>
               <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-4 bg-[#229ED9] hover:bg-[#1a8bc4] text-white font-bold uppercase tracking-widest rounded transition-all shadow-lg hover:shadow-blue-500/30">
                  <Send size={20} /> {t('contact.telegram')}
               </a>
               <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest rounded transition-all backdrop-blur-md">
                  <Mail size={20} /> {t('contact.email_us')}
               </a>
            </div>
         </div>
      </div>
    </div>
  </div>
);

// New Share Me Page Component

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  color: string;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, color, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`flex flex-col items-center gap-2 text-stone-500 ${color} transition-all hover:scale-110 group`}
  >
    <div className="p-4 rounded-full border border-stone-800 bg-black/40 group-hover:bg-white/5 transition-colors">
      {icon}
    </div>
    <span className="text-[10px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
  </a>
);

const ShareMePage: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full glass-panel p-8 md:p-12 rounded-3xl border border-gold-dark/20 text-center relative overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gold-light/5 to-transparent pointer-events-none"></div>

         <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 relative z-10">{t('share.title')} <span className="text-gold-chrome">{t('share.vibe')}</span></h2>
         <p className="text-stone-400 uppercase tracking-widest text-sm mb-12 relative z-10">{t('share.invite')}</p>

         <div className="bg-white p-6 rounded-xl inline-block shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-500 relative z-10 group">
            <img
              src="https://wafisohswxqutsttotkb.supabase.co/storage/v1/object/public/Tek/QR%20CODE.png"
              alt="Scan to Visit"
              className="w-64 h-64 object-contain"
            />
            <p className="text-black text-[10px] font-bold uppercase tracking-[0.2em] mt-4 text-center">{t('share.scan')}</p>
         </div>

         <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <SocialButton href="https://t.me/share/url?url=https://tehranrecords.vercel.app" icon={<Send size={24} />} color="hover:text-[#229ED9]" label="Telegram" />
            <SocialButton href="https://api.whatsapp.com/send?text=https://tehranrecords.vercel.app" icon={<MessageCircle size={24} />} color="hover:text-[#25D366]" label="WhatsApp" />
            <SocialButton href="mailto:?subject=Tehran Records&body=https://tehranrecords.vercel.app" icon={<Mail size={24} />} color="hover:text-white" label="Email" />
            <SocialButton href="https://www.instagram.com/?url=https://tehranrecords.vercel.app" icon={<Instagram size={24} />} color="hover:text-[#E1306C]" label="Instagram" />
            <SocialButton href="https://www.linkedin.com/sharing/share-offsite/?url=https://tehranrecords.vercel.app" icon={<Linkedin size={24} />} color="hover:text-[#0077b5]" label="LinkedIn" />
            <SocialButton href="https://www.facebook.com/sharer/sharer.php?u=https://tehranrecords.vercel.app" icon={<Facebook size={24} />} color="hover:text-[#1877F2]" label="Facebook" />
            <SocialButton href="https://www.youtube.com" icon={<Youtube size={24} />} color="hover:text-[#FF0000]" label="YouTube" />
         </div>
      </div>
    </div>
  );
};

const OwnerTributeSection: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="w-full bg-black relative z-10">
      {/* Section 1: Led Zeppelin / Rarities - Split View */}
      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-white/5">
         {/* Text Side */}
         <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-4xl md:text-6xl font-serif font-black leading-tight text-white">
              {t('owner.golden_vault')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-gold-dark to-transparent"></div>
            <p className="text-lg text-stone-300 font-light leading-relaxed">
               {t('owner.p1')}
            </p>
            <p className="text-lg text-stone-300 font-light leading-relaxed">
               {t('owner.p2')}
            </p>
            <p className="text-lg text-stone-300 font-light leading-relaxed">
               {t('owner.p3')}
            </p>
         </div>
         {/* Video Side */}
         <div className="relative rounded-xl overflow-hidden shadow-[0_0_50px_rgba(170,119,28,0.15)] border border-gold-dark/30 group order-1 lg:order-2 h-[500px] bg-black">
            <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
            <video autoPlay muted loop playsInline className="w-full h-full object-contain">
                <source src={RARITY_VIDEO_URL} type="video/mp4" />
            </video>
         </div>
      </div>

      {/* Section 2: Mr. Rahman Parallax */}
      <ParallaxSection videoUrl={OWNER_VIDEO_URL} height="h-[90vh]" objectFit="cover">
          <div className="max-w-6xl mx-auto text-center px-4 relative z-20">
            <h2 className="text-6xl md:text-9xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#aa771c] mb-6 drop-shadow-[0_0_30px_rgba(197,160,89,0.5)] leading-tight tracking-tighter animate-in fade-in zoom-in duration-1000 scan-text">
                {t('owner.owner_title')}
            </h2>
            <div className="flex justify-center mb-12">
               <div className="h-1 w-32 bg-gold-light shadow-[0_0_20px_rgba(252,246,186,0.8)]"></div>
            </div>
            
            <p className="text-xl md:text-3xl text-white font-serif italic leading-relaxed mb-8 drop-shadow-lg max-w-4xl mx-auto text-glow">
               {t('owner.quote')}
            </p>

            <div className="glass-panel p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 inline-block">
               <span className="text-gold-light uppercase tracking-[0.3em] font-bold text-sm">{t('owner.role')}</span>
            </div>
          </div>
      </ParallaxSection>
    </div>
  );
};

const TurntableChat: React.FC<{ language: Language; t: (k: string) => string }> = ({ language, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t('chat.greeting'), timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref to store speech recognition instance
  const recognitionRef = useRef<any>(null);
  // NEW: Ref to store input state before speech starts for appending
  const startingInputRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const responseText = await generateChatResponse(messages, input);
    
    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setIsThinking(false);
  };

  // Voice Input Logic
  const handleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // Set language based on app state for accent handling
    switch (language) {
      case 'fa':
        recognition.lang = 'fa-IR';
        break;
      case 'es':
        recognition.lang = 'es-ES';
        break;
      default:
        recognition.lang = 'en-US';
    }

    startingInputRef.current = input;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let sessionTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        sessionTranscript += event.results[i][0].transcript;
      }
      
      const prefix = startingInputRef.current ? startingInputRef.current + (startingInputRef.current.endsWith(' ') ? '' : ' ') : '';
      setInput(prefix + sessionTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
         alert("Microphone access denied. Please enable microphone permissions in your browser or system settings to use voice features.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] bg-[#1a1a1a] rounded-t-xl rounded-bl-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-gold-dark/40 overflow-hidden flex flex-col h-[600px] animate-float backdrop-blur-xl">
          <div className="bg-gradient-to-r from