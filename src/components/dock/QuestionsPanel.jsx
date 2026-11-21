'use client';

import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { questionDrawer } from '@/data/portfolio';
import { findAnswer } from '@/lib/scripted-chat';

/** Every scripted question, grouped. Tapping one shows its answer and card in place. */
export default function QuestionsPanel() {
  const [question, setQuestion] = useState(null);

  if (question) {
    const answer = findAnswer(question);
    return (
      <div className="questions">
        <button type="button" className="questions-back" onClick={() => setQuestion(null)}>
          <ArrowLeft size={16} aria-hidden="true" /> All questions
        </button>
        <h2>{question}</h2>
        <SimplifiedChatView reply={{ card: answer.card, text: answer.reply }} />
      </div>
    );
  }

  return (
    <div className="questions">
      <h2>Ask me anything (from the list)</h2>
      {questionDrawer.categories.map((cat) => (
        <section key={cat.id}>
          <small>{cat.name}</small>
          <ul>
            {cat.questions.map((q) => (
              <li key={q}>
                <button type="button" onClick={() => setQuestion(q)}>
                  <span>{q}</span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
