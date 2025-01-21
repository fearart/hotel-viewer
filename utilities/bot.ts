import { Telegraf } from "telegraf";

const config = useRuntimeConfig();
const bot = new Telegraf(config.telegram_token)

export default bot