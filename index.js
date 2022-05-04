const express = require('express');
const db = require('./models');
const cors = require('cors');
const { errorHandler } = require('./middlewares/Error');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/Credential');

require('dotenv').config();

const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors());

// routes
const usersRouter = require('./routes/Users');
const projectRouter = require('./routes/Projects');
const typesRouter = require('./routes/Types');
const featuresRouter = require('./routes/Features');
const tokenRouter = require('./routes/Token');
const logoutRouter = require('./routes/Logout');

// end points
app.use('/auth', usersRouter);
app.use('/project', projectRouter);
app.use('/type', typesRouter);
app.use('/feature', featuresRouter);
app.use('/refresh', tokenRouter);
app.use('/logout', logoutRouter);

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500).send('Something broke!');
});

port = process.env.PORT;
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server starts at ${port}`);
  });
});
