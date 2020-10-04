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
} from './Message.styles';
import { ChatIcon } from 'assets/ChatIcon';
import { CloseIcon } from 'assets/CloseIcon';
import { SendIcon } from 'assets/SendIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  openMessageBox,
  closeMessageBox,
  fetchCurrentRoomMsgsReq,
} from 'redux/actions/message';
import { RootState } from 'redux/reducers';

export const Message = () => {
  const dispatch = useDispatch();
  const {
    messageBoxIsOpen,
    activeRooms,
    roomMateName: activeRoomMateName,
  } = useSelector((store: RootState) => store.message);

  const handleMsgItemClick = (
    roomId: string,
    roomMateId: string,
    roomMateName: string,
  ) => {
    dispatch(fetchCurrentRoomMsgsReq(roomId, roomMateName, roomMateId));
  };

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
              <MessageContentMain>Right now it is empty</MessageContentMain>
            </MessageContent>
            <MessageInputWrapper>
              <MessageInput type="text" />
              <SendIconWrapper>
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
