import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import {config} from "../config/config"
import axios from "axios";

export class TopCommand implements Command {
  commandNames: string[] = ["top", "t"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix + this.commandNames[0]} to get the top leaderboard`
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    // Where the command is run from
    await parsedUserCommand.originalMessage.reply('test');
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  private getTopSevenDays() {
    // try {
      // const resp = await axios(config.apiUrl + '/points/' + )
    // }
  }
}