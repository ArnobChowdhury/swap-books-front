import { useState, KeyboardEvent, useContext, useRef, useEffect } from 'react';
import {
  MessageBoxContainer,
  MessageIconContainer,
  CrossIconContainer,
  MessageListUL,
  MessageListItem,
  MessageBox,
  MessageListContainer,
  MessageListTitle,
  MessageContent,
  MessageInputWrapper,
  MessageInput,
  MessageContentTop,
  MessageContentMain,
  SendIconWrapper,
  SingleChat,
} from './Message.styles';
import { ChatIcon } from 'assets/ChatIcon';
import { CloseIcon } from 'assets/CloseIcon';
import { SendIcon } from 'assets/SendIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  openMessageBox,
  closeMessageBox,
  fetchCurrentRoomMsgsReq,
  sendMsgToRoom,
  setCurrentRoom,
} from 'redux/actions/message';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from '../Sockets';
import { MessageResponseProps } from 'redux/reducers/message';

export const Message = () => {
  const { socketMsg } = useContext(SocketIoContext);
  const dispatch = useDispatch();
  const {
    messageBoxIsOpen,
    activeRooms,
    roomMateName: activeRoomMateName,
    roomId,
    roomMateId,
    messages,
  } = useSelector((store: RootState) => store.message);

  const { userId } = useSelector((store: RootState) => store.auth);

  const handleMsgItemClick = (
    roomId: string,
    roomMateId: string,
    roomMateName: string,
  ) => {
    dispatch(setCurrentRoom(roomId, roomMateName, roomMateId));
  };

  useEffect(() => {
    if (roomId && socketMsg) {
      dispatch(fetchCurrentRoomMsgsReq(socketMsg, roomId));
    }
  }, [roomId]);

  const [msg, setMsg] = useState('');

  let matchesList;
  if (activeRooms) {
    matchesList = activeRooms.map(room => {
      const { roomId, roomMateId, roomMateName } = room;
      return (
        <MessageListItem
          onClick={() => handleMsgItemClick(roomId, roomMateId, roomMateName)}
          key={roomMateId}
          isActive={roomMateName === activeRoomMateName}
        >
          {roomMateName}
        </MessageListItem>
      );
    });
  }

  let messagesList: JSX.Element[] = [];
  if (messages && messages.length > 0) {
    messagesList = messages.map((message: MessageResponseProps) => {
      const { msg, fromId, _id } = message;
      return (
        <SingleChat own={fromId === userId} key={_id}>
          {msg}
        </SingleChat>
      );
    });
  }

  const handleMsgEnter = (
    e:
      | KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (
      (e.type === 'keyup' && (e as KeyboardEvent).key === 'Enter') ||
      e.type === 'click'
    ) {
      if (socketMsg && roomId && userId && roomMateId) {
        dispatch(sendMsgToRoom(socketMsg, roomId, msg, userId, roomMateId));
      }
      setMsg('');
    }
  };

  // scrolling
  const msgsBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const msgBoxHeight = msgsBoxRef.current?.scrollHeight;
    msgsBoxRef.current?.scrollTo(0, msgBoxHeight as number);
  }, [messages, messageBoxIsOpen]);

  return (
    <>
      {messageBoxIsOpen && (
        <MessageBoxContainer show={messageBoxIsOpen}>
          <CrossIconContainer onClick={() => dispatch(closeMessageBox())}>
            <CloseIcon width="12" height="12" color="rgb(65,65,65)" />
          </CrossIconContainer>
          <MessageListContainer>
            <MessageListTitle>All Matches</MessageListTitle>
            <MessageListUL>{matchesList}</MessageListUL>
          </MessageListContainer>
          <MessageBox>
            <MessageContent>
              <MessageContentTop>{activeRoomMateName}</MessageContentTop>
              <MessageContentMain ref={msgsBoxRef}>
                {messagesList && messagesList.length > 0 && messagesList}
                {(!messagesList || messagesList.length === 0) && 'Jare jare ja'}
              </MessageContentMain>
            </MessageContent>
            <MessageInputWrapper>
              <MessageInput
                type="text"
                value={msg}
                onChange={e => setMsg(e.currentTarget.value)}
                onKeyUp={e => handleMsgEnter(e)}
              />
              <SendIconWrapper onClick={handleMsgEnter}>
                <SendIcon width="25" height="50" />
              </SendIconWrapper>
            </MessageInputWrapper>
          </MessageBox>
        </MessageBoxContainer>
      )}
      {!messageBoxIsOpen && (
        <MessageIconContainer
          show={!messageBoxIsOpen}
          onClick={() => dispatch(openMessageBox())}
        >
          <ChatIcon width="35" height="35" />
        </MessageIconContainer>
      )}
    </>
  );
};
