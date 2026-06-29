"use client";

import dynamic from "next/dynamic";

const PhaserSpikeClient = dynamic(() => import("./PhaserSpikeClient"), {
  ssr: false,
});

export default function PhaserSpikeImported() {
  return <PhaserSpikeClient />;
}
