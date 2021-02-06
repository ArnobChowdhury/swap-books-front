import { useState, KeyboardEvent, useContext, useRef, useEffect } from 'react';
import { IconOnlyButton } from 'ui-kits/IconOnlyButton';
import { UserIcon } from 'ui-kits/UserIcon';
import { Header } from 'ui-kits/Header';
import { Paragraph } from 'ui-kits/Paragraph';
import theme from 'theme';
import {
  MessageBoxContainer,
  MessageListUL,
  MessageListItem,
  SideMargin,
  MessageBox,
  MessageListContainer,
  MsgPartnerInfo,
  MsgPartnerName,
  MutualInterests,
  ShowInterestsButton,
  InterestContainer,
  MessageContent,
  MessageInputWrapper,
  MessageInput,
  MessageContentTop,
  MessageContentMain,
  SendIconWrapper,
  SingleChat,
} from './Message.styles';
import { SendIcon } from 'assets/SendIcon';
import { LeftArrow } from 'assets/LeftArrow';
import { DownArrow } from 'assets/DownArrow';
import { useDispatch, useSelector } from 'react-redux';
import {
  openMessageBox,
  closeMessageBox,
  fetchCurrentRoomMsgsReq,
  sendMsgToRoom,
  setCurrentRoom,
} from 'redux/actions/message';
import { RootState } from 'redux/reducers';
import { SocketIoContext } from 'hoc/Sockets';
import { MessageResponseProps } from 'redux/reducers/message';
import { User } from 'components/User';
import { NotificationBookShape } from 'redux/reducers/notifications';

export const Message = () => {
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
  } = useSelector((store: RootState) => store.message);

  const { userId } = useSelector((store: RootState) => store.auth);

  const handleMsgItemClick = (
    roomId: string,
    roomMateId: string,
    roomMateName: string,
    roomMateInterests: NotificationBookShape[],
    userInterests: NotificationBookShape[],
  ) => {
    dispatch(openMessageBox());
    dispatch(
      setCurrentRoom(
        roomId,
        roomMateName,
        roomMateId,
        roomMateInterests,
        userInterests,
      ),
    );
  };

  useEffect(() => {
    if (roomId && socketIo) {
      dispatch(fetchCurrentRoomMsgsReq(socketIo, roomId));
    }
  }, [roomId]);

  const [msg, setMsg] = useState('');

  let matchesList;
  if (activeRooms) {
    matchesList = activeRooms.map(room => {
      const {
        roomId,
        roomMateId,
        roomMateName,
        roomMateInterests,
        userInterests,
      } = room;
      return (
        <MessageListItem
          onClick={() =>
            handleMsgItemClick(
              roomId,
              roomMateId,
              roomMateName,
              roomMateInterests,
              userInterests,
            )
          }
          key={roomMateId}
        >
          <SideMargin hasTopBorder hasTopAndBottomPadding>
            <UserIcon userName={roomMateName} hasRightMargin></UserIcon>
            {roomMateName}
          </SideMargin>
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
    // }, [messages, messageBoxIsOpen]);
  }, [messages]);

  const [showInterestForThisRoom, setShowInterestForThisRoom] = useState<boolean>(
    false,
  );

  const { spaceThree } = theme;
  const userInterestsAsString = userInterests
    .map(interest => interest.bookName)
    .join(', ');
  const roomMateInterestsAsString = roomMateInterests
    .map(interest => interest.bookName)
    .join(', ');

  return (
    <>
      <MessageBoxContainer hasBoxShadow={messageBoxIsOpen}>
        <MessageListContainer>
          <SideMargin>
            <Header marginBelow={spaceThree}>Chats</Header>
          </SideMargin>
          <MessageListUL>{matchesList}</MessageListUL>
        </MessageListContainer>
        <MessageBox show={messageBoxIsOpen}>
          <MessageContent>
            <MessageContentTop>
              <IconOnlyButton size={32} onClick={() => dispatch(closeMessageBox())}>
                <LeftArrow />
              </IconOnlyButton>
              <MsgPartnerInfo>
                <MsgPartnerName>
                  <UserIcon hasRightMargin userName={activeRoomMateName || ''} />
                  {activeRoomMateName}
                </MsgPartnerName>
                <MutualInterests showBottomMargin={showInterestForThisRoom}>
                  Mutual Interests
                  <ShowInterestsButton
                    rotateOneEighty={showInterestForThisRoom}
                    onClick={() =>
                      setShowInterestForThisRoom(!showInterestForThisRoom)
                    }
                  >
                    <DownArrow width="10" height="10" />
                  </ShowInterestsButton>
                </MutualInterests>
                <InterestContainer show={showInterestForThisRoom}>
                  <Paragraph
                    fontSize="superSmall"
                    fontWeight="regular"
                    marginBelow={spaceThree}
                  >
                    <strong>Your interests:</strong> {userInterestsAsString}{' '}
                  </Paragraph>
                  <Paragraph fontSize="superSmall" fontWeight="regular">
                    <strong>{activeRoomMateName}&apos;s interests:</strong>{' '}
                    {roomMateInterestsAsString}
                  </Paragraph>
                </InterestContainer>
              </MsgPartnerInfo>
            </MessageContentTop>
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
            <SendIconWrapper disabled={msg === ''} onClick={handleMsgEnter}>
              <SendIcon width="25" height="50" />
            </SendIconWrapper>
          </MessageInputWrapper>
        </MessageBox>
      </MessageBoxContainer>
    </>
  );
};
