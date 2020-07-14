import { Message, MessageReaction } from "discord.js";
import { config } from "../config/config";

const POSITIVE = ["👍", "🎮", "💚", "🍜"];
const EXPIRED = ["🖤"];
const FAILURE = ["⛔", "🚱"];

export class Reactor {
  enableReactions: boolean;
  constructor(enableReactions: boolean) {
    this.enableReactions = enableReactions;
  }

  /** Indicates to the user that the command was executed successfully. */
  async success(message: Message): Promise<MessageReaction> {
    if (!this.enableReactions) return;

    return message.react(this.getRandom(POSITIVE));
  }

  /** Indicates to the user that the command failed for some reason. */
  async failure(message: Message): Promise<MessageReaction> {
    if (!this.enableReactions) return;

    await this.removeReactions(message);
    return message.react(this.getRandom(FAILURE));
  }

  /** Indicates to the user that the command is no longer active, as intended. */
  async expired(message: Message): Promise<MessageReaction> {
    if (!this.enableReactions) return;

    await this.removeReactions(message);
    return message.react(this.getRandom(EXPIRED));
  }

  /** Gets a random element of an array. */
  private getRandom(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  private async removeReactions(message: Message): Promise<void> {
    await message.reactions.removeAll();
  }
}

export const reactor = new Reactor(config.enableReactions);
