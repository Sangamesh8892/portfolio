'use client';

import { X } from 'lucide-react';
import { Drawer } from 'vaul';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import Resume from '@/components/resume';
import AgentDetail from '@/components/story/AgentDetail';
import { agents, dock } from '@/data/portfolio';
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
  // 'agent:<id>' opens that agent's full details
  const agentId = id?.startsWith('agent:') ? id.slice(6) : null;
  const title = agentId
    ? agents.find((a) => a.id === agentId)?.name ?? ''
    : TITLES[id] ?? dock.find((d) => d.id === id)?.label ?? '';
  const Special = agentId ? () => <AgentDetail id={agentId} /> : id ? SPECIAL[id] : null;

  return (
    <Drawer.Root open={!!id} onOpenChange={(open) => !open && closeSheet()}>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay" />
        {/* vaul draws its own ::after on Drawer.Content, so the glass lives on an inner panel */}
        <Drawer.Content className="sheet" aria-describedby={undefined}>
          <div className="sheet-panel glass">
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
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
