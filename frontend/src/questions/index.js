import casual from './casual.json';
import deep from './deep.json';
import trust from './trust.json';

// Add depth property to each question based on which file it came from
const addDepth = (questions, depth) => questions.map(q => ({ ...q, depth }));

const questions = [
  ...addDepth(casual, 'chill'),
  ...addDepth(deep, 'deep'),
  ...addDepth(trust, 'trust')
];

export default questions;
export { casual, deep, trust };
