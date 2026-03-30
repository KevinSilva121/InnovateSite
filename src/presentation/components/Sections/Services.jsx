import { motion } from 'framer-motion';
import { Smartphone, MonitorPlay, Code2, Bot } from 'lucide-react';
import techImg from '../../assets/services_tech.png';

const services = [
  {
    icon: <Smartphone size={24} />,
    title: 'Aplicativos Mobile',
    desc: 'Desenvolvemos apps nativos e híbridos de alta performance, focados em uma experiência do usuário impecável.'
  },
  {
    icon: <MonitorPlay size={24} />,
    title: 'Sistemas Web',
    desc: 'Criação de plataformas robustas e escaláveis, utilizando arquitetura limpa e tecnologias de vanguarda.'
  },
  {
    icon: <Bot size={24} />,
    title: 'Integrações IA',
    desc: 'Implementação de inteligência artificial generativa em sistemas existentes ou novos projetos.'
  }
];

export default function Services() {
  return (
    <section id="services" style={{ background: '#ffffff', color: '#111827', padding: '8rem 0 4rem 0' }}>
      <div className="container">

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>

          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ flex: '1 1 300px', minWidth: '300px' }}
          >
            <img
              src={techImg}
              alt="Especialidades Tecnológicas"
              style={{
                width: '100%',
                borderRadius: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                objectFit: 'cover'
              }}
            />
          </motion.div>

          {/* Right Column: Text and List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ flex: '1 1 500px' }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '1rem',
              color: '#111827',
              letterSpacing: '-1px'
            }}>Nossas Especialidades</h2>
            <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              Unimos design impecável e engenharia de software de ponta para criar soluções corporativas focadas em escalabilidade.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {services.map((service, index) => (
                <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    background: 'var(--bg-primary)',
                    color: 'var(--accent-color)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
                      {service.title}
                    </h3>
                    <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ marginTop: '3rem' }}>Conheça Nossas Soluções</button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
