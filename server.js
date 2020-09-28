const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  routes = require('./routes/main'),
  cors = require('cors'),
  morgan = require('morgan'),
  helmet = require('helmet'),
  configs = require('./configs/index'),
  requestRateLimit = require('./middlewares/requestRateLimit');

routes(app);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestRateLimit.limiter());
app.use(requestRateLimit.slower());
app.use(morgan(configs.morganMiddleware.type));

app.listen(port);

console.log('Challenge Trustly Scrapping started at port: ' + port);