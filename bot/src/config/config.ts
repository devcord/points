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
  prefix: process.env.PREFIX || ";",
  botOwnerRoleName: process.env.BOT_OWNER_ROLE_NAME || "Staff",
  enableReactions: false,
  apiUrl: process.env.API_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  multipliers: {
    '415820043524505600': 1,
    '576466340525637647': 1,
    '174075418410876928': 1,
    '535531810143076362': 1,
    '625070673299243079': 1,
    '625801935601008669': 1,
    '327462763989303306': 1,
    '690593945477972008': 1,
    '550021134662369290': 0,
    '438105497707610113': 1,
    '708388737490485309': 1,
    '581307183208333322': 1,
    '581307210949328915': 1,
    '581307243711168524': 1,
    '581307272760655913': 1,
    '581307398900154368': 1,
    '706057998451343411': 5,
    '621385120229621821': 5,
    '496805607454670888': 5,
    '496820557627654174': 5,
    '621598298431553536': 5,
    '496836226834366484': 5,
    '647358940144730113': 5,
    '570609053835984916': 5,
    '473144304248946689': 5,
    '664280781509885972': 5,
    'thanks': 10,
  },
  thanksKeywords: ["thx", "thank", "thunk", "kudos"],
};
