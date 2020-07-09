import { User, Message } from "discord.js";
import { Command } from "./command";
import { CommandContext } from "../models/command_context";
import { config } from "../config/config"
import axios from "axios";

export class PointsCommand implements Command {
  commandNames: string[] = ["points", "point", "p"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix + this.commandNames[0]} {days} {user} to get the amount of points you or a user have had in the past # of days.`
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const args = parsedUserCommand.args;
    const message = parsedUserCommand.originalMessage;

    const days = (args.length > 0) ? args[0] : "7";
    const user = (args.length <= 1) ? message.author : message.mentions.users.first() : message.guild.members.cache.find(m => m.user.username === args.join(' ')) : message.guild.members.cache.find(m => m.user.id === args.join(' '));

    this.sendEmbed(message, user, days);    
  }

  private async sendEmbed(message: Message, user: User, days: string) {
    const embed = {
      title: 'Points - ' + days + ' days',
      color: this.randomColor(),
      // eslint-disable-next-line @typescript-eslint/camelcase
      author: { name: this.getName(message.author, message.author.id), icon_url: message.author.avatarURL },
      description: ''
    };

    this.getPointsDays(days, user.id).then((points) => {
      embed.description = `<@${user.id}> - ${points}`;
      return message.channel.send({ embed });
    }).catch(() => {
      message.react('❌');
      return null;
    })

  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
  
  private async getPointsDays(days: string, userID: string): Promise<number> {
    let p = 0;
    const resp = await axios(config.apiUrl + '/points/user/' + userID + '/' + days, { method: "GET", headers: { 'Content-Type': 'application/json' } });
  
    const points = resp.data.data;

    for (let i = 0; i < points.length; ++i){
      const point = points[i];
      p += point.amount;
    }

    return p;
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
  private randomColor() { return Math.floor(Math.random() * 16777215).toString(16); }


}
