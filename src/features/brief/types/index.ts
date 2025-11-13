import type { BriefFormValues, BriefStepValues } from "../schemas/brief";
import type { BriefStepId } from "../constants/steps";

export type { BriefFormValues, BriefStepValues, BriefStepId };

export type BriefStepMeta = {
  readonly id: BriefStepId;
  readonly index: number;
  readonly title: string;
  readonly description: string;
};
