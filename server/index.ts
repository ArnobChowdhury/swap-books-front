import next from 'next';
import path from 'path';
import cors from 'cors';
import express, { Request, Response, NextFunction, Express } from 'express';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { HttpException, SocketDecoded } from './interface';
import multer from 'multer';
import morgan from 'morgan';
import socketioJwt from 'socketio-jwt';
import authRoutes from './routes/auth.route';
import booksRoutes from './routes/books.route';
import userRoutes from './routes/user.route';
import {
  initSocket,
  expressInterest,
  joinAllRooms,
  sendMsg,
  initMsgs,
  socketDisconnect,
  setMsgAsSeen,
} from './controllers/interactions';
import { mongoConnect, closeDb } from './utils/database';
import { client as redisClient } from './utils/redis';
import {
  CONNECT,
  INIT_SOCKET,
  EXPRESS_INTEREST,
  JOIN_ALL_ROOMS,
  SEND_MSG,
  INIT_MSGS,
  SET_MSG_AS_SEEN,
  DISCONNECT,
} from './socketTypes';
import { jwtVerify } from './middlewares/jwtVerify';

const port = parseInt(process.env.PORT as string, 10) || 3000; // We might want to change it later
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
// const executeLater = (isocket: Server) => {
//   setTimeout(() => {
//     const m = isocket.sockets.sockets;
//     console.log(m);
//   }, 5000);
// };

app.prepare().then(() => {
  server.use(morgan('dev'));
  const HTTPServer = createServer(server);
  // more sane options can be added to io server
  const io = new Server(HTTPServer);

  io.use(
    socketioJwt.authorize({
      secret: process.env.ACCESS_SECRET as string,
      handshake: true,
    }),
  );

  // io.on(CONNECT, interactionController);
  io.on(CONNECT, (socket: SocketDecoded) => {
    socket.on(INIT_SOCKET, async () => {
      await initSocket(socket);
      // todo add catch block
    });

    socket.on(EXPRESS_INTEREST, async bookInfo => {
      await expressInterest(io, socket, bookInfo);
      // todo add catch block
    });

    socket.on(JOIN_ALL_ROOMS, async cb => {
      await joinAllRooms(socket, cb);
      // todo add catch block
    });

    socket.on(SEND_MSG, async (msgInfo, cb) => {
      await sendMsg(socket, msgInfo, cb);
      // todo add catch block
    });

    socket.on(INIT_MSGS, async (room, cb) => {
      await initMsgs(room, cb);
      // todo add catch block
    });

    socket.on(SET_MSG_AS_SEEN, async (roomId, msgId, cb) => {
      await setMsgAsSeen(socket, roomId, msgId, cb);
      // todo add catch block
    });

    socket.on(DISCONNECT, async () => {
      await socketDisconnect(socket);
      // todo add catch block
    });
  });

  // executeLater(io);
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

  // server.get('/newhome', (req, res) => {
  //   // @ts-ignore
  //   return app.render(req, res, '/newhome', req.query);
  // });

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
