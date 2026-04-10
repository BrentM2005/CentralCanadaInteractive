import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import { Command } from 'cmdk';
import { Map, BarChart2, Search, ChevronRight, Trees, Building2, Hotel } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { FaGithub } from 'react-icons/fa';

export const Home = () => {
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const navigate = useNavigate();

  // Handle Cmd+K / Ctrl+K shortcut for the Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdkOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const heroSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.molasses,
    delay: 200,
  });

  const btnSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.wobbly,
    delay: 600,
  });

  const cards = [
    { title: 'Niagara Falls', img: 'https://mlyzq52kv3tt.i.optimole.com/cb:CZU-.baa/w:1920/h:1228/q:mauto/g:sm/f:best/https://tourstoniagarafalls.com/wp-content/uploads/2025/01/Niagara-Falls-Day-and-Evening-Tour-From-Toronto.jpg', icon: Trees, label: 'Ontario' },
    { title: 'Toronto', img: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Toronto_skyline%2C_2024_%2852592814618%29.jpg', icon: Hotel, label: 'Ontario' },
    { title: 'Montreal', img: 'https://cdn.authentik.com/canada/uploads/images/orig/dec_montreal/1-centre-ville-montreal.jpg', icon: Building2, label: 'Quebec' },
  ];

  const trail = useTrail(cards.length, {
    from: { opacity: 0, transform: 'scale(0.9) translateY(20px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    config: config.gentle,
    delay: 800,
  });

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas dpr={[1, 1.5]}>
          <Fluid 
            fluidColor="#E4002B" 
            backgroundColor="#0A0A0A" 
            force={2.5} 
            radius={0.3} 
            curl={10} 
            swirl={5} 
            distortion={1} 
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-transparent to-[#E4002B]/10 pointer-events-none" />

      <div className="relative z-20 w-full flex justify-between items-center px-6 py-6 max-w-screen-2xl mx-auto">
        <div className="text-[#E4002B] font-black text-2xl tracking-tighter flex items-center gap-2">
          <Map className="w-8 h-8" />
          <span>Central<span className="text-white"> Canada</span></span>
        </div>
        <button
          onClick={() => setCmdkOpen(true)}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors active:scale-95"
        >
          <Search className="w-4 h-4 text-white/70" />
          <span className="hidden sm:inline text-white/70">Search actions...</span>
          <kbd className="hidden sm:inline-block bg-black/30 border border-white/10 px-2 py-0.5 rounded text-xs text-white/50 ml-2">
            ⌘K
          </kbd>
          <span className="sm:hidden text-white/70">Menu</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-8 pb-16">
        <animated.div style={heroSpring} className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-8 inline-flex items-center gap-x-2.5 bg-white/5 backdrop-blur-3xl px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium tracking-wide">
            <span className="text-xl">🇨🇦</span>
            ONTARIO • QUÉBEC
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-[-2px] leading-[0.9] drop-shadow-2xl">
            CENTRAL
            <span className="block mt-2 bg-gradient-to-br from-[#E4002B] via-red-400 to-[#E4002B] bg-clip-text text-transparent">
              CANADA
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-xl font-light text-white/70 leading-relaxed">
            Interactive quizzes & polls to test your knowledge and share your voice on Central Canada.
          </p>
        </animated.div>

        <animated.div style={btnSpring} className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto z-20">
          <Link
            to="/quiz"
            className="flex-1 flex items-center justify-center gap-x-3 bg-white text-[#0A0A0A] font-bold text-xl py-5 px-8 rounded-3xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] active:scale-[0.97] transition-all"
          >
            Take the Quiz <Map className="w-6 h-6" />
          </Link>
          <Link
            to="/poll"
            className="flex-1 flex items-center justify-center gap-x-3 border-2 border-white/20 bg-black/20 backdrop-blur-md font-bold text-xl py-5 px-8 rounded-3xl hover:bg-white/10 hover:border-white/50 active:scale-[0.97] transition-all"
          >
            Take the Poll <BarChart2 className="w-6 h-6" />
          </Link>
        </animated.div>
      </div>

      <div className="relative z-10 w-full bg-gradient-to-t from-[#050505] to-transparent pt-12 pb-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
            {trail.map((style, index) => {
              const card = cards[index];
              const Icon = card.icon;
              return (
                <animated.div
                  key={card.title}
                  style={style}
                  className="min-w-[300px] snap-center bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 md:min-w-0 hover:-translate-y-2 transition-transform duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  </div>
                  <div className="p-8 pt-0 relative -mt-6">
                    <div className="w-12 h-12 bg-[#E4002B] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#E4002B]/30 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="uppercase text-white/40 text-xs font-bold tracking-widest mb-1">{card.label}</div>
                    <h3 className="text-2xl font-bold">{card.title}</h3>
                  </div>
                </animated.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CMDK Dialog */}
      <Command.Dialog 
        open={cmdkOpen} 
        onOpenChange={setCmdkOpen}
        label="Global Command Menu"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_-20px_rgba(228,0,43,0.3)] z-50 flex flex-col"
      >
        <div className="flex items-center px-4 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-white/50 mr-3" />
          <Command.Input 
            placeholder="Where do you want to go?" 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-lg"
          />
          <button onClick={() => setCmdkOpen(false)} className="bg-white/10 p-1.5 rounded-lg text-white/50 hover:text-white">
            <kbd className="text-xs font-mono">ESC</kbd>
          </button>
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="p-8 text-center text-white/50">No results found.</Command.Empty>
          
          <Command.Group heading="Activities" className="text-white/40 text-xs font-semibold px-2 py-2 tracking-wider">
            <Command.Item 
              onSelect={() => navigate('/quiz')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[#E4002B]/20 aria-selected:text-[#E4002B] text-white transition-colors"
            >
              <Map className="w-5 h-5" /> Take the Quiz
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </Command.Item>
            <Command.Item 
              onSelect={() => navigate('/poll')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[#E4002B]/20 aria-selected:text-[#E4002B] text-white transition-colors"
            >
              <BarChart2 className="w-5 h-5" /> Take the Poll
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </Command.Item>
            <Command.Item 
              onSelect={() => window.open('https://github.com/BrentM2005/CentralCanadaInteractive', '_blank')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[#E4002B]/20 aria-selected:text-[#E4002B] text-white transition-colors"
            >
              <FaGithub className="w-5 h-5" /> GitHub
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>

      {cmdkOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
          onClick={() => setCmdkOpen(false)}
        />
      )}
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};