import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { ProjectRepository } from '../../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../../domain/usecases/GetProjects.js';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const repository = new ProjectRepository();
      const getProjectsUseCase = new GetProjects(repository);
      const data = await getProjectsUseCase.execute();
      setProjects(data);
    };
    fetchProjects();
  }, []);
  return (
    <section id="portfolio" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 className="section-title">Cases de Sucesso</h2>
              <p className="section-subtitle" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Nossa excelência medida em produtos reais e resultados.
              </p>
            </div>
            <a href="https://github.com/kevinsilva121" target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Ver Github <ExternalLink size={20} />
            </a>
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {projects.map((project, index) => (
            <motion.a
               key={index}
               href={project.url}
               target="_blank"
               rel="noreferrer"
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'minmax(250px, 1fr) 2fr auto',
                 gap: '2rem',
                 alignItems: 'center',
                 padding: '2rem',
                 borderRadius: 'var(--radius-lg)',
                 background: 'rgba(18, 28, 56, 0.4)',
                 border: '1px solid rgba(242, 239, 233, 0.05)',
                 transition: 'all 0.3s ease',
                 cursor: 'pointer'
               }}
               whileHover={{
                 x: 10,
                 background: 'rgba(242, 239, 233, 0.02)',
                 borderColor: 'rgba(242, 239, 233, 0.15)'
               }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
                  {project.category}
                </span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>{project.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {project.desc}
              </p>
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-45deg)' /* pointing up-right */
                }}
              >
                <ExternalLink size={20} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
