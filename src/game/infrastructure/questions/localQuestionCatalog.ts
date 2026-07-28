import battleQuestionsJson from "./data/battle-questions.json";
import hrQuestionsJson from "./data/hr-questions.json";
import { mapQuestionDto } from "./mapQuestionDto";
import { parseQuestionCatalog } from "./parseQuestionCatalog";

const battleQuestions = parseQuestionCatalog(
  battleQuestionsJson,
  "battle",
).questions.map(mapQuestionDto);

const hrQuestions = parseQuestionCatalog(
  hrQuestionsJson,
  "hr",
).questions.map(mapQuestionDto);

export function getLocalBattleQuestions() {
  return battleQuestions;
}

export function getLocalHrQuestions() {
  return hrQuestions;
}
