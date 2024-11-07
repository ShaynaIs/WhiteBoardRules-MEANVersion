import { MongoClient } from "mongodb";

const uri = "mongodb+srv://shaynaisrael1:0h6pxlBB7P6a9CQr@cluster0.9o1lcav.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function connectDB() {
  try {
      await client.connect();
      console.log("Connected to MongoDB");
      return client.db("WhiteBoardRules"); 

  } catch (e) {
      console.error("Failed to connect to MongoDB", e);
      process.exit(1);
  }
}

export default connectDB;