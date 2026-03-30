import { ChevronDown, Menu, X, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo-ai.png';

export default function Navbar({ isScrolled }) {
  const [isOpen, setIsOpen] = useState(false);

  // Example subset of corporate links
  const navLinks = [
    { title: 'Soluções Corporativas', hasDropdown: true },
    { title: 'Produtos', hasDropdown: true },
    { title: 'Segmentos', hasDropdown: true },
    { title: 'Sobre', hasDropdown: true }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-10`}
      style={{
        transition: 'background-color 0.5s ease, padding 0.5s ease, backdrop-filter 0.5s ease',
        padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        background: isScrolled ? '#000B29' : 'transparent',
        backdropFilter: isScrolled ? 'none' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 50 }}>
          {/* Brand Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mixBlendMode: 'screen', // Drops pure black/dark background to make the logo fake-transparent
          }}>
             <img src={logoImg} alt="Logotipo da empresa" style={{ height: '44px', objectFit: 'contain' }} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', display: 'block', letterSpacing: '-0.5px' }}>Innovate Apps Co.</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }} className="nav-desktop">
          {navLinks.map((link, idx) => (
             <a href={`#${link.title}`} key={idx} className="nav-link" style={{ 
               fontWeight: 600, 
               fontSize: '0.95rem', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '6px',
               color: 'var(--text-secondary)',
               transition: 'color 0.3s ease'
             }}>
               {link.title} {link.hasDropdown && <ChevronDown size={16} />}
             </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="nav-actions">
           <a href="#contact" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', gap: '6px' }}>
              Falamos com Você <ArrowRight size={14} />
           </a>
           <a href="#client" className="btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', gap: '6px', display: 'flex' }}>
              Sou Cliente <User size={14} />
           </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="menu-button" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ color: 'var(--text-primary)', display: 'block', zIndex: 50 }}
        >
          {isOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>
      </div>

      {/* Mobile Nav */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? '100vh' : 0, opacity: isOpen ? 1 : 0 }}
        style={{ overflow: 'hidden', background: 'var(--bg-primary)', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 40 }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', paddingTop: '100px', paddingBottom: '2rem', gap: '2rem' }}>
          {navLinks.map((link, idx) => (
              <a href={`#${link.title}`} key={idx} onClick={() => setIsOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 700 }}>{link.title}</a>
          ))}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <a href="#contact" className="btn-primary" style={{ textAlign: 'center', width: '100%' }}>Falamos com Você</a>
             <a href="#client" className="btn-outline" style={{ textAlign: 'center', width: '100%' }}>Sou Cliente</a>
          </div>
        </div>
      </motion.div>
      <style>{`
        .nav-link:hover {
          color: var(--text-primary) !important;
        }
        @media (min-width: 1024px) {
          .nav-desktop { display: flex !important; }
          .nav-actions { display: flex !important; }
          .menu-button { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
