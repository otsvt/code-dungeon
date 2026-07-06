export const TECHNOLOGIES = [
  {
    id: "html",
    title: "HTML",
    iconName: "lang-html",
  },
  {
    id: "css",
    title: "CSS",
    iconName: "lang-css",
  },
  {
    id: "javascript",
    title: "JavaScript",
    iconName: "lang-js",
  },
  {
    id: "typescript",
    title: "TypeScript",
    iconName: "lang-ts",
  },
  {
    id: "react",
    title: "React",
    iconName: "lang-react",
  },
  {
    id: "vue",
    title: "Vue",
    iconName: "lang-vue",
  },
  {
    id: "git",
    title: "Git",
    iconName: "lang-git",
  },
] as const;

export type Technology = (typeof TECHNOLOGIES)[number];
export type TechnologyId = (typeof TECHNOLOGIES)[number]["id"];
