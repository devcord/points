import * as dotenv from "dotenv";

dotenv.config();

/**
 * Discord bot config.
 */

export type BotConfig = {
  /** the Discord bot token. */
  token: string,
  /** Prefix used for bot commands. */
  prefix: string,
  /** The name of the role that gives ultimate power over the bot. */
  botOwnerRoleName: string,
  /** The bot will add reactions to the command messages indicating success or failure. */
  enableReactions: boolean,
/* Api URL */
  apiUrl: string,
/* JWT secret */
  jwtSecret: string,
};

export let config: BotConfig = {
  token: process.env.TOKEN || "", 
  prefix: process.env.prefix || ";",
  botOwnerRoleName: process.env.BOT_OWNER_ROLE_NAME || "Staff",
  enableReactions: false,
  apiUrl: process.env.API_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
};
