const mongoose = require("mongoose");

const localDB = "mongodb+srv://a:a@cluster0.sz9vy3k.mongodb.net/test"; // Update with your local database connection
const remoteDB = "mongodb://localhost:27017/test"; // Update with your remote database connection

// Collections to copy
const collections = ["hotel-floors", "hotel-users", "hotel-logs"];

async function copyCollection(collectionName) {
  try {
    const localConnection = await mongoose.createConnection(localDB);
    const remoteConnection = await mongoose.createConnection(remoteDB);

    const LocalModel = localConnection.model(
      collectionName,
      new mongoose.Schema({}, { strict: false }),
      collectionName
    );

    const RemoteModel = remoteConnection.model(
      collectionName,
      new mongoose.Schema({}, { strict: false }),
      collectionName
    );

    console.log(`Fetching documents from local collection: ${collectionName}...`);
    const documents = await LocalModel.find().exec();
    console.log(`${documents.length} documents found in ${collectionName}.`);

    if (documents.length > 0) {
      console.log(`Inserting documents into remote collection: ${collectionName}...`);

      for (const document of documents) {
        // Use upsert to avoid duplicates
        await RemoteModel.updateOne(
          { _id: document._id }, // Match by _id
          { $set: document },    // Update document content
          { upsert: true }       // Insert if it doesn't exist
        );
      }

      console.log(`Successfully copied ${documents.length} documents to ${collectionName}.`);
    }

    await localConnection.close();
    await remoteConnection.close();
  } catch (error) {
    console.error(`Error copying ${collectionName}:`, error.message);
  }
}

async function copyAllCollections() {
  for (const collectionName of collections) {
    await copyCollection(collectionName);
  }
  console.log("All collections copied successfully.");
}

// Run the script
copyAllCollections().catch((err) => console.error("Error in copyAllCollections:", err));
