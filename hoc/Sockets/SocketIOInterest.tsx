import { useEffect } from 'react';
import { createContext } from 'react';
import io from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { NotificationResponseShape } from 'redux/reducers/notifications';
import { useSelector } from 'react-redux';
import { expressInterestSuccess } from 'redux/actions/book';
import {
  getNotificationsRequest,
  getNotificationSuccess,
} from 'redux/actions/notifications';
import { useDispatch } from 'react-redux';
import {
  SOCKET_RECEIVE_INTEREST,
  SOCKET_DISCONNECT,
  SOCKET_RECEIVE_NOTIFICATION,
} from 'socketTypes';

interface SocketIoInterestContextProps {
  socket: SocketIOClient.Socket | undefined;
}

const SocketInitialValue: SocketIoInterestContextProps = { socket: undefined };

export const SocketIoInterestContext = createContext(SocketInitialValue);

interface SocketIOInterestInterface {
  children: React.ReactNode;
}

export const SocketIOInterest = ({ children }: SocketIOInterestInterface) => {
  const isSignedIn = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.token,
  );
  const userId = useSelector<RootState, string | null>(
    (s: RootState) => s.auth.userId,
  );

  const dispatch = useDispatch();

  let socket: SocketIOClient.Socket | undefined = undefined;

  if (isSignedIn) {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/interest`);

    socket.on(
      SOCKET_RECEIVE_NOTIFICATION,
      (notification: NotificationResponseShape[]) => {
        // something like below code will be implemented for notification
        // todo some thing is wrong here
        dispatch(getNotificationSuccess(notification));
      },
    );

    // @ts-ignore
    socket.on(SOCKET_RECEIVE_INTEREST, ({ bookId, interestState }) => {
      // todo hardcoded bookId needs to change
      dispatch(expressInterestSuccess(bookId, interestState === 'INTERESTED'));
    });

    socket.on(SOCKET_DISCONNECT, () => {
      // eslint-disable-next-line
      console.log('disconnecting, do something');
    });
  }

  useEffect(() => {
    if (isSignedIn && socket && userId) {
      dispatch(getNotificationsRequest(socket, userId));
    }
  });

  const { Provider: SocketIoInterestProvider } = SocketIoInterestContext;

  return (
    <SocketIoInterestProvider value={{ socket }}>
      {children}
    </SocketIoInterestProvider>
  );
};
