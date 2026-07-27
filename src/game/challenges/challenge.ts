import { type TechnologyId } from "@/entities/technology";
import { BUFFS, type BuffId } from "../types/buff";
import { DEBUFFS, type DebuffId } from "../types/debuff";

export type ChallengeLocale = "ru" | "en";

export type LocalizedChallengeText = Record<ChallengeLocale, string>;

export type ChallengeOption = {
  id: string;
  label: LocalizedChallengeText;
};

export type ChallengeQuestion = {
  id: string;
  technologyId: TechnologyId;
  prompt: LocalizedChallengeText;
  code?: string;
  options: readonly ChallengeOption[];
  correctOptionId: string;
};

export type ChallengeOutcome = "strong" | "neutral" | "weak";

export type BattleRoomReward =
  | { kind: "buff"; effectId: BuffId }
  | { kind: "debuff"; effectId: DebuffId }
  | { kind: "none"; effectId: null };

const QUESTION_BANK: readonly ChallengeQuestion[] = [
  {
    id: "html-semantic-main",
    technologyId: "html",
    prompt: { ru: "Какой элемент содержит основное уникальное содержимое страницы?", en: "Which element contains the page's main unique content?" },
    options: [
      { id: "a", label: { ru: "<section>", en: "<section>" } },
      { id: "b", label: { ru: "<main>", en: "<main>" } },
      { id: "c", label: { ru: "<article>", en: "<article>" } },
      { id: "d", label: { ru: "<body>", en: "<body>" } },
    ],
    correctOptionId: "b",
  },
  {
    id: "html-button",
    technologyId: "html",
    prompt: { ru: "Что лучше использовать для действия внутри интерфейса?", en: "What is the best element for an action inside an interface?" },
    options: [
      { id: "a", label: { ru: "<div>", en: "<div>" } },
      { id: "b", label: { ru: "<span>", en: "<span>" } },
      { id: "c", label: { ru: "<button>", en: "<button>" } },
      { id: "d", label: { ru: "<a> без href", en: "<a> without href" } },
    ],
    correctOptionId: "c",
  },
  {
    id: "css-specificity",
    technologyId: "css",
    prompt: { ru: "Какой селектор имеет наибольшую специфичность?", en: "Which selector has the highest specificity?" },
    options: [
      { id: "a", label: { ru: ".card .title", en: ".card .title" } },
      { id: "b", label: { ru: "article h2", en: "article h2" } },
      { id: "c", label: { ru: "#profile .title", en: "#profile .title" } },
      { id: "d", label: { ru: "[data-title]", en: "[data-title]" } },
    ],
    correctOptionId: "c",
  },
  {
    id: "css-flex-center",
    technologyId: "css",
    prompt: { ru: "Как распределить элементы по центру главной оси flex-контейнера?", en: "How do you center items along a flex container's main axis?" },
    options: [
      { id: "a", label: { ru: "align-items: center", en: "align-items: center" } },
      { id: "b", label: { ru: "justify-content: center", en: "justify-content: center" } },
      { id: "c", label: { ru: "place-items: center", en: "place-items: center" } },
      { id: "d", label: { ru: "text-align: center", en: "text-align: center" } },
    ],
    correctOptionId: "b",
  },
  {
    id: "js-event-loop",
    technologyId: "javascript",
    prompt: { ru: "Что выведет этот код?", en: "What does this code print?" },
    code: "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
    options: [
      { id: "a", label: { ru: "A, B, C", en: "A, B, C" } },
      { id: "b", label: { ru: "A, C, B", en: "A, C, B" } },
      { id: "c", label: { ru: "B, A, C", en: "B, A, C" } },
      { id: "d", label: { ru: "C, A, B", en: "C, A, B" } },
    ],
    correctOptionId: "b",
  },
  {
    id: "js-array-map",
    technologyId: "javascript",
    prompt: { ru: "Какой метод создаёт новый массив, применяя функцию к каждому элементу?", en: "Which method creates a new array by applying a function to every item?" },
    options: [
      { id: "a", label: { ru: "forEach", en: "forEach" } },
      { id: "b", label: { ru: "filter", en: "filter" } },
      { id: "c", label: { ru: "map", en: "map" } },
      { id: "d", label: { ru: "some", en: "some" } },
    ],
    correctOptionId: "c",
  },
  {
    id: "ts-unknown",
    technologyId: "typescript",
    prompt: { ru: "Какой тип безопаснее использовать для значения неизвестного типа?", en: "Which type is safer for a value whose type is unknown?" },
    options: [
      { id: "a", label: { ru: "any", en: "any" } },
      { id: "b", label: { ru: "unknown", en: "unknown" } },
      { id: "c", label: { ru: "never", en: "never" } },
      { id: "d", label: { ru: "object", en: "object" } },
    ],
    correctOptionId: "b",
  },
  {
    id: "ts-union",
    technologyId: "typescript",
    prompt: { ru: "Какая запись создаёт объединение строковых литералов?", en: "Which declaration creates a union of string literals?" },
    options: [
      { id: "a", label: { ru: "type State = 'idle' | 'done'", en: "type State = 'idle' | 'done'" } },
      { id: "b", label: { ru: "type State = ['idle', 'done']", en: "type State = ['idle', 'done']" } },
      { id: "c", label: { ru: "type State = string[]", en: "type State = string[]" } },
      { id: "d", label: { ru: "type State = keyof string", en: "type State = keyof string" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "react-key",
    technologyId: "react",
    prompt: { ru: "Зачем элементам списка нужен стабильный key?", en: "Why do list items need a stable key?" },
    options: [
      { id: "a", label: { ru: "Для CSS-селектора", en: "For a CSS selector" } },
      { id: "b", label: { ru: "Для сопоставления элементов при обновлении", en: "To match elements between renders" } },
      { id: "c", label: { ru: "Для передачи props", en: "To pass props" } },
      { id: "d", label: { ru: "Для сортировки массива", en: "To sort the array" } },
    ],
    correctOptionId: "b",
  },
  {
    id: "react-effect",
    technologyId: "react",
    prompt: { ru: "Где следует выполнять синхронизацию с внешней системой?", en: "Where should synchronization with an external system happen?" },
    options: [
      { id: "a", label: { ru: "В useEffect", en: "In useEffect" } },
      { id: "b", label: { ru: "В useMemo", en: "In useMemo" } },
      { id: "c", label: { ru: "В JSX", en: "In JSX" } },
      { id: "d", label: { ru: "В reducer", en: "In a reducer" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "vue-computed",
    technologyId: "vue",
    prompt: { ru: "Что использовать для производного реактивного значения?", en: "What should be used for a derived reactive value?" },
    options: [
      { id: "a", label: { ru: "computed", en: "computed" } },
      { id: "b", label: { ru: "watchEffect только", en: "watchEffect only" } },
      { id: "c", label: { ru: "provide", en: "provide" } },
      { id: "d", label: { ru: "onMounted", en: "onMounted" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "vue-key",
    technologyId: "vue",
    prompt: { ru: "Какая директива выводит список элементов?", en: "Which directive renders a list of items?" },
    options: [
      { id: "a", label: { ru: "v-if", en: "v-if" } },
      { id: "b", label: { ru: "v-bind", en: "v-bind" } },
      { id: "c", label: { ru: "v-for", en: "v-for" } },
      { id: "d", label: { ru: "v-model", en: "v-model" } },
    ],
    correctOptionId: "c",
  },
  {
    id: "git-rebase",
    technologyId: "git",
    prompt: { ru: "Какая команда переносит локальные коммиты поверх обновлённой ветки?", en: "Which command reapplies local commits on top of an updated branch?" },
    options: [
      { id: "a", label: { ru: "git stash", en: "git stash" } },
      { id: "b", label: { ru: "git rebase", en: "git rebase" } },
      { id: "c", label: { ru: "git reset", en: "git reset" } },
      { id: "d", label: { ru: "git tag", en: "git tag" } },
    ],
    correctOptionId: "b",
  },
  {
    id: "git-stage",
    technologyId: "git",
    prompt: { ru: "Какая команда добавляет изменения в индекс?", en: "Which command adds changes to the staging area?" },
    options: [
      { id: "a", label: { ru: "git add", en: "git add" } },
      { id: "b", label: { ru: "git push", en: "git push" } },
      { id: "c", label: { ru: "git log", en: "git log" } },
      { id: "d", label: { ru: "git switch", en: "git switch" } },
    ],
    correctOptionId: "a",
  },
];

export function getChallengeQuestions(
  technologyId: TechnologyId,
  count = 2,
): ChallengeQuestion[] {
  const available = QUESTION_BANK.filter(
    (question) => question.technologyId === technologyId,
  );

  return available
    .slice(0, Math.min(count, available.length))
    .map((question, index) => {
      if (index !== 1) {
        return question;
      }

      return {
        ...question,
        prompt: {
          ru: `${question.prompt.ru} Выберите наиболее корректное решение для большого production-интерфейса, учитывая доступность, предсказуемость поведения, поддержку командой и возможное расширение требований в будущем.`,
          en: `${question.prompt.en} Choose the most appropriate solution for a large production interface, considering accessibility, predictable behavior, team maintenance, and future requirement changes.`,
        },
        options: question.options.map((option) => ({
          ...option,
          label: {
            ru: `${option.label.ru} — развёрнутый вариант ответа с пояснением предполагаемого поведения в сложном пользовательском интерфейсе`,
            en: `${option.label.en} — an expanded answer describing the expected behavior in a complex production interface`,
          },
        })),
      };
    });
}

export function resolveChallengeOutcome(
  correctAnswers: number,
  totalAnswers: number,
): ChallengeOutcome {
  if (totalAnswers > 0 && correctAnswers === totalAnswers) {
    return "strong";
  }

  if (correctAnswers === 0) {
    return "weak";
  }

  return "neutral";
}

export function createBattleRoomReward(
  outcome: ChallengeOutcome,
  random: () => number = Math.random,
): BattleRoomReward {
  if (outcome === "strong") {
    const buff = BUFFS[Math.floor(random() * BUFFS.length)] ?? BUFFS[0];
    return { kind: "buff", effectId: buff.id };
  }

  if (outcome === "weak") {
    const debuff = DEBUFFS[Math.floor(random() * DEBUFFS.length)] ?? DEBUFFS[0];
    return { kind: "debuff", effectId: debuff.id };
  }

  return { kind: "none", effectId: null };
}
