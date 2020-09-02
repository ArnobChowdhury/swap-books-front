import { createContext } from 'react';
import io from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { useSelector } from 'react-redux';
import { expressInterestSuccess } from 'redux/actions/book';
import { useDispatch } from 'react-redux';
import {
  RECEIVE_INTEREST,
  DISCONNECT,
  GET_NOTIFICATION,
  RECEIVE_NOTIFICATION,
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

    socket.emit(GET_NOTIFICATION, userId);

    //todo any should be changed
    socket.on(RECEIVE_NOTIFICATION, (notification: any) => {
      // eslint-disable-next-line
      console.log(notification);
      // something like below code will be implemented for notification
      // dispatch(handleNotification(notification))
    });

    // @ts-ignore
    socket.on(RECEIVE_INTEREST, ({ bookId, interestState }) => {
      // todo hardcoded bookId needs to change
      dispatch(expressInterestSuccess(bookId, interestState === 'INTERESTED'));
    });

    socket.on(DISCONNECT, () => {
      // eslint-disable-next-line
      console.log('disconnecting, do something');
    });
  }

  const { Provider: SocketIoInterestProvider } = SocketIoInterestContext;

  return (
    <SocketIoInterestProvider value={{ socket }}>
      {children}
    </SocketIoInterestProvider>
  );
};
