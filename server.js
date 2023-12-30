const app = require("./app");
const mongoose = require("mongoose");
const { MONGODB_HOST } = process.env;

mongoose
  .connect(MONGODB_HOST)
  .then(() =>
    app.listen(3000, () => {
      console.log("Database connection successful");
      console.log('Server is running on port 3000');
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });