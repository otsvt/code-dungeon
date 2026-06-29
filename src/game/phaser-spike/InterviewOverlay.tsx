import Image from "next/image";

type InterviewOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function InterviewOverlay({ isOpen, onClose }: InterviewOverlayProps) {
  return (
    <div
      className={[
        "absolute inset-0 z-10 flex-center bg-foreground/75 transition-opacity duration-300 ease-out",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <article
        className={[
          "grid w-full max-w-5xl text-xl transition-all duration-300 ease-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        ].join(" ")}
      >
        <div className="flex items-center">
          <div className="grow border-4 border-amber-500 bg-white p-4">Варианты</div>
          <div
            className={[
              "transition-all duration-300 ease-out",
              isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0",
            ].join(" ")}
          >
            <Image src="/assets/phaser-spike/spirit-test.png" alt="Spirit" width={360} height={420} priority />
          </div>
        </div>
        <p className="border-4 border-amber-500 bg-white p-4">Текст</p>
      </article>
      <button className="absolute right-8 top-8 rounded-lg bg-white px-4 py-2 font-bold text-red-500" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
}
