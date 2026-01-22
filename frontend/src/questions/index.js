import casual from './casual.json';
import deep from './deep.json';
import trust from './trust.json';

// Imagine questions by topic
import personality from './imagine/personality.json';
import wisdom from './imagine/wisdom.json';
import potential from './imagine/potential.json';
import adventures from './imagine/adventures.json';
import understanding from './imagine/understanding.json';
import impact from './imagine/impact.json';

// Add depth property to each question based on which file it came from
const addDepth = (questions, depth) => questions.map(q => ({ ...q, depth }));

const questions = [
  ...addDepth(casual, 'chill'),
  ...addDepth(deep, 'deep'),
  ...addDepth(trust, 'trust')
];

// Imagine questions grouped by topic
export const imagineQuestions = {
  personality,
  wisdom,
  potential,
  adventures,
  understanding,
  impact
};

export default questions;
export { casual, deep, trust };
