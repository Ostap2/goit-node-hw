const app = require("./app");
const mongoose = require("mongoose");
const { MONGODB_HOST } = process.env;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_HOST);
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
