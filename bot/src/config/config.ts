import * as dotenv from "dotenv";

dotenv.config();


interface MultipliersType {
  [propName: string]: number;
}

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
  multipliers: MultipliersType;
/* Thanks keywords */
  thanksKeywords: string[];
/* Debug mode */
  debug: boolean;
};

export const config: BotConfig = {
  token: process.env.TOKEN || "", 
  prefix: process.env.PREFIX || ";",
  botOwnerRoleName: process.env.BOT_OWNER_ROLE_NAME || "Staff",
  enableReactions: false,
  apiUrl: process.env.API_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  multipliers: {
    '415820043524505600': 2,
    '576466340525637647': 2,
    '174075418410876928': 2,
    '535531810143076362': 2,
    '625070673299243079': 2,
    '625801935601008669': 2,
    '327462763989303306': 2,
    '690593945477972008': 2,
    '550021134662369290': 1,
    '438105497707610113': 2,
    '708388737490485309': 2,
    '581307183208333322': 2,
    '581307210949328915': 2,
    '581307243711168524': 2,
    '581307272760655913': 2,
    '581307398900154368': 2,
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
    'thanks': 1000,
  },
  
  thanksKeywords: ["thanks", "thank", "thunk", "thx", "kudos"],
  debug: process.env.NODE_ENV == "development" ? true : false,
};
