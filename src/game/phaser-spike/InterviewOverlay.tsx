import Image from "next/image";

type InterviewOverlayProps = {
  onClose: () => void;
};

export function InterviewOverlay({ onClose }: InterviewOverlayProps) {
  return (
    <div className="absolute inset-0 flex-center bg-foreground/75">
      <article className="max-w-5xl w-full grid text-xl">
        <div className="flex items-center">
          <div className="p-4 grow bg-white border-4 border-amber-500">Варианты</div>
          <Image src="/assets/phaser-spike/spirit-test.png" alt="Spirit" width={360} height={420} />
        </div>
        <p className="p-4 bg-white border-4 border-amber-500">Текст</p>
      </article>
      <button className="font-bold text-red-500" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
}
