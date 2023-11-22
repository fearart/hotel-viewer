import { Nitro } from "nitropack";
import mongoose from "mongoose";

export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.mongodb_uri);
    console.log("Database Pugin loaded");
  } catch (e) {
    console.error(e);
  }
};