"use client";

import { useTranslations } from "next-intl";
import { TECHNOLOGIES } from "@/entities/technology";
import { SpriteIcon } from "@/shared/ui/sprite-icon";
import { SetupPanel } from "./SetupPanel";
import { useRunSetup } from "../hooks/useRunSetup";
import { POOL_MODES } from "../model/runSetupOptions";
import { DecoreRhombus } from "@/shared/ui/decore";

export function SetupForm() {
  const t = useTranslations("RunSetup");

  const { poolModeId, selectedTechnologyIds, changePoolModeId, toggleCustomTechnologyId } = useRunSetup();

  return (
    <article className="relative mb-6 p-2 grid grid-cols-3 gap-x-4 rounded-xl border border-decore bg-pure">
      <SetupPanel title={t("poolMode.title")} description={t("poolMode.description")}>
        <div className="h-50 w-full py-2 grid grid-cols-3 gap-2 items-start">
          {POOL_MODES.map((mode) => (
            <label
              key={mode.id}
              className="relative p-2 flex items-center gap-x-2 rounded-md border border-decore cursor-pointer select-none hover:bg-decore/10 has-checked:bg-decore/20"
            >
              <SpriteIcon id={mode.iconName} className="h-10 w-10" />
              <span>{mode.id}</span>
              <input
                type="radio"
                name="pool-mode"
                className="sr-only peer"
                value={mode.id}
                checked={mode.id === poolModeId}
                onChange={() => {
                  changePoolModeId(mode.id);
                }}
              />
              <div className="absolute -top-1 -right-1 hidden h-4 w-4 justify-center items-center rounded-full bg-decore peer-checked:flex">
                <SpriteIcon id="check" className="h-3 w-3 text-white" />
              </div>
            </label>
          ))}
        </div>
      </SetupPanel>
      <SetupPanel title={t("technologies.title")} description={t("technologies.description")}>
        <div className="h-50 w-full py-2 pr-2 grid grid-cols-3 gap-2 items-start overflow-y-scroll scrollbar-primary">
          {TECHNOLOGIES.map((tech) => (
            <label
              key={tech.id}
              className="relative p-2 flex items-center gap-x-2 rounded-md border border-decore select-none hover:bg-decore/10 has-checked:bg-decore/20 has-disabled:opacity-50"
            >
              <SpriteIcon id={tech.iconName} className="h-10 w-10" />
              <span>{tech.title}</span>
              <input
                type="checkbox"
                value={tech.id}
                disabled={poolModeId !== "custom"}
                checked={selectedTechnologyIds.includes(tech.id)}
                className="sr-only peer"
                onChange={() => {
                  toggleCustomTechnologyId(tech.id);
                }}
              />
              <div className="absolute -top-1 -right-1 hidden h-4 w-4 justify-center items-center rounded-full bg-decore peer-checked:flex">
                <SpriteIcon id="check" className="h-3 w-3 text-white" />
              </div>
            </label>
          ))}
        </div>
      </SetupPanel>
      <SetupPanel title={t("briefing.title")} description={t("briefing.description")}>
        <div className="flex h-50 w-full flex-col justify-between py-2">
          <ul className="space-y-2 text-sm text-pale">
            <li>{t("briefing.items.setup")}</li>
            <li className="flex justify-center">
              <DecoreRhombus type="bg" />
            </li>
            <li>{t("briefing.items.minimum")}</li>
            <li className="flex justify-center">
              <DecoreRhombus type="bg" />
            </li>
            <li>{t("briefing.items.rooms")}</li>
            <li className="flex justify-center">
              <DecoreRhombus type="bg" />
            </li>
            <li>{t("briefing.items.goal")}</li>
          </ul>
        </div>
      </SetupPanel>
    </article>
  );
}
