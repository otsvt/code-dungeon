export const POOL_MODES = [
  {
    id: "frontend",
    technologyIds: ["javascript", "typescript", "html", "css", "react", "vue", "git"],
  },
  {
    id: "custom",
    technologyIds: [],
  },
] as const;

export const DIFFICULTIES = [
  {
    id: "normal",
  },
  {
    id: "hard",
  },
] as const;
