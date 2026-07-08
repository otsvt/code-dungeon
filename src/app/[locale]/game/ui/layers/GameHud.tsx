import { CurrentRun } from "@/game/types/run";
import { useState } from "react";

interface GameHudProps {
  currentRun: CurrentRun;
}

export function GameHud({ currentRun }: GameHudProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHud = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="absolute left-0 right-0 bottom-10 px-40 z-20 flex justify-center gap-x-3">
      <button onClick={toggleHud} className="absolute bottom-0 left-20 size-16 rounded-full border border-decore">
        <div className="flex-center text-2xl">👤</div>
      </button>
      {isOpen && (
        <div className="w-full p-4 rounded-xl border border-decore bg-background">
          <div className="*:p-4 flex items-center divide-x divide-accent gap-x-2">
            <div>Жизнь</div>
            <div>Состояние</div>
            <div className="w-120 grid gap-y-4">
              <div>Бафы</div>
              <div>Дебафы</div>
            </div>
            <div>Вопросов</div>
            <div>Язык</div>
            <div>Сложность</div>
            <div>Таймер</div>
            <div>Подсказки</div>
          </div>
        </div>
      )}
    </div>
  );
}
