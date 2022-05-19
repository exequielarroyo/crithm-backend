const express = require('express');
const db = require('./models');
const cors = require('cors');
const { errorHandler } = require('./middlewares/Error');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/Credential');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

require('./middlewares/Auth');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/assets/images`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const app = express();
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/images', express.static(__dirname + '/assets/images'));
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Image uploaded');
});



// routes
const usersRouter = require('./routes/Users');
const projectRouter = require('./routes/Projects');
const typesRouter = require('./routes/Types');
const featuresRouter = require('./routes/Features');
const tokenRouter = require('./routes/Token');
const logoutRouter = require('./routes/Logout');
const planRouter = require('./routes/Plans');
const passwordRouter = require('./routes/ForgotPassword');

// end points
app.use('/auth', usersRouter);
app.use('/project', projectRouter);
app.use('/type', typesRouter);
app.use('/feature', featuresRouter);
app.use('/refresh', tokenRouter);
app.use('/logout', logoutRouter);
app.use('/plan', planRouter);
app.use('/password', passwordRouter);

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
