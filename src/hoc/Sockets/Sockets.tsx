import { useEffect, useState } from 'react';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { NotificationResponseShape } from 'redux/reducers/notifications';
import { MessageResponseProps, ActiveRoomsResponse } from 'redux/reducers/message';
import { useSelector } from 'react-redux';
import { expressInterestSuccess } from 'redux/actions/book';
import { addLatestNotification } from 'redux/actions/notifications';
import {
  addNewMsgToRoom,
  joinSingleRoom,
  leaveSingleRoom,
  setAsSeenSuccess,
} from 'redux/actions/message';
import { fetchActiveRoomsReq } from 'redux/actions/message';
import { useDispatch } from 'react-redux';
import {
  SOCKET_RECEIVE_INTEREST,
  SOCKET_DISCONNECT,
  SOCKET_INIT_SOCKET,
  SOCKET_RECEIVE_NEW_MSG,
  SOCKET_RECEIVE_LATEST_NOTIFICATION,
  SOCKET_JOIN_SINGLE_ROOM,
  SOCKET_LEAVE_SINGLE_ROOM,
  SOCKET_SET_MSG_AS_SEEN,
} from 'socketTypes';

interface SocketIoInterestContextProps {
  socketIo: Socket | undefined;
}

const SocketInitialValue: SocketIoInterestContextProps = {
  socketIo: undefined,
};

export const SocketIoContext = createContext(SocketInitialValue);

interface SocketIOInterestInterface {
  children: React.ReactNode;
}

export const SocketIO = ({ children }: SocketIOInterestInterface) => {
  const { userId, accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  const dispatch = useDispatch();

  const [socketIo, setSocketIo] = useState<Socket | undefined>();

  useEffect(() => {
    if (isSignedIn) {
      setSocketIo(
        io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
          extraHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
    }

    if (!isSignedIn && socketIo) {
      socketIo.disconnect();
    }
    return () => {
      console.log('Running clean up');
      console.log('another test', socketIo);
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, [isSignedIn]);

  useEffect(() => {
    if (socketIo) {
      socketIo.on(
        SOCKET_RECEIVE_LATEST_NOTIFICATION,
        (notification: NotificationResponseShape) => {
          dispatch(addLatestNotification(notification));
        },
      );

      socketIo.on(
        SOCKET_RECEIVE_INTEREST,
        ({ bookId, isInterested }: { bookId: string; isInterested: boolean }) => {
          dispatch(expressInterestSuccess(bookId, isInterested));
        },
      );

      socketIo.on(SOCKET_DISCONNECT, () => {
        // eslint-disable-next-line
        console.log('disconnecting, do something');
      });

      socketIo.on(SOCKET_RECEIVE_NEW_MSG, (message: MessageResponseProps) => {
        dispatch(addNewMsgToRoom(message));
      });

      socketIo.on(SOCKET_JOIN_SINGLE_ROOM, (room: ActiveRoomsResponse) => {
        dispatch(joinSingleRoom(room));
      });

      socketIo.on(SOCKET_LEAVE_SINGLE_ROOM, (leaveRoomId: string) => {
        dispatch(leaveSingleRoom(leaveRoomId));
      });

      socketIo.on(SOCKET_SET_MSG_AS_SEEN, (roomId: string, msgId: string) => {
        dispatch(setAsSeenSuccess(roomId, msgId));
      });
    }
  }, [socketIo]);

  useEffect(() => {
    if (isSignedIn && socketIo && userId) {
      // TODO: Can be got rid of once interest expression is also through rooms
      socketIo.emit(SOCKET_INIT_SOCKET);
    }
    if (isSignedIn && socketIo && userId) {
      dispatch(fetchActiveRoomsReq(socketIo));
    }
  });

  const { Provider: SocketIoProvider } = SocketIoContext;

  return <SocketIoProvider value={{ socketIo }}>{children}</SocketIoProvider>;
};
