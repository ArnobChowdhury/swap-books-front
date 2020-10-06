import { useEffect } from 'react';
import { createContext } from 'react';
import io from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { NotificationResponseShape } from 'redux/reducers/notifications';
import { MessageResponseProps } from 'redux/reducers/message';
import { useSelector } from 'react-redux';
import { expressInterestSuccess } from 'redux/actions/book';
import {
  getNotificationsRequest,
  getNotificationSuccess,
} from 'redux/actions/notifications';
import { fetchCurrentRoomMsgsSuccess } from 'redux/actions/message';
import { fetchActiveRoomsReq } from 'redux/actions/message';
import { useDispatch } from 'react-redux';
import {
  SOCKET_RECEIVE_INTEREST,
  SOCKET_DISCONNECT,
  SOCKET_RECEIVE_NOTIFICATION,
  SOCKET_RECEIVE_MSG,
} from 'socketTypes';

interface SocketIoInterestContextProps {
  socketInterest: SocketIOClient.Socket | undefined;
  socketMsg: SocketIOClient.Socket | undefined;
}

const SocketInitialValue: SocketIoInterestContextProps = {
  socketInterest: undefined,
  socketMsg: undefined,
};

export const SocketIoContext = createContext(SocketInitialValue);

interface SocketIOInterestInterface {
  children: React.ReactNode;
}

export const SocketIO = ({ children }: SocketIOInterestInterface) => {
  const token = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.token,
  );
  const isSignedIn = Boolean(token);
  const userId = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.userId,
  );

  const dispatch = useDispatch();

  let socketInterest: SocketIOClient.Socket | undefined = undefined;
  let socketMsg: SocketIOClient.Socket | undefined = undefined;

  if (isSignedIn) {
    // interest socket
    socketInterest = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/interest`);

    socketInterest.on(
      SOCKET_RECEIVE_NOTIFICATION,
      (notification: NotificationResponseShape[]) => {
        // something like below code will be implemented for notification
        // todo some thing is wrong here
        dispatch(getNotificationSuccess(notification));
      },
    );

    // @ts-ignore
    socketInterest.on(SOCKET_RECEIVE_INTEREST, ({ bookId, interestState }) => {
      // todo hardcoded bookId needs to change
      dispatch(expressInterestSuccess(bookId, interestState === 'INTERESTED'));
    });

    socketInterest.on(SOCKET_DISCONNECT, () => {
      // eslint-disable-next-line
      console.log('disconnecting, do something');
    });

    // message socket
    socketMsg = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/messages`);
    socketMsg.on(SOCKET_RECEIVE_MSG, (messages: MessageResponseProps[]) => {
      dispatch(fetchCurrentRoomMsgsSuccess(messages));
    });
  }

  useEffect(() => {
    if (isSignedIn && socketInterest && userId) {
      dispatch(getNotificationsRequest(socketInterest, userId));
    }
    if (isSignedIn && socketMsg && userId) {
      dispatch(fetchActiveRoomsReq(socketMsg, userId));
    }
  });

  const { Provider: SocketIoProvider } = SocketIoContext;

  return (
    <SocketIoProvider value={{ socketInterest, socketMsg }}>
      {children}
    </SocketIoProvider>
  );
};
