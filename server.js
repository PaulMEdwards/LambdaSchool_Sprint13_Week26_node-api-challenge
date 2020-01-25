const express = require('express');

const server = express();
server.use(express.json());

//custom middleware

const logger = require('./middleware/logger');
server.use(logger);

// const readme = require('./readme');

// server.get('/', (req, res) => {
//   res.send(readme);
// });

const actionRouter = require('./data/helpers/actionRouter.js');
server.use('/api/actions', actionRouter);

const projectRouter = require('./data/helpers/projectRouter.js');
server.use('/api/projects', projectRouter);

module.exports = server;
