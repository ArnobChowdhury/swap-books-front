import { useEffect, useState, useCallback } from 'react';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { RootState } from 'redux/reducers';
import { NotificationResponseShape } from 'redux/reducers/notifications';
import { MessageResponseProps, ActiveRoomsResponse } from 'redux/reducers/message';
import { useSelector } from 'react-redux';
import { expressInterestSuccess, swapRequestGotAccepted } from 'redux/actions/book';
import { addLatestNotification } from 'redux/actions/notifications';
import {
  addNewMsgToRoom,
  joinSingleRoom,
  leaveSingleRoom,
  setAsSeenSuccess,
  addUnreadMsgsNotification,
  userIsOffline,
  userIsOnline,
  isUserTyping,
} from 'redux/actions/message';
import { fetchActiveRoomsReq } from 'redux/actions/message';
import { useDispatch } from 'react-redux';
import {
  SOCKET_RECEIVE_INTEREST,
  SOCKET_DISCONNECT,
  SOCKET_RECEIVE_NEW_MSG,
  SOCKET_RECEIVE_LATEST_NOTIFICATION,
  SOCKET_JOIN_SINGLE_ROOM,
  SOCKET_LEAVE_SINGLE_ROOM,
  SOCKET_SET_MSG_AS_SEEN,
  SOCKET_USER_OFFLINE,
  SOCKET_USER_ONLINE,
  SOCKET_USER_TYPING,
  SOCKET_SWAP_CONSENT,
} from 'socketTypes';
import { playNotification } from 'utils';

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
  const { accessToken, expirationDate } = useSelector((s: RootState) => s.auth);
  const { roomId, messageBoxIsOpen } = useSelector((s: RootState) => s.message);
  const isSignedIn = Boolean(accessToken);

  const dispatch = useDispatch();

  const [socketIo, setSocketIo] = useState<Socket | undefined>();

  // TODO: ADD SOCKETIO AS DEPENDENCY AND ONLY RE-CONNECT IN CASE IT IS NOT DEFINED
  useEffect(() => {
    const currentTime = new Date().getTime();
    if (isSignedIn && currentTime < expirationDate) {
      if (socketIo && socketIo.disconnected) {
        socketIo.io.opts.extraHeaders = { Authorization: `Bearer ${accessToken}` };
        socketIo.connect();
      } else {
        setSocketIo(
          io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
            extraHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        );
      }
    }

    if (!isSignedIn && socketIo) {
      socketIo.disconnect();
      // TODO: Consider destroying the socket instance
    }
    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, [isSignedIn, socketIo, expirationDate]);

  useEffect(() => {
    if (socketIo) {
      socketIo.on(
        SOCKET_RECEIVE_LATEST_NOTIFICATION,
        (notification: NotificationResponseShape) => {
          playNotification('play/notification.mp3');
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
          playNotification('play/newmsg.mp3');
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

      socketIo.on(SOCKET_USER_OFFLINE, (userId: string) => {
        dispatch(userIsOffline(userId));
      });

      socketIo.on(SOCKET_USER_ONLINE, (userId: string) => {
        dispatch(userIsOnline(userId));
      });

      socketIo.on(SOCKET_USER_TYPING, (roomId: string, isTyping: boolean) => {
        dispatch(isUserTyping(roomId, isTyping));
      });

      socketIo.on(SOCKET_SWAP_CONSENT, (swapAcceptedForBook: string) => {
        dispatch(swapRequestGotAccepted(swapAcceptedForBook));
      });

      return () => {
        socketIo.off();
      };
    }
  }, [socketIo, roomId, messageBoxIsOpen]);

  useEffect(() => {
    /**
     *  TODO for later:
     *  1. When we destroy socket instance after signingout we can add another codition isSignedIn to the if block otherwise it emits this action abruptly
     */

    if (socketIo !== undefined && isSignedIn) {
      dispatch(fetchActiveRoomsReq(socketIo));
    }
  }, [socketIo]);

  const { Provider: SocketIoProvider } = SocketIoContext;

  return <SocketIoProvider value={{ socketIo }}>{children}</SocketIoProvider>;
};
