import { Nitro } from "nitropack";
import mongoose, { mongo } from "mongoose";

export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.mongodb_uri);
  } catch (e) {
    console.error(e);
  }

  const floors = await mongoose.connection.db.collection('hotel-floors').find().toArray();
  await mongoose.connection.db.collection('hotel-floors-backup').deleteMany({});
  await mongoose.connection.db.collection('hotel-floors-backup').insertMany(floors);
  console.log("Backup done at " + Date().toString().slice(0,24) + "");
  // Backup every hour
  setInterval(async () => {
    const floors = await mongoose.connection.db.collection('hotel-floors').find().toArray();
    await mongoose.connection.db.collection('hotel-floors-backup').deleteMany({});
    await mongoose.connection.db.collection('hotel-floors-backup').insertMany(floors);
    console.log("Backup done at " + Date().toString().slice(0,24) + "");
  }, 60 * 60 * 1000); // 60 * 60 * 1000 milliseconds = 1 hour
};