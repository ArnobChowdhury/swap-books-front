import { useState, KeyboardEvent, useContext, useRef, useEffect } from 'react';
import { IconOnlyButton } from 'ui-kits/IconOnlyButton';
import { UserIcon } from 'ui-kits/UserIcon';
import { Header } from 'ui-kits/Header';
import { Paragraph } from 'ui-kits/Paragraph';
import { IconRotator } from 'ui-kits/IconRotator';
import { Spinner } from 'ui-kits/Spinner';
import theme from 'theme';
import {
  MessageBoxContainer,
  MessageListUL,
  MessageListItem,
  MessageSenderName,
  SideMargin,
  UnreadMsgTxt,
  MessageBox,
  MessageListContainer,
  MsgPartnerInfo,
  MsgPartnerName,
  MutualInterests,
  InterestContainer,
  MessageContent,
  MessageInputWrapper,
  MessageInput,
  MessageContentTop,
  MessageContentMain,
  MessagesWrapper,
  SendIconWrapper,
  SingleChat,
  SingleChatText,
  WMWrapper,
  WMContainer,
  WMHeading,
  WMTips,
  WMEnd,
} from './Message.styles';
import { SendIcon } from 'assets/SendIcon';
import { LeftArrow } from 'assets/LeftArrow';
import { DownArrow } from 'assets/DownArrow';
import { SingleChatStatusIcon } from 'assets/SingleChatStatusIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  openMessageBox,
  closeMessageBox,
  fetchCurrentRoomMsgsReq,
  sendMsgToRoom,
  setCurrentRoom,
  setAsSeenRequest,
  fetchRoomInterestReq,
} from 'redux/actions/message';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from 'hoc/Sockets';
import { MessageResponseProps } from 'redux/reducers/message';
import { NotificationBookShape } from 'redux/reducers/notifications';
import { useRouter } from 'next/router';
import { MESSAGES_ROUTE } from 'frontEndRoutes';

const WelcomMessage = ({ name, msg }: { name: string; msg: string }) => {
  const msgAsArray = msg.split('. ');
  const heading = msgAsArray[0];
  const endIndex = msgAsArray.length - 1;
  const end = msgAsArray[endIndex];
  const body = msgAsArray.slice(1, endIndex).join('. ');
  return (
    <WMContainer>
      <WMWrapper>
        <WMHeading>
          {heading} with {name}
        </WMHeading>
        <WMTips>{body}.</WMTips>
        <WMEnd>{end}</WMEnd>
      </WMWrapper>
    </WMContainer>
  );
};

export const Message = () => {
  const { pathname } = useRouter();
  const isMessagePage = pathname === MESSAGES_ROUTE;
  const { socketIo } = useContext(SocketIoContext);
  const dispatch = useDispatch();
  const {
    messageBoxIsOpen,
    activeRooms,
    roomMateName: activeRoomMateName,
    roomId,
    roomMateId,
    roomMateInterests,
    userInterests,
    messages,
    messageLoading,
    fetchRoomMateInterestReqOnGoing,
    fetchRoomMateInterestErr,
  } = useSelector((store: RootState) => store.message);

  const { userId } = useSelector((store: RootState) => store.auth);
  const [showInterestForThisRoom, setShowInterestForThisRoom] = useState<boolean>(
    false,
  );

  const handleMsgItemClick = (room: {
    roomId: string;
    roomMateId: string;
    roomMateName: string;
  }) => {
    dispatch(openMessageBox());
    dispatch(setCurrentRoom(room));
  };

  useEffect(() => {
    if (roomId && socketIo) {
      dispatch(fetchCurrentRoomMsgsReq(socketIo, roomId));
    }
  }, [roomId]);

  const [msg, setMsg] = useState('');

  let matchesList;
  if (activeRooms && activeRooms.length > 0) {
    matchesList = activeRooms.map(room => {
      const { roomId, roomMateId, roomMateName, unreadMsgs } = room;
      return (
        <MessageListItem
          onClick={() =>
            handleMsgItemClick({
              roomId,
              roomMateId,
              roomMateName,
            })
          }
          key={roomMateId}
        >
          <SideMargin hasTopBorder hasTopAndBottomPadding>
            <UserIcon userName={roomMateName} hasRightMargin></UserIcon>
            <MessageSenderName hasUnreadMsgs={Boolean(unreadMsgs)}>
              {roomMateName}
            </MessageSenderName>
            {unreadMsgs && <UnreadMsgTxt />}
          </SideMargin>
        </MessageListItem>
      );
    });
  }

  let messagesList: JSX.Element[] = [];
  if (messages && messages.length > 0) {
    messagesList = messages.map((message: MessageResponseProps) => {
      const { msg, fromId, _id, registered, seen } = message;
      if (fromId === 'admin@pustokio') {
        return <WelcomMessage name={activeRoomMateName as string} msg={msg} />;
      }

      const own = fromId === userId;
      return (
        <SingleChat
          own={own}
          key={_id}
          {...(!own && !seen && { 'data-msgid': _id })}
        >
          {own && (
            <SingleChatStatusIcon
              width="18"
              height="18"
              status={seen ? 'seen' : registered ? 'registered' : 'sending'}
            />
          )}
          <SingleChatText own={fromId === userId}>{msg}</SingleChatText>
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
      if (socketIo && roomId && userId && roomMateId && msg !== '') {
        dispatch(sendMsgToRoom(socketIo, roomId, msg, userId, roomMateId));
      }
      setMsg('');
    }
  };

  // scrolling
  const msgsBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const msgBoxHeight = msgsBoxRef.current?.scrollHeight;
    msgsBoxRef.current?.scrollTo(0, msgBoxHeight as number);
  }, [messages]);

  const { spaceThree } = theme;
  const userInterestsAsString =
    userInterests.length > 0 ? userInterests.join(', ') : '';
  const roomMateInterestsAsString =
    roomMateInterests.length > 0 ? roomMateInterests.join(', ') : '';

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && messageBoxIsOpen) {
      inputRef.current.focus();
    }
  }, [messageBoxIsOpen]);

  const msgBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (msgBoxRef.current) {
      const nodes = document.querySelectorAll('div[data-msgid]');
      const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            msgBoxRef.current?.contains(document.activeElement)
          ) {
            const msgId = (entry.target as HTMLElement).dataset.msgid;
            // @ts-ignore
            if (window.requestIdleCallback) {
              // @ts-ignore
              window.requestIdleCallback(() => {
                if (socketIo && roomId && msgId) {
                  dispatch(setAsSeenRequest(socketIo, roomId, msgId));
                }
              });
            } else {
              if (socketIo && roomId && msgId) {
                dispatch(setAsSeenRequest(socketIo, roomId, msgId));
              }
            }
            // dispatch a request
            observer.unobserve(entry.target);
          }
        });
      });
      nodes.forEach(node => {
        intersectionObserver.observe(node);
      });

      return () => {
        intersectionObserver.disconnect();
      };
    }
  }, [messages]);

  const handleMutualInterests = () => {
    if (!showInterestForThisRoom) {
      dispatch(fetchRoomInterestReq(roomId as string));
    }
    setShowInterestForThisRoom(!showInterestForThisRoom);
  };

  const handleMessageBoxClose = () => {
    setShowInterestForThisRoom(false);
    dispatch(closeMessageBox());
  };

  const hasMessages = messagesList.length > 0;

  return (
    <MessageBoxContainer
      messageBoxIsOpen={messageBoxIsOpen}
      isMessagePage={isMessagePage}
    >
      <MessageListContainer>
        <SideMargin>
          <Header marginBelow={spaceThree}>Chats</Header>
        </SideMargin>
        <MessageListUL>{matchesList}</MessageListUL>
      </MessageListContainer>
      {/**
        @ts-ignore*/}
      <MessageBox show={messageBoxIsOpen} tabIndex="0" ref={msgBoxRef}>
        <MessageContent>
          <MessageContentTop>
            <IconOnlyButton size={32} onClick={handleMessageBoxClose}>
              <LeftArrow />
            </IconOnlyButton>
            <MsgPartnerInfo>
              <MsgPartnerName>
                <UserIcon hasRightMargin userName={activeRoomMateName || ''} />
                {activeRoomMateName}
              </MsgPartnerName>
              <MutualInterests showBottomMargin={showInterestForThisRoom}>
                Mutual Interests
                <IconRotator
                  rotateOneEighty={showInterestForThisRoom}
                  onClick={handleMutualInterests}
                >
                  <DownArrow width="10" height="10" />
                </IconRotator>
              </MutualInterests>
              <InterestContainer show={showInterestForThisRoom}>
                <Paragraph
                  fontSize="superSmall"
                  fontWeight="regular"
                  marginBelow={spaceThree}
                >
                  <strong>Your interests:</strong>{' '}
                  {fetchRoomMateInterestReqOnGoing && 'Loading...'}
                  {!fetchRoomMateInterestReqOnGoing &&
                    !fetchRoomMateInterestErr &&
                    userInterestsAsString}
                  {fetchRoomMateInterestErr && fetchRoomMateInterestErr.message}{' '}
                </Paragraph>
                <Paragraph fontSize="superSmall" fontWeight="regular">
                  <strong>{activeRoomMateName}&apos;s interests:</strong>{' '}
                  {fetchRoomMateInterestReqOnGoing && 'Loading...'}
                  {!fetchRoomMateInterestReqOnGoing &&
                    !fetchRoomMateInterestErr &&
                    roomMateInterestsAsString}
                  {fetchRoomMateInterestErr && fetchRoomMateInterestErr.message}{' '}
                </Paragraph>
              </InterestContainer>
            </MsgPartnerInfo>
          </MessageContentTop>
          <MessageContentMain ref={msgsBoxRef}>
            <MessagesWrapper hasMessages={hasMessages}>
              {hasMessages && messagesList}
              {messageLoading && <Spinner />}
            </MessagesWrapper>
          </MessageContentMain>
        </MessageContent>
        <MessageInputWrapper>
          <MessageInput
            type="text"
            value={msg}
            onChange={e => setMsg(e.currentTarget.value)}
            onKeyUp={e => handleMsgEnter(e)}
            ref={inputRef}
          />
          <SendIconWrapper disabled={msg === ''} onClick={handleMsgEnter}>
            <SendIcon width="25" height="50" />
          </SendIconWrapper>
        </MessageInputWrapper>
      </MessageBox>
    </MessageBoxContainer>
  );
};
