'use client';

import { X } from 'lucide-react';
import { Drawer } from 'vaul';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import Resume from '@/components/resume';
import { dock } from '@/data/portfolio';
import { getAnswerById } from '@/lib/scripted-chat';
import { useSheet } from '@/lib/sheet-store';
import CertsCard from './CertsCard';
import QuestionsPanel from './QuestionsPanel';

/** A scripted answer (card + reply), the same content the chat shows. */
function AnswerPanel({ id }) {
  const answer = getAnswerById(id);
  return <SimplifiedChatView reply={{ card: answer.card, text: answer.reply }} />;
}

const SPECIAL = {
  certifications: () => <CertsCard />,
  resume: () => <Resume />,
  questions: () => <QuestionsPanel />,
};
const TITLES = { resume: 'Résumé', questions: 'All questions' };

/** One glass sheet over the story, driven by the sheet store (tiles, dock, nav, close). */
export default function DockSheet() {
  const [id, , closeSheet] = useSheet();
  const title = TITLES[id] ?? dock.find((d) => d.id === id)?.label ?? '';
  const Special = id ? SPECIAL[id] : null;

  return (
    <Drawer.Root open={!!id} onOpenChange={(open) => !open && closeSheet()}>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay" />
        <Drawer.Content className="sheet glass" aria-describedby={undefined}>
          <div className="sheet-handle" aria-hidden="true" />
          <div className="sheet-bar">
            <Drawer.Title className="sheet-title">{title}</Drawer.Title>
            <button type="button" className="sheet-close" onClick={closeSheet} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="sheet-body" data-lenis-prevent>
            {id && (Special ? <Special /> : <AnswerPanel id={id} />)}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
