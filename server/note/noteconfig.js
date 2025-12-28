const mongoose = require("mongoose");

exports.databaseConnect = async () => {
  const uri = "mongodb+srv://samiksha:samiksha%40123@cluster0.plau95w.mongodb.net/mydb?retryWrites=true&w=majority";

  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};