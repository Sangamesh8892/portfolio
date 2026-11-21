import { Award } from 'lucide-react';
import { certifications } from '@/data/portfolio';

export default function CertsCard() {
  return (
    <div className="certs">
      <h2>Certifications</h2>
      <ul>
        {certifications.map((c) => (
          <li key={c.name} className="glass">
            <span className="certs-ic">
              <Award size={20} aria-hidden="true" />
            </span>
            <span>
              <b>{c.name}</b>
              <small>{c.issuer}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
