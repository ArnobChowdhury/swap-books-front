import { useEffect } from 'react';
import { createContext } from 'react';
import io from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { NotificationResponseShape } from 'redux/reducers/notifications';
import { MessageResponseProps } from 'redux/reducers/message';
import { useSelector } from 'react-redux';
import { expressInterestSuccess } from 'redux/actions/book';
import { addLatestNotification } from 'redux/actions/notifications';
import { fetchCurrentRoomMsgsSuccess } from 'redux/actions/message';
import { fetchActiveRoomsReq } from 'redux/actions/message';
import { useDispatch } from 'react-redux';
import {
  SOCKET_RECEIVE_INTEREST,
  SOCKET_DISCONNECT,
  SOCKET_JOIN_INTEREST_SOCKET,
  SOCKET_RECEIVE_MSG,
  SOCKET_RECEIVE_LATEST_NOTIFICATION,
} from 'socketTypes';

interface SocketIoInterestContextProps {
  socketIo: SocketIOClient.Socket | undefined;
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

  let socketIo: SocketIOClient.Socket | undefined = undefined;

  if (isSignedIn) {
    // interest socket
    socketIo = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      query: `token=${accessToken}`,
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
  }

  useEffect(() => {
    if (isSignedIn && socketIo && userId) {
      // TODO: Can be got rid of once interest expression is also through rooms
      socketIo.emit(SOCKET_JOIN_INTEREST_SOCKET, { userId });
    }
    if (isSignedIn && socketIo && userId) {
      dispatch(fetchActiveRoomsReq(socketIo, userId));
    }
  });

  const { Provider: SocketIoProvider } = SocketIoContext;

  return <SocketIoProvider value={{ socketIo }}>{children}</SocketIoProvider>;
};
