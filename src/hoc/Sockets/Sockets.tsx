import { useEffect } from 'react';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { NotificationResponseShape } from 'redux/reducers/notifications';
import { MessageResponseProps, ActiveRoomsResponse } from 'redux/reducers/message';
import { useSelector } from 'react-redux';
import { expressInterestSuccess } from 'redux/actions/book';
import { addLatestNotification } from 'redux/actions/notifications';
import {
  fetchCurrentRoomMsgsSuccess,
  joinSingleRoom,
  leaveSingleRoom,
} from 'redux/actions/message';
import { fetchActiveRoomsReq } from 'redux/actions/message';
import { useDispatch } from 'react-redux';
import {
  SOCKET_RECEIVE_INTEREST,
  SOCKET_DISCONNECT,
  SOCKET_INIT_SOCKET,
  SOCKET_RECEIVE_MSG,
  SOCKET_RECEIVE_LATEST_NOTIFICATION,
  SOCKET_JOIN_SINGLE_ROOM,
  SOCKET_LEAVE_SINGLE_ROOM,
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

  let socketIo: Socket | undefined = undefined;

  if (isSignedIn) {
    // interest socket
    socketIo = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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

    socketIo.on(SOCKET_RECEIVE_MSG, (messages: MessageResponseProps[]) => {
      dispatch(fetchCurrentRoomMsgsSuccess(messages));
    });

    socketIo.on(SOCKET_JOIN_SINGLE_ROOM, (room: ActiveRoomsResponse) => {
      dispatch(joinSingleRoom(room));
    });

    socketIo.on(SOCKET_LEAVE_SINGLE_ROOM, (leaveRoomId: string) => {
      console.log('leaveRoomId', leaveRoomId);
      dispatch(leaveSingleRoom(leaveRoomId));
    });
  }

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
