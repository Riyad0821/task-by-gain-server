const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/Schemas");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/graphql", cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.l47bs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { promiseLibrary: require("bluebird"), useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(4000);
    console.log("connection successful")
  })

  .catch((err) => console.error(err));