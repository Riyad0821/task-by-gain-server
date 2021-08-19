const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true
    })
  );

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ycwj8.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })