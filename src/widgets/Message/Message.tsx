import {
  useState,
  KeyboardEvent,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
  UIEvent,
  ChangeEvent,
} from 'react';
import { useOnScreen } from 'hooks';
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
  SingleChatTimestamp,
  WMWrapper,
  WMContainer,
  WMHeading,
  WMTips,
  WMEnd,
  MsgShimmerWrapper,
  UnreadMsgNotification,
  ChatBubble,
  Typing,
  Dot,
  ActiveMessagesLoaderWrapper,
  NoRoomsFoundOrError,
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
import { useRouter } from 'next/router';
import { MESSAGES_ROUTE } from 'frontEndRoutes';
import { SOCKET_USER_TYPING } from 'socketTypes';
import { formatMsgTimeStamp } from 'utils';

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

const RoomMateTyping = () => (
  <ChatBubble>
    <Typing>
      <Dot />
      <Dot />
      <Dot />
    </Typing>
  </ChatBubble>
);

let currentScrollTop: number;

export const Message = () => {
  const { pathname } = useRouter();
  const isMessagePage = pathname === MESSAGES_ROUTE;
  const { socketIo } = useContext(SocketIoContext);
  const dispatch = useDispatch();
  const {
    messageBoxIsOpen,
    activeRooms,
    activeRoomsLoading,
    roomMateName: activeRoomMateName,
    roomId,
    roomMateId,
    roomMateInterests,
    userInterests,
    messages,
    messageLoading,
    fetchRoomMateInterestReqOnGoing,
    fetchRoomMateInterestErr,
    hasMoreMsgs,
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
    setAutoScrolledOnce(false);
    dispatch(openMessageBox());
    dispatch(setCurrentRoom(room));
  };

  useEffect(() => {
    if (roomId) {
      dispatch(fetchCurrentRoomMsgsReq(roomId, 0));
    }
  }, [roomId]);

  const [msg, setMsg] = useState('');

  const activeRoomsSorted = [...activeRooms].sort(
    (a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
  );
  let matchesList;
  if (activeRoomsSorted && activeRoomsSorted.length > 0) {
    matchesList = activeRoomsSorted.map(room => {
      const { roomId, roomMateId, roomMateName, unreadMsgs, isOnline } = room;
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
            <UserIcon
              userName={roomMateName}
              hasRightMargin
              isOnline={isOnline}
            ></UserIcon>
            <MessageSenderName hasUnreadMsgs={Boolean(unreadMsgs)}>
              {roomMateName}
            </MessageSenderName>
            {unreadMsgs && <UnreadMsgTxt />}
          </SideMargin>
        </MessageListItem>
      );
    });
  }

  const [showTimeFor, setShowTimeFor] = useState<string | null>(null);
  const handleShowMsgTime = (_id: string) => {
    if (!showTimeFor || showTimeFor !== _id) {
      setShowTimeFor(_id);
    } else {
      setShowTimeFor(null);
    }
  };

  let messagesList: JSX.Element[] = [];
  if (messages && messages.length > 0) {
    messagesList = messages.map((message: MessageResponseProps, index) => {
      const { msg, fromId, _id, registered, seen, timestamp } = message;
      if (fromId === 'admin@pustokio') {
        return (
          <WelcomMessage key={_id} name={activeRoomMateName as string} msg={msg} />
        );
      }

      if (_id === 'typing') {
        return (
          <SingleChat own={false} key={_id}>
            <RoomMateTyping />
          </SingleChat>
        );
      }

      const own = fromId === userId;
      const previousTimestamp = index === 0 ? null : messages[index - 1].timestamp;

      let shouldDisplayTime = false;
      let fifTeensminsGap;

      if (previousTimestamp) {
        fifTeensminsGap =
          new Date(timestamp).getTime() - new Date(previousTimestamp).getTime() >
          900000;
      }

      if (
        (index > 0 && messages[index - 1].fromId === 'admin@pustokio') ||
        fifTeensminsGap
      ) {
        shouldDisplayTime = true;
      }

      return (
        <SingleChat
          own={own}
          key={_id}
          {...(!own && !seen && { 'data-msgid': _id })}
        >
          <SingleChatTimestamp
            isSeletected={shouldDisplayTime || _id === showTimeFor}
          >
            {formatMsgTimeStamp(timestamp)}
          </SingleChatTimestamp>
          {own && (
            <SingleChatStatusIcon
              width="18"
              height="18"
              status={seen ? 'seen' : registered ? 'registered' : 'sending'}
            />
          )}
          <SingleChatText
            onClick={() => handleShowMsgTime(_id)}
            own={fromId === userId}
          >
            {msg}
          </SingleChatText>
        </SingleChat>
      );
    });
  }

  const [shouldScrollOnMsgChange, setShouldScrollOnMsgChange] = useState(false);

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
        setShouldScrollOnMsgChange(true);
        dispatch(sendMsgToRoom(socketIo, roomId, msg, userId, roomMateId));
      }
      setMsg('');
    }
  };

  useEffect(() => {
    if (shouldScrollOnMsgChange) {
      scrollDown();
      setShouldScrollOnMsgChange(false);
    }
  }, [messages]);

  // scrolling
  const msgsContainerRef = useRef<HTMLDivElement | null>(null);
  const [autoScrolledOnce, setAutoScrolledOnce] = useState(false);

  const scrollDown = () => {
    const msgBoxHeight = msgsContainerRef.current?.scrollHeight;
    msgsContainerRef.current?.scrollTo(0, msgBoxHeight as number);
  };

  useEffect(() => {
    if (!autoScrolledOnce) {
      scrollDown();
      if (messages.length > 0) setAutoScrolledOnce(true);
    }
  }, [messages, autoScrolledOnce]);

  const [msgBoxScrollTopMax, setMsgBoxScrollTopMax] = useState<number>();

  const updateScroll = (e: UIEvent<HTMLDivElement>) => {
    if (e.target) {
      // @ts-ignore
      currentScrollTop = e.target.scrollTop;
    }
  };

  useLayoutEffect(() => {
    if (msgsContainerRef.current) {
      const scrollTopMax =
        msgsContainerRef.current?.scrollHeight -
        msgsContainerRef.current?.clientHeight;
      if (
        msgBoxScrollTopMax !== undefined &&
        scrollTopMax > msgBoxScrollTopMax &&
        currentScrollTop !== undefined
      ) {
        const goToScrollPostion =
          scrollTopMax - msgBoxScrollTopMax + currentScrollTop;
        msgsContainerRef.current?.scrollTo(0, goToScrollPostion);
      }
      setMsgBoxScrollTopMax(scrollTopMax);
    }
  }, [messages]);

  const [firstUnseenPostion, setFirstUnseenPostion] = useState<number>();
  const [numOfUnreadMsgs, setNumOfUnreadMsgs] = useState<number>();

  useEffect(() => {
    let firstUnseenPos: number | undefined;
    let numUnread = 0;

    messages.forEach(msg => {
      const { _id, toId, seen } = msg;
      const isNotOwnersMsg = toId === userId;
      if (isNotOwnersMsg && seen === false) {
        const msgUnseenNode = document.querySelector(`div[data-msgid='${_id}']`);
        if (msgUnseenNode && msgsContainerRef.current) {
          const {
            top: containerTop,
            bottom: containerBottom,
          } = msgsContainerRef.current.getBoundingClientRect();
          const {
            top: unseenMsgTop,
            bottom: unseenMsgBottom,
          } = msgUnseenNode.getBoundingClientRect();
          const showing =
            unseenMsgTop >= containerTop && unseenMsgBottom <= containerBottom;
          if (!showing) {
            numUnread += 1;
            if (!firstUnseenPos)
              firstUnseenPos = (msgUnseenNode as HTMLElement).offsetTop - 46;
          }
        }
      }
    });

    if (firstUnseenPos) setFirstUnseenPostion(firstUnseenPos);
    setNumOfUnreadMsgs(numUnread);
  }, [messages]);

  const handleUnreadMsgScroll = () => {
    if (firstUnseenPostion)
      msgsContainerRef.current?.scrollTo(0, firstUnseenPostion);
  };

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

  const msgShimmerRef = useRef<HTMLDivElement | null>(null);

  const handlePreviousMessageFetch = () => {
    if (roomId) dispatch(fetchCurrentRoomMsgsReq(roomId, messages.length));
  };

  useOnScreen(
    msgShimmerRef,
    msgsContainerRef,
    messages,
    handlePreviousMessageFetch,
    true,
  );
  const hasMessages = messagesList.length > 0;

  const [activeUserIsOnline, setActiveUserIsOnline] = useState<boolean>(false);

  useEffect(() => {
    let activeRoomId = roomId;
    if (activeRoomId) {
      for (let i = 0; i < activeRooms.length; i++) {
        const { roomId, isOnline } = activeRooms[i];
        if (activeRoomId === roomId) {
          setActiveUserIsOnline(isOnline);
          break;
        }
      }
    }
  }, [roomId, activeRooms]);

  const handleMessageType = (e: ChangeEvent<HTMLInputElement>) => {
    const newMsg = e.currentTarget.value;
    if (!msg && newMsg) {
      socketIo?.emit(SOCKET_USER_TYPING, roomId, true);
    }
    if (msg && !newMsg) {
      socketIo?.emit(SOCKET_USER_TYPING, roomId, false);
    }
    setMsg(newMsg);
  };

  return (
    <MessageBoxContainer
      messageBoxIsOpen={messageBoxIsOpen}
      isMessagePage={isMessagePage}
    >
      <MessageListContainer>
        <SideMargin>
          <Header marginBelow={spaceThree}>Chats</Header>
        </SideMargin>
        {activeRoomsLoading && (
          <ActiveMessagesLoaderWrapper>
            <Spinner />
          </ActiveMessagesLoaderWrapper>
        )}
        {!activeRoomsLoading && activeRooms.length === 0 && (
          <NoRoomsFoundOrError>No active chats at this moment.</NoRoomsFoundOrError>
        )}
        {!activeRoomsLoading && <MessageListUL>{matchesList}</MessageListUL>}
      </MessageListContainer>
      {/**
        @ts-ignore*/}
      <MessageBox show={messageBoxIsOpen} tabIndex="0" ref={msgBoxRef}>
        <MessageContent>
          {Boolean(numOfUnreadMsgs) && (
            <UnreadMsgNotification onClick={handleUnreadMsgScroll}>
              {numOfUnreadMsgs} unread messages
            </UnreadMsgNotification>
          )}
          <MessageContentTop>
            <IconOnlyButton size={32} onClick={handleMessageBoxClose}>
              <LeftArrow />
            </IconOnlyButton>
            <MsgPartnerInfo>
              <MsgPartnerName>
                <UserIcon
                  hasRightMargin
                  userName={activeRoomMateName || ''}
                  isOnline={activeUserIsOnline}
                />
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
          <MessageContentMain ref={msgsContainerRef} onScroll={updateScroll}>
            <MessagesWrapper hasMessages={hasMessages}>
              {hasMoreMsgs && (
                <MsgShimmerWrapper ref={msgShimmerRef}>
                  <Spinner />
                </MsgShimmerWrapper>
              )}
              {hasMessages && messagesList}
              {messageLoading && <Spinner />}
            </MessagesWrapper>
          </MessageContentMain>
        </MessageContent>
        <MessageInputWrapper>
          <MessageInput
            type="text"
            value={msg}
            onChange={handleMessageType}
            onKeyUp={handleMsgEnter}
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
