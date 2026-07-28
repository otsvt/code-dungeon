import { type TechnologyId } from "@/entities/technology";
import {
  type BattleRoomReward,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "../../domain/challenge/types";
import { type HrRoomReward } from "../../domain/room/hrRoom";
import { type EffectId } from "../../types/effect";
import { type Impression } from "../../types/run";

export type ChallengeRequest =
  | {
      kind: "battle";
      roomId: string;
      technologyId: TechnologyId;
      activeEffectIds: readonly EffectId[];
    }
  | {
      kind: "hr";
      roomId: string;
      impression: Impression;
      activeEffectIds: readonly EffectId[];
    };

export type ActiveChallenge =
  | {
      kind: "battle";
      roomId: string;
      technologyId: TechnologyId;
      activeEffectIds: readonly EffectId[];
      questions: ChallengeQuestion[];
    }
  | {
      kind: "hr";
      roomId: string;
      impression: Impression;
      allowedMistakes: number;
      activeEffectIds: readonly EffectId[];
      questions: ChallengeQuestion[];
    };

export type ChallengeResult =
  | {
      kind: "battle";
      roomId: string;
      outcome: ChallengeOutcome;
      reward: BattleRoomReward;
    }
  | {
      kind: "hr";
      roomId: string;
      outcome: ChallengeOutcome;
      reward: HrRoomReward;
    };
