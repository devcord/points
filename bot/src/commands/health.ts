import { Message, MessageReaction } from "discord.js";
import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import { config } from "../config/config";
import axios from "axios";

interface GetStatusType {
  respTime: number;
  uptime: number;
  status: string;
}

interface Time {
  d: number;
  h: number;
  m: number;
  s: number;
}

export class HealthCommand implements Command {
  commandNames: string[] = ["health"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix + this.commandNames[0]} to get the health of the bot and backend`
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const resp = await this.getStatus(parsedUserCommand.originalMessage);

    const message = parsedUserCommand.originalMessage

    if (Object.keys(resp).includes('status')) {
      const { respTime, uptime, status } = (resp as GetStatusType);

      const uptimeObj = this.convertMS(uptime * 1000)

      const embed = {
        title: 'Health',
        color: this.randomColor(),
        // eslint-disable-next-line @typescript-eslint/camelcase
        author: { name: this.getName(message.author, message.author.id), icon_url: message.author.avatarURL },
        description: `**Ping:** ${respTime}ms \n**Uptime:** ${uptimeObj.d} days ${uptimeObj.h} hours ${uptimeObj.m} minutes ${uptimeObj.s} seconds \n**Status:** ${status.toUpperCase()}`
      };

      message.channel.send({ embed })
    } else {
      message.react("❌");
    }
  }

  async getStatus(message: Message): Promise<GetStatusType | MessageReaction> {
    const sT = Date.now();
    return axios.get(config.apiUrl + '/health').then((resp) => {
      const { uptime, status } = (resp.data.data);

      return { respTime: this.axiosTimer(sT), uptime, status }
    }).catch(() => {
      return message.react("❌")
    })
  }

  private axiosTimer(sT: number): number {
    const now = Date.now();
    const milli = Math.floor((now - sT) % 1000);

    return milli;
  }

  hasPermissionToRun(): boolean {
    return true;
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

  private convertMS(ms: number): Time {
    let h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    const d = Math.floor(h / 24);
    h = h % 24;
    return { d, h, m, s};
  }

}