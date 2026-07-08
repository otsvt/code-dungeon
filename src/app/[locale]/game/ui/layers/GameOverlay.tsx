import { useState } from "react";

export function GameOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return null;
  }

  return <div className="absolute inset-0 z-10 bg-black/50"></div>;
}
