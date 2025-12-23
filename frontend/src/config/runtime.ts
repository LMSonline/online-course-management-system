/**
 * Runtime configuration flags
 * @deprecated Use src/config/env.ts instead
 */

import { env } from "./env";

export const USE_MOCK = env.USE_MOCK;
export const API_BASE_URL = env.API_BASE_URL;

