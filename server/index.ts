import next from 'next';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import express, { Request, Response, NextFunction, Express } from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import schedule from 'node-schedule';
import { HttpException, SocketDecoded } from './interface';
import morgan from 'morgan';
import socketioJwt from 'socketio-jwt';
import authRoutes from './routes/auth';
import booksRoutes from './routes/books';
import userRoutes from './routes/user';
import interactionRoutes from './routes/interactions';
import Book from './models/book';
import {
  saveSocketToRedis,
  expressInterest,
  removeInterest,
  joinAllRooms,
  sendMsg,
  socketDisconnect,
  setMsgAsSeen,
  createSwapRequest,
  acceptOrRejectSwapRequest,
  socketDisconnecting,
} from './controllers/interactions';
import { mongoConnect, closeDb } from './utils/database';
import { client as redisClient } from './utils/redis';
import {
  CONNECT,
  EXPRESS_INTEREST,
  JOIN_ALL_ROOMS,
  SEND_MSG,
  SET_MSG_AS_SEEN,
  SWAP_REQUEST,
  DISCONNECT,
  SWAP_CONSENT,
  USER_TYPING,
  DISCONNECTING,
} from './socketTypes';
import { jwtVerify } from './middlewares/jwtVerify';
import { fileResizeMW } from './middlewares/fileResize';

const port = parseInt(process.env.PORT as string, 10) || 3000; // We might want to change it later
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

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
  io.on(CONNECT, async (socket: SocketDecoded) => {
    /**
     * TODO FOR LATER
     * GET RID OF INIT SOCKET EVENT ON BOTH THE FRONTEND AND BACKEND AND DO THIS RIGHT
     */

    await saveSocketToRedis(socket);

    socket.on(EXPRESS_INTEREST, async (isInterested, bookInfo) => {
      if (isInterested) {
        await expressInterest(io, socket, bookInfo);
      } else {
        await removeInterest(io, socket, bookInfo);
      }
      // todo add catch block
    });

    socket.on(JOIN_ALL_ROOMS, async cb => {
      await joinAllRooms(io, socket, cb);
      // todo add catch block
    });

    socket.on(SEND_MSG, async (msgInfo, cb) => {
      await sendMsg(socket, msgInfo, cb);
      // todo add catch block
    });

    socket.on(SET_MSG_AS_SEEN, async (roomId, msgId, cb) => {
      await setMsgAsSeen(socket, roomId, msgId, cb);
      // todo add catch block
    });

    socket.on(
      SWAP_REQUEST,
      async (matchId, swapWithBook, swapBook, cb: (isSuccess: boolean) => void) => {
        await createSwapRequest(io, socket, matchId, swapWithBook, swapBook, cb);
        // todo add catch block
      },
    );

    socket.on(
      SWAP_CONSENT,
      async (
        notificationId,
        bookId,
        hasAccepted,
        cb: (isSuccess: boolean) => void,
      ) => {
        await acceptOrRejectSwapRequest(
          io,
          socket,
          notificationId,
          bookId,
          hasAccepted,
          cb,
        );
        // todo add catch block
      },
    );

    socket.on(USER_TYPING, (roomId: string, isTyping: boolean) => {
      socket.to(roomId).emit(USER_TYPING, roomId, isTyping);
    });

    socket.on(DISCONNECTING, async () => {
      socketDisconnecting(socket);
    });

    socket.on(DISCONNECT, async () => {
      await socketDisconnect(socket);
      // todo add catch block
    });
  });

  // TODO Do we need cors(). Most probably no. Get rid of it.
  server.use(cors());

  server.use(bodyParser.json());

  server.use('/favicon.ico', (_req, res) => {
    res.status(200).sendFile('favicon.ico', { root: path.join(__dirname, '../') });
  });
  server.use('/pustokio_logo.png', (_req, res) => {
    res
      .status(200)
      .sendFile('pustokio_logo.png', { root: path.join(__dirname, '../') });
  });

  server.use('/play/newmsg.mp3', (_req, res) => {
    res.status(200).sendFile('newmsg.mp3', { root: path.join(__dirname, '../') });
  });

  server.use('/play/notification.mp3', (_req, res) => {
    res
      .status(200)
      .sendFile('notification.mp3', { root: path.join(__dirname, '../') });
  });

  // server.use('/images', express.static(path.join(__dirname, '../', './images')));
  server.use('/images/:filename', fileResizeMW);

  server.use(jwtVerify);

  server.use('/auth', authRoutes);
  server.use('/books', booksRoutes);
  server.use('/user', userRoutes);
  server.use('/interactions', interactionRoutes);

  // SCHEDULER TO DELETE ALL EXPIRED BOOKS

  schedule.scheduleJob('* * * * *', async () => {
    const books = await Book.getStaleBookIds();
    console.log('Deleting book -', books);
    if (books.length > 0) {
      books.forEach(
        async ({
          _id,
          userId,
          bookPicturePath,
        }: {
          _id: mongodb.ObjectId;
          userId: mongodb.ObjectId;
          bookPicturePath: string;
        }) => {
          const bookIdAsMongoId = _id.toHexString();
          const userIdAsMongoId = userId.toHexString();
          await Book.removeBook(bookIdAsMongoId, userIdAsMongoId);
          fs.unlinkSync(path.join(__dirname, '..', bookPicturePath));
        },
      );
    }
  });

  // NEXT JS CONFIGS

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
