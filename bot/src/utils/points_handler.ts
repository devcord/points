import { Message, User, GuildMember } from "discord.js";
import { config } from "../config/config";
import { UserType } from "../types"
import * as jwt from "jsonwebtoken";
import axios from "axios";


/** Handler for points */
export class PointsHandler {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /* Handles points if it is not by a bot and its not a command */
  async handleMessage(message: Message): Promise<void> {
    if (message.author.bot || this.isCommand(message)) {
      return;
    }

    /**
     * Removes any quoted lines inside the `message`
     * @param {string} message The full message
     * @returns {string} The original message but without any quoted lines
     */
    const removeQuotes = (message: string): string => message
      .split('\n')
      .filter(line => !line.startsWith('> '))
      .join('\n');

    /**
     * Checks for a "thanks" keyword inside a message
     * @param {string} message The full message
     * @returns {boolean} True if the message has any of the "thanks" keywords, False otherwise
     */
    const hasThanks = (message: string): boolean => config.thanksKeywords.some(
      word => removeQuotes(message).toLowerCase().includes(word)
    );

    if (hasThanks(message.content)) {
      this.handleThanks(message);
    } else {
      // Give points based off of location
      // if(!config.debug){
        this.givePoints(message.author, this.getMultiplier(message), 'message').catch(err => console.log(err));
      // }
    }
  }

  /** Determines whether or not a message is a user command. */
  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }

  private async getUser(user: User): Promise<UserType | void> {
    const token = this.getToken(user.id);

    try {
      const resp = await axios(config.apiUrl + '/user/' + user.id, { method: "GET", headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + token } });
      return resp.data.data;
    } catch ({ response }) {
      const {
        status,
        data,
        config: { url },
      }: {
        status: number;
        data: string | object;
        config: {
          url: string;
        };
        } = response;

      if (status == 404) {
        // user doesn't exist time to create user
        return this.createUser(user);
       }else {
        throw {
          status,
          data,
          url,
        }
      }
    }
  }

  private async createUser(user: User): Promise<UserType | void> {
    const u: UserType = { id: user.id, totalPoints: 0 };

    try {
       const resp = await axios(config.apiUrl + '/user/', { method: "POST", data: u, headers: { 'Content-Type': 'application/json'}});
      return resp.data.data;
    } catch (e) {
      if (e && e.response) console.error(e.response.data);
      else throw e;
    }
  }

  private async updateUser(user: UserType, type: string): Promise<UserType> {
    const token = this.getToken(user.id);

    try {
      const resp = await axios(config.apiUrl + '/user/' + user.id + '/points/' + type, { method: "POST", data: user, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } });
      return resp.data.data;
    } catch (e) {
      if (e && e.response) console.error(e.response.data);
      else throw e;
    }

  }

  private getMultiplier(message: Message): number {
    const channelId: string = message.channel.id;
    const multiplierIds: string[] = Object.keys(config.multipliers);


    if (multiplierIds.includes(channelId)) {
      return config.multipliers[channelId];
    } else {
      return 1;
    }
  }

  private async handleThanks(message: Message): Promise<void> {
    let thankees = message.mentions.members.filter(
      (thankee: GuildMember) => thankee !== undefined
    );

    if (thankees.size > 0) {
      const thanker = message.author;
      if (thankees.map((thankee: GuildMember) => thankee.user.id).includes(thanker.id)) {
        message.reply('you cannot thank yourself!');
      }

      thankees = thankees.filter((thankee: GuildMember) => thankee.user.id !== thanker.id);
      const thankeesArray = thankees.array();

      if (thankeesArray.length != 0){
        thankees.forEach((thankee: GuildMember) => {
          this.givePoints(thankee.user, config.multipliers['thanks'], 'thanks').catch(err => console.log(err));
        })


        let thankeesString = "";
        if (thankeesArray.length === 1) {
          thankeesString = `${thankeesArray[0]} `
        } else if (thankeesArray.length === 2) {
          thankeesString = `${thankeesArray[0]} & ${thankeesArray[1]} `
        } else {
          // Loop through the thankees and depending on what position, add it with the proper separator.
          let iterator = 0
          for (const thankee of thankeesArray) {
            thankeesString += thankeesArray.length === ++iterator
              ? `& ${thankee}`
              : `${thankee},`
          }
        }

        message.channel.send({
          embed: {
            title: `Thanks received!`,
            color: this.randomColor(),
            description: `${thankeesString} ${thankeesArray.length === 1 ? 'has' : 'have'} been thanked by ${thanker}!`,
            footer: {
              text: 'Use "thanks @user" to give someone rep, and ";points {# of days} @user" to see how much they have!'
            }
          }
        })
      }
    }
  }

  private async givePoints(u: User, amount: number, type: string): Promise<void> {
    const user = await this.getUser(u);
    if (user) {
      user.totalPoints = amount;
      this.updateUser(user, type);
    } else {
      console.log("User is undefined");
    }
  }

  private getToken(id: string): string {
    const token: string = jwt.sign({ id }, config.jwtSecret);
    return token;
  }

  private randomColor(): string { return Math.floor(Math.random() * 16777215).toString(16); }

}
