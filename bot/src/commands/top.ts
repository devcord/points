import { Message } from "discord.js";
import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import { config } from "../config/config";
import axios from "axios";

export class TopCommand implements Command {
  commandNames: string[] = ["top", "t", "leaderboard"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix + this.commandNames[0]} {days} to get the top leaderboard`
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const args = parsedUserCommand.args;
    if(args.length > 0){
      this.sendLeaderboard(parsedUserCommand.originalMessage, parseInt(args[0]));
    } else {
      this.sendLeaderboard(parsedUserCommand.originalMessage,  7);
    }
    }

  hasPermissionToRun(): boolean {
    return true;
  }

  private async sendLeaderboard(message: Message, days: number): Promise<void | Message> {
    const embed = {
      title: 'Leaderboard - ' + days + ' days',
      color: this.randomColor(),
      // eslint-disable-next-line @typescript-eslint/camelcase
      author: { name: this.getName(message.author, message.author.id), icon_url: message.author.avatarURL },
      description: 'Loading...'
    };

    const msg = await message.channel.send({ embed });

   await this.getTopDays(days).then(async (top) =>{

    embed.description = top.map((p, i) =>
      `${i + 1}) <@${p[0]}> has ${p[1]} reputation`
    ).join('\n');

    return await msg.edit({ embed });
   }).catch(() => {
     msg.delete();
     message.react('❌');
     return null;
   })
  }

  private async getTopDays(days: number): Promise<string[][]>{
    try {
      const resp = await axios(config.apiUrl + '/points/top/' + days, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      const points = resp.data.data;
      const sortable = [];
      for (const user in points) {
        sortable.push([points[user]['_id'], points[user]['value']]);
      }

      sortable.sort((a, b) => {
        return a[1] - b[1];
      });

      const top = sortable.reverse().slice(0, 10);
      return top;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private randomColor(): string { return Math.floor(Math.random() * 16777215).toString(16); }

}
