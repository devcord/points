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
    // await this.getTopSevenDays();
    const args = parsedUserCommand.args;
    if(args.length > 0){
      this.sendLeaderboard(parsedUserCommand.originalMessage, await this.getTopDays(parseInt(args[0])), parseInt(args[0]));
    } else {
      this.sendLeaderboard(parsedUserCommand.originalMessage, await this.getTopDays(7), 7);
    }
    }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }

  private async sendLeaderboard(message: Message, top: Array<Array<string>>, days: number): Promise<Message> {
    const embed = {
      title: 'Leaderboard - ' + days + ' days',
      color: this.randomColor,
      // eslint-disable-next-line @typescript-eslint/camelcase
      author: {name: this.getName(message.author, message.author.id), icon_url: message.author.avatarURL},
      description: ''
    };
    embed.description = top.map((p, i) =>
      `${i + 1}) **${this.getName(message.guild.members.cache.find(m => m.id === p[0]), p[0])}** has ${p[1]} reputation`
    ).join('\n');

    return await message.channel.send({ embed });
  }

  private async getTopDays(days: number): Promise<string[][]>{
    try {
      const resp = await axios(config.apiUrl + '/points/top/' + days, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const points = resp.data.data;
      const sortable = [];
      for (const user in points) {
        sortable.push([user, points[user]]);
      }
      sortable.sort((a, b) => {
        return a[1] - b[1];
      });
      const top = sortable.reverse().slice(0, 10);
      return top;
    } catch (e) {
      throw new Error(e);
    }
  }

  private getName = (user: any, id: string): string => {
    if (user !== undefined) {
      // If he the user has a 'user' field (read: is a member), return the nickname or user.username. Otherwise, return the user.username.
      return Object.prototype.hasOwnProperty.call(user, 'user')
        ? user.nickname
          ? user.nickname
          : user.user.username
        : user.username
    } else {
      return `<@${id}>`
    }
  }

  private randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
}