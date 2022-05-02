const express = require("express");
const db = require("./models");
const cors = require("cors");
const { errorHandler } = require("./middlewares/Error");

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
const usersRouter = require("./routes/Users");
const projectRouter = require("./routes/Projects");
const typesRouter = require("./routes/Types");
const featuresRouter = require("./routes/Features");

// end points
app.use("/auth", usersRouter);
app.use("/project", projectRouter);
app.use("/type", typesRouter);
app.use("/feature", featuresRouter);

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

port = process.env.PORT;
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server starts at ${port}`);
  });
});
