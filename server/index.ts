import next from 'next';
import path from 'path';
import cors from 'cors';
import express, { Request, Response, NextFunction, Express } from 'express';
import bodyParser from 'body-parser';
import scktio from 'socket.io';
import { createServer } from 'http';
import { HttpException } from './interface';
import multer from 'multer';
import morgan from 'morgan';
import socketioJwt from 'socketio-jwt';
import authRoutes from './routes/auth.route';
import booksRoutes from './routes/books.route';
import userRoutes from './routes/user.route';
import { interactionController } from './controllers/interactions';
import { mongoConnect, closeDb } from './utils/database';
import { client as redisClient } from './utils/redis';
import { CONNECT } from './socketTypes';
import { jwtVerify } from './middlewares/jwtVerify';

const port = parseInt(process.env.PORT as string, 10) || 3000; // We might want to change it later
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
app.prepare().then(() => {
  server.use(morgan('dev'));
  const HTTPServer = createServer(server);
  // more sane options can be added
  const io = scktio(HTTPServer, { maxHttpBufferSize: 10e5 }); // TODO update maxHttpBufferSize

  io.use(
    socketioJwt.authorize({
      secret: process.env.ACCESS_SECRET as string,
      handshake: true,
    }),
  );
  io.on(CONNECT, interactionController);

  // TODO Just in case we want to disconnect the user when logging out
  // io.sockets.connected['socketId'].disconnect()

  const fileStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, 'images');
    },
    filename: (_req, file, cb) => {
      cb(
        null,
        `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`,
      );
    },
  });

  const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: (firstArg: null, secondArg: boolean) => void,
  ): void => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  server.use(cors());

  server.use(bodyParser.json());

  server.use(multer({ storage: fileStorage, fileFilter }).single('bookImage'));

  // eslint-disable-next-line no-console
  server.use('/images', express.static(path.join(__dirname, '../', './images')));

  server.use(jwtVerify);

  server.use('/auth', authRoutes);
  server.use('/books', booksRoutes);
  server.use('/user', userRoutes);

  server.get('/newhome', (req, res) => {
    // @ts-ignore
    return app.render(req, res, '/newhome', req.query);
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
      // eslint-disable-next-line no-console
      console.log(err);
      const status: number = err.statusCode || 500;
      const { message } = err;
      const { data } = err;
      res.status(status).json({ message, data });
    },
  );

  process.on('SIGINT', () => {
    closeDb(() => {
      redisClient.quit();
      // eslint-disable-next-line
      process.exit();
    });
  });

  mongoConnect(() => {
    HTTPServer.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log('\x1b[33m%s\x1b[0m', `listening to requests in port ${port}`);
    });
  });
});

export default server;
