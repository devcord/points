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
    if (args.length > 0) {
      this.sendLeaderboard(parsedUserCommand.originalMessage, parseInt(args[0]));
    } else {
      this.sendLeaderboard(parsedUserCommand.originalMessage, 7);
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

    await this.getTopDays(days).then(async (top) => {

      embed.description = top.map((p, i) =>
        `${i + 1}) <@${p.userId}> has ${p.total} reputation`
      ).join('\n');

      return await msg.edit({ embed });
    }).catch((err) => {
      console.error(err);
      msg.delete();
      message.react('❌');
      return null;
    })
  }

  private async getTopDays(days: number): Promise<{ userId: string; total: number }[]> {
    try {
      const { data } = await axios(config.apiUrl + '/points/top/' + days, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      return data.data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private getName = (user: any, id: string): string => {
    if (user !== undefined) {
      // If the user has a 'user' field (read: is a member), return the nickname or user.username. Otherwise, return the user.username.

      // NOTE: We do some weird parsing here, ignore this
      return Object.prototype.hasOwnProperty.call(user, 'user')
        ? user.nickname
          ? user.nickname
          : user.user.username
        : user.username
    } else {
      return `<@${id}>`
    }
  }

  private randomColor(): string { return Math.floor(Math.random() * 16777215).toString(16); }

}
