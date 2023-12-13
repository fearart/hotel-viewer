import { Nitro } from "nitropack";
import { Telegraf } from "telegraf";
export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();
  const bot = new Telegraf(config.telegram_token);
  bot.launch()
};