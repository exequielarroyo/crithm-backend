const express = require('express');
const app = express();
const db = require('./models');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// routes
const usersRouter = require('./routes/Users');
const typesRouter = require('./routes/Types');
// end points
app.use('/auth', usersRouter);
app.use('/typing', typesRouter);

port = 3001;
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server starts at ${port}`);
  });
});
