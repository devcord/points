import { Command } from "./command";
import { CommandContext } from "../models/command_context";

export class TopCommand implements Command {
  commandNames: string[] = ["top", "t"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix + this.commandNames[0]} to get the top leaderboard`
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    await parsedUserCommand.originalMessage.reply('test');
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}