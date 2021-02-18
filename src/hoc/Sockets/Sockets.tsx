import { useEffect, useState, useCallback } from 'react';
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
  addUnreadMsgsNotification,
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
  const { roomId, messageBoxIsOpen } = useSelector((s: RootState) => s.message);
  const isSignedIn = Boolean(accessToken);

  const dispatch = useDispatch();

  const [socketIo, setSocketIo] = useState<Socket | undefined>();

  // TODO: ADD SOCKETIO AS DEPENDENCY AND ONLY RE-CONNECT IN CASE IT IS NOT DEFINED
  useEffect(() => {
    if (isSignedIn && socketIo === undefined) {
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
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, [isSignedIn, socketIo]);

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
        if (roomId && roomId === message.roomId && messageBoxIsOpen) {
          dispatch(addNewMsgToRoom(message));
        } else {
          dispatch(addUnreadMsgsNotification(message.roomId));
        }
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
      return () => {
        socketIo.off();
      };
    }
  }, [socketIo, roomId, messageBoxIsOpen]);

  useEffect(() => {
    if (socketIo !== undefined) {
      // TODO: GET RID OF THIS AND INIT IT EVERYTIME WE CONNECT AUTOMATICALLY
      socketIo.emit(SOCKET_INIT_SOCKET);
      //TODO: INSTEAD OF DOING THIS FROM THE FRONT END WE CAN JUST SEND IT FROM THE
      // BACKEND EVERYTIME WE CONNECT AND THEN WE CAN GET RID OF THIS USEEFFECT
      dispatch(fetchActiveRoomsReq(socketIo));
    }
  }, [socketIo]);

  const { Provider: SocketIoProvider } = SocketIoContext;

  return <SocketIoProvider value={{ socketIo }}>{children}</SocketIoProvider>;
};
