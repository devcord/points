import * as dotenv from "dotenv";

dotenv.config();

/**
 * Discord bot config.
 */
export type BotConfig = {
  /** the Discord bot token. */
  token: string;
  /** Prefix used for bot commands. */
  prefix: string;
  /** The name of the role that gives ultimate power over the bot. */
  botOwnerRoleName: string;
  /** The bot will add reactions to the command messages indicating success or failure. */
  enableReactions: boolean;
/* Api URL */
  apiUrl: string;
/* JWT secret */
  jwtSecret: string;
/* Multipliers */
  multipliers: any;
/* Thanks keywords */
  thanksKeywords: string[];
};

export const config: BotConfig = {
  token: process.env.TOKEN || "", 
  prefix: process.env.prefix || ";",
  botOwnerRoleName: process.env.BOT_OWNER_ROLE_NAME || "Staff",
  enableReactions: false,
  apiUrl: process.env.API_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  multipliers: {
    '614583365244420189': 1,
    '711254277141561375': 5,
    'thanks': 10,
  },
  thanksKeywords: ["thanks", "thank", "thunk", "kudos"],
};
