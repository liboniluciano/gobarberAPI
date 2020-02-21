import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import senrtyConfig from './config/sentry';
import routes from './routes';

import './database/index';

class App {
  constructor() {
    this.server = express();

    Sentry.init(senrtyConfig);

    this.middleweres();
    this.routes();
    this.exceptionHandler();
  }

  middleweres() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());

    // Permitindo que acesse arquivos estáticos (interpretados pelo browser)
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // Middleware para tratamento de exceção
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'development') {
        const error = await new Youch(err, req).toJSON();

        return res.status(500).json(error);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
