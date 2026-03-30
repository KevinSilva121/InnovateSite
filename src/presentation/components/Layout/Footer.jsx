import { Github, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(242, 239, 233, 0.05)', paddingTop: '4rem', paddingBottom: '2rem', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        <div>
           <div style={{
            background: 'var(--accent-color)',
            color: 'var(--bg-primary)',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontSize: '1.25rem',
            marginBottom: '1rem'
          }}>
            ia
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Innovate Apps Co.</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Construindo o futuro digital, uma linha de código por vez. Design inovador e performance absoluta.
          </p>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Navegação</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="#services" style={{ color: 'var(--text-secondary)' }}>Serviços</a></li>
            <li><a href="#portfolio" style={{ color: 'var(--text-secondary)' }}>Portfólio</a></li>
            <li><a href="#about" style={{ color: 'var(--text-secondary)' }}>Sobre Nós</a></li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Contato</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><a href="mailto:contato@innovateapps.dev" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16}/> contato@innovateapps.dev</a></li>
          </ul>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)' }}><Instagram size={24} /></a>
            <a href="#" style={{ color: 'var(--text-secondary)' }}><Linkedin size={24} /></a>
            <a href="https://github.com/kevinsilva121" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}><Github size={24} /></a>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ borderTop: '1px solid rgba(242, 239, 233, 0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Innovate Apps Co. Todos os direitos reservados.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          By Kevin Silva
        </p>
      </div>
    </footer>
  );
}
