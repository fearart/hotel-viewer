import { Nitro } from "nitropack";
import bot from "~/utilities/bot";
export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();

  bot.launch()
};