import type { ComponentType } from "react";
import type { SceneId } from "@/content/steps";
import { ArchitectureScene } from "./ArchitectureScene";
import { CompareScene } from "./CompareScene";
import { EncryptScene } from "./EncryptScene";
import { ExtensionsScene } from "./ExtensionsScene";
import { GhzScene } from "./GhzScene";
import { HbbScene } from "./HbbScene";
import { IntroScene } from "./IntroScene";
import { ProblemScene } from "./ProblemScene";
import { SpyScene } from "./SpyScene";
import { TeachingScene } from "./TeachingScene";
import { TodayScene } from "./TodayScene";
import { UnlockScene } from "./UnlockScene";

export const SCENES: Record<SceneId, ComponentType> = {
  intro: IntroScene,
  problem: ProblemScene,
  today: TodayScene,
  ghz: GhzScene,
  teaching: TeachingScene,
  hbb: HbbScene,
  spy: SpyScene,
  encrypt: EncryptScene,
  unlock: UnlockScene,
  compare: CompareScene,
  extensions: ExtensionsScene,
  architecture: ArchitectureScene,
};
