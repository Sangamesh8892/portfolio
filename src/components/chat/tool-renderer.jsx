import { Contact } from '../contact';
import InternshipCard from '../InternshipCard';
import { Presentation } from '../presentation';
import AllProjects from '../projects/AllProjects';
import Resume from '../resume';
import Skills from '../skills';
import Sports from '../sport';

/** Maps a scripted answer's `card` to the component shown above its reply. */
export default function CardRenderer({ card }) {
  const content = (() => {
    switch (card) {
      case 'about':
        return <Presentation />;
      case 'projects':
        return <AllProjects />;
      case 'skills':
        return <Skills />;
      case 'resume':
        return <Resume />;
      case 'contact':
        return <Contact />;
      case 'fun':
        return <Sports />;
      case 'availability':
        return <InternshipCard />;
    }
  })();

  return (
    <div
      className={`w-full rounded-lg transition-all duration-300 ${card === 'projects' || card === 'about' ? 'overflow-hidden' : ''}`}
    >
      {content}
    </div>
  );
}
