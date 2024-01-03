const mongoose = require("mongoose");
const DatabaseConnection = async () => {
  await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    //mongodb+srv://YasserFadhl:yasoory1996@cluster0.feh0e.mongodb.net/test
    .then(() => {
      console.log("DataBase is Connected");
    })
    .catch((ex) => {
      throw new Error(ex);
    });
};
module.exports = DatabaseConnection;
