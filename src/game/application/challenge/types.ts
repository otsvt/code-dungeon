import { type TechnologyId } from "@/entities/technology";
import {
  type BattleRoomReward,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "../../domain/challenge/types";
import { type HrRoomReward } from "../../domain/room/hrRoom";
import { type Impression } from "../../types/run";

export type ChallengeRequest =
  | {
      kind: "battle";
      roomId: string;
      technologyId: TechnologyId;
    }
  | {
      kind: "hr";
      roomId: string;
      impression: Impression;
    };

export type ActiveChallenge =
  | {
      kind: "battle";
      roomId: string;
      technologyId: TechnologyId;
      questions: ChallengeQuestion[];
    }
  | {
      kind: "hr";
      roomId: string;
      impression: Impression;
      allowedMistakes: number;
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
