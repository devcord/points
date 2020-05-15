import { Message, User } from "discord.js";
import { Command } from "../commands/command";
import { CommandContext } from "../models/command_context";
import { HelpCommand } from "../commands/help";
import { reactor } from "../reactions/reactor";
import { config } from "../config/config";
import { UserType } from "../types"
import * as jwt from "jsonwebtoken";
import axios from "axios";


const API_URL = config.apiUrl;

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

           let user = await this.get_user(message.author);
           if (user) {
             let points = 1 * this.get_multiplier(message);
             user.points = points;
             this.update_user(user);
           } else {
             throw new Error("Something what terribly wrong!");
           }
         }

         /** Determines whether or not a message is a user command. */
         private isCommand(message: Message): boolean {
           return message.content.startsWith(this.prefix);
         }

         private apiClient = axios.create({
           baseURL: API_URL,
           responseType: "json",
           headers: {
             "Content-Type": "application/json",
           },
         });

         private async get_user(user: User): Promise<UserType> {
           let token = this.get_token(user.id);

           this.apiClient.interceptors.request.use((c) => {
             c.headers.get["Authorization"] = "Bearer " + token;
             return c;
           });

           try {
             const resp = await this.apiClient.get("/user/" + user.id);
             let u: UserType = resp.data.data;
             return u;
           } catch (e) {
             if (e && e.response) {
               if (e.response.data.code == 400) {
                 return this.create_user(user);
               } else {
                 // Error
                 console.error(e.response.data);
               }
             }
           }
         }

         private async create_user(user: User): Promise<UserType> {
           let u: UserType = { id: user.id, points: 0 };

           try {
             const resp = await this.apiClient.post<UserType>("/user", u);
             return resp.data;
           } catch (e) {
             if (e && e.response) console.error(e.response.data);
             else throw e;
           }
         }

         private async update_user(user: UserType): Promise<UserType> {
           let token = this.get_token(user.id);

           this.apiClient.interceptors.request.use((c) => {
             c.headers.post["Authorization"] = "Bearer " + token;
             return c;
           });

           try {
             const resp = await this.apiClient.post(`/user/${user.id}/points`, user);
             let u = resp.data.data;
             return u;
           } catch (e) {
             if (e && e.response) console.error(e.response.data);
             else throw e;
           }

         }

         private get_multiplier(message: Message): number {
           let n = 1;


           return n;
         }

         private get_token(id: string): string {
           let token: string = jwt.sign({ id }, config.jwtSecret);
           return token;
         }
       }
