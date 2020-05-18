import Discord, { Message } from "discord.js";
import { config, BotConfig } from "./config/config";
import { CommandHandler } from "./utils/command_handler";
import { PointsHandler } from "./utils/points_handler";
import axios from 'axios';

/** Pre-startup validation of the bot config. */
function validateConfig(config: BotConfig): void {
  if (!config.token) {
    throw new Error("You need to specify your Discord bot token!");
  }
  if (Object.keys(config.multipliers).length == 0) {
    throw new Error("You need to specify multiplier values for the channels");
  }
}


async function checkStatus(config: BotConfig): Promise<void> {
  try {
    await axios(config.apiUrl + "/health", {method: "GET",  headers: { 'Content-Type': 'application/json'}});
  }catch (err){
    throw new Error("The API is not reachable! Please ensure that we have a proper connection to " + config.apiUrl);
  }
}


validateConfig(config);
checkStatus(config);

const commandHandler = new CommandHandler(config.prefix);
const pointsHandler = new PointsHandler(config.prefix);

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Bot has started");
});

client.on("message", (message: Message) => {
  commandHandler.handleMessage(message);
  pointsHandler.handleMessage(message);
});

client.on("error", e => {
  console.error("Discord client error!", e);
});

client.login(config.token);

