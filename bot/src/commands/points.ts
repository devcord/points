import { User } from "discord.js";
import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import { config } from "../config/config"
import * as jwt from "jsonwebtoken";
import axios from "axios";

export class PointsCommand implements Command {
  commandNames: string[] = ["points", "point"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix + this.commandNames[0]} {days} to get the amount of points you have had in the past # of days.`
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    // Where the command is run from
    let days;
    
    if (parsedUserCommand.args.length > 0) {
     days = parsedUserCommand.args[0];
    } else {
      days = "7";
    }

    const user: User = parsedUserCommand.originalMessage.author;

    const points = await this.getPointsDays(days, user.id)
    await parsedUserCommand.originalMessage.reply(` you have ${points} points from the past ${days} days`);
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
  
  private async getPointsDays(days: string, userID: string): Promise<number> {
    let p = 0;
    const resp = await axios(config.apiUrl + '/points/' + userID + '/' + days, { method: "GET", headers: { 'Content-Type': 'application/json' } });
  
    const points = resp.data.data;

    for (let i = 0; i < points.length; ++i){
      const point = points[i];
      p += point.amount;
    }

    return p;
  }
}