import { Inject } from "@nestjs/common";
import { OPENAI_CLIENT } from "./openai.constants";

export const InjectOpenAI = (name?: string) => Inject(OPENAI_CLIENT(name));
