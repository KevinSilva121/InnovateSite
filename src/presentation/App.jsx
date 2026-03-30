import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Navbar from './components/Layout/Navbar.jsx';
import Hero from './components/Sections/Hero.jsx';
import Services from './components/Sections/Services.jsx';
import Portfolio from './components/Sections/Portfolio.jsx';
import Footer from './components/Layout/Footer.jsx';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleMouseMove = (e) => {
      if(cursorRef.current && followerRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        
        followerRef.current.style.left = `${e.clientX}px`;
        followerRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      if(e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')) {
        cursorRef.current.classList.add('hovering');
      } else {
        cursorRef.current.classList.remove('hovering');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    }
  }, []);

  return (
    <div className="bg-grid">
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="custom-cursor-follower" ref={followerRef}></div>
      <Navbar isScrolled={isScrolled} />
      <main>
        <Hero />
        <Services />
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}

export default App;
