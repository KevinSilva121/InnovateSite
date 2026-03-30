import { motion } from 'framer-motion';
import techBg from '../../assets/blurred_hologram_bg.png';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  };

  const scrollDown = () => {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a001a'
      }}
    >
      {/* Animated Blurred Tech Background */}
      <motion.div
        animate={{ scale: [1.05, 1.15, 1.05], x: [0, 20, -20, 0], y: [0, -10, 15, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 25, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage: `url(${techBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-text-content"
          style={{ maxWidth: '600px', paddingBottom: '6rem' /* Leaves room for the bottom wave */ }}
        >
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              marginBottom: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-primary)'
            }}
          >
            Inovação na <br /> <span style={{ color: 'var(--accent-color)' }}>Prática!</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              marginBottom: '3rem',
              maxWidth: '450px',
              fontWeight: 500
            }}
          >
            Participe da transformação digital com a mais avançada tecnologia e desenvolvimento ágil do Brasil.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex' }}>
            <button className="btn-primary" style={{ fontSize: '0.875rem' }} onClick={scrollDown}>
              COMECE SEU PROJETO
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
