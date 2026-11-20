import { answers, fallbackAnswer } from '@/data/portfolio';

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Score each answer by the keywords found in the question and return the best.
 * Longer keyword hits weigh more, so "available for work" lands on
 * availability rather than projects. Keywords match at the start of a word
 * ("project" matches "projects"); keywords of 3 letters or fewer must match a
 * whole word so "cv" doesn't fire inside other words.
 */
export function findAnswer(question) {
  const text = question.toLowerCase();
  let best = fallbackAnswer;
  let bestScore = 0;

  for (const answer of answers) {
    let score = 0;
    for (const kw of answer.keywords) {
      const tail = kw.length <= 3 ? '\\b' : '';
      if (new RegExp(`\\b${escape(kw)}${tail}`).test(text)) score += kw.length;
    }
    if (score > bestScore) {
      best = answer;
      bestScore = score;
    }
  }
  return best;
}

export function getAnswerById(id) {
  return answers.find((a) => a.id === id) ?? fallbackAnswer;
}
