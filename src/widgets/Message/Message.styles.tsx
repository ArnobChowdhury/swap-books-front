import styled, { keyframes } from 'styled-components';
import { largeScreen, mediumScreen } from 'mediaConfig';

export const MessageBoxContainer = styled.div<{
  messageBoxIsOpen: boolean;
  isMessagePage: boolean;
  windowHeight: number;
}>`
  width: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow};
  position: relative;
  overflow: hidden;
  height: ${({ messageBoxIsOpen, windowHeight }) =>
    messageBoxIsOpen ? `calc(${windowHeight}px - 130px)` : 'auto'};

  @media (min-width: ${mediumScreen}px) {
    margin-top: ${({ theme }) => theme.spaceFive};
    height: ${({ messageBoxIsOpen, windowHeight }) =>
      messageBoxIsOpen ? `calc(${windowHeight}px - 140px)` : 'auto'};
  }

  @media (min-width: ${largeScreen}px) {
    margin-top: ${({ isMessagePage }) => !isMessagePage && '0'};
    max-height: ${({ isMessagePage }) => !isMessagePage && '480px'};
  }
`;

export const MessageListContainer = styled.div`
  flex-basis: 40%;
  background: ${({ theme }) => theme.colorWhite};
  padding-top: ${({ theme }) => theme.spaceEight};
  box-shadow: ${({ theme }) => theme.boxShadow};

  @media (min-width: ${largeScreen}px) {
    padding-top: ${({ theme }) => theme.spaceSix};
  }
`;

export const MessageListUL = styled.ul`
  list-style: none;
`;

export const SideMargin = styled.div<{
  hasTopBorder?: boolean;
  hasTopAndBottomPadding?: boolean;
}>`
  margin: ${({ theme }) => `0 ${theme.spaceEight}`};
  border-top: ${({ hasTopBorder, theme }) =>
    hasTopBorder && `1px solid ${theme.colorSeparator}`};
  display: flex;
  align-items: center;
  height: 100%;
  padding: ${({ theme, hasTopAndBottomPadding }) =>
    hasTopAndBottomPadding && `${theme.spaceEight} 0`};

  @media (min-width: ${largeScreen}px) {
    margin: ${({ theme }) => `0 ${theme.spaceSix}`};
  }
`;

export const MessageSenderName = styled.div<{ hasUnreadMsgs?: boolean }>`
  font-weight: ${({ hasUnreadMsgs }) => hasUnreadMsgs && '500'};
`;

export const UnreadMsgTxt = styled.div`
  width: ${({ theme }) => theme.spaceEight};
  height: ${({ theme }) => theme.spaceEight};
  border-radius: 100%;
  background: ${({ theme }) => theme.colorTextPrimary};
  margin-left: auto;
`;

export const MessageListItem = styled.li`
  font-size: ${({ theme }) => theme.fontSmall};
  cursor: pointer;
  font-weight: 400;
  &:hover {
    background: ${({ theme }) => theme.colorSeparator};
  }
`;

// todo need to introduce below light backgournd to the theme
export const MessageBox = styled.div<{ show: boolean }>`
  border-radius: 3px;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colorWhite};
  position: absolute;
  top: 0;
  left: ${({ show }) => (show ? '0' : '105%')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  outline: none;
`;

export const MessageContent = styled.div`
  height: calc(100% - 70px);
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const MessageContentTop = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spaceSix};
  display: flex;
  background: ${({ theme }) => theme.colorWhite};
  box-shadow: ${({ theme }) => theme.boxShadow};
  z-index: 1;
`;

export const MsgPartnerInfo = styled.div``;

export const MsgPartnerName = styled.div`
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  display: flex;
  align-items: center;
  padding-left: ${({ theme }) => theme.spaceSix};
`;

export const MutualInterests = styled.div<{ showBottomMargin: boolean }>`
  padding-left: 52px;
  font-size: ${({ theme }) => theme.fontSuperSmall};
  font-weight: 400;
  display: flex;
  margin-bottom: ${({ theme, showBottomMargin }) =>
    showBottomMargin && theme.spaceFive};
  transition: margin-bottom 0.3s;
`;

export const InterestContainer = styled.div<{ show: boolean }>`
  padding-left: 52px;
  font-size: ${({ theme }) => theme.fontSuperSmall};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  opacity: ${({ show }) => (show ? '1' : '0')};
  max-height: ${({ show }) => (show ? '500px' : '0')};
  transition: all 0.3s;
`;

export const MessageContentMain = styled.div`
  width: 100%;
  display: flex;
  overflow-y: auto;
  height: 100%;
  position: relative;
`;

export const MessagesWrapper = styled.div<{ hasMessages: boolean }>`
  padding: ${({ theme }) => `${theme.spaceFive} ${theme.spaceTen}`};
  width: 100%;
  margin-top: auto;
  ${({ hasMessages }) =>
    !hasMessages &&
    `
    display: flex;
    margin-top: 0;
    justify-content: center;
    align-items: center; 
  `};
`;

export const MessageInputWrapper = styled.div`
  height: 70px;
  width: 100%;
  position: relative;
  padding: ${({ theme }) =>
    `${theme.spaceEight} ${theme.spaceTen} ${theme.spaceEight}`};
`;

export const MessageInput = styled.input`
  height: 100%;
  width: 100%;
  border: 2px solid #9198a8;
  padding: ${({ theme }) =>
    `${theme.spaceFive} 4rem ${theme.spaceFive} ${theme.spaceFive}`};
  border-radius: 3px;
  font-family: inherit;
  flex-grow: 1;
  background: ${({ theme }) => theme.colorBG};
  outline: none;
  font-size: ${({ theme }) => theme.fontSmall};
  color: ${({ theme }) => theme.colorTextSecondary};

  &:focus {
    border: ${({ theme }) => `2px solid ${theme.colorTextPrimary}`};
  }
`;

export const SendIconWrapper = styled.button`
  position: absolute;
  top: 50%;
  right: 28px;
  transform: translateY(-50%);
  cursor: pointer;
  border: none;
  height: 100%;
  display: flex;
  align-items: center;
  background: transparent;
  transition: 0.1s;
  outline: none;

  &:disabled {
    opacity: 0.5;
  }
`;

// flex-basis: 100%;
export const SingleChat = styled.div<{ own: boolean }>`
  display: flex;
  justify-content: ${({ own }) => (own ? 'flex-end' : 'flex-start')};
  align-items: center;
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spaceTwo};
  }
  flex-wrap: wrap;
`;

export const SingleChatTimestamp = styled.div<{
  isSeletected: boolean;
}>`
  flex-basis: 100%;
  text-align: center;
  margin-bottom: 2px;
  max-height: ${({ isSeletected }) => (isSeletected ? '30px' : '0')};
  visibility: ${({ isSeletected }) => (isSeletected ? 'visible' : 'hidden')};
  opacity: ${({ isSeletected }) => (isSeletected ? '1' : '0')};
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSuperSmall};
  transition: max-height 0.3s, visibility 0.2s, opacity 0.1s;
`;

export const SingleChatText = styled.div<{ own: boolean }>`
  color: ${({ theme, own }) => (own ? theme.colorWhite : theme.colorTextPrimary)};
  background: ${({ theme, own }) =>
    own ? theme.colorTextPrimary : theme.colorSeparator};
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  padding: ${({ theme }) => `${theme.spaceFour} ${theme.spaceEight}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  max-width: 260px;
  cursor: pointer;

  @media (min-width: ${mediumScreen}px) {
    max-width: 400px;
  }

  @media (min-width: ${largeScreen}px) {
    max-width: 240px;
  }
  ${({ own, theme }) => own && `margin-left: ${theme.spaceFour}`}
`;

export const WMContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
`;

export const WMWrapper = styled.div`
  max-width: 300px;
  text-align: center;
`;
export const WMHeading = styled.h3`
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 600;
`;

export const WMTips = styled.p`
  font-weight: 400;
`;
export const WMEnd = styled.p`
  font-weight: 400;
`;

export const MsgShimmerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const UnreadMsgNotification = styled.div`
  position: absolute;
  padding: ${({ theme }) => theme.spaceFour};
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colorPrimary2};
  color: ${({ theme }) => theme.colorTextSecondary};
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  border-radius: 10px;
  cursor: pointer;
  z-index: 1;
`;

const mercuryTypingAnimation = keyframes`
  0% {
    transform: translateY(0px);
    background-color: #A090FF;
  }
  28% {
    transform: translateY(-7px);
    background-color:#C4BBF8;
  }
  44% {
    transform: translateY(0px);
    background-color: #A090FF; 
  }
`;

export const ChatBubble = styled.div`
  background-color: ${({ theme }) => theme.colorSeparator};
  padding: ${({ theme }) => `${theme.spaceFour} ${theme.spaceEight}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  border-bottom-left-radius: 2px;
  display: inline-block;
`;

export const Typing = styled.div`
  align-items: center;
  display: flex;
  height: 17px;
`;

export const Dot = styled.div`
  animation: ${mercuryTypingAnimation} 1.8s infinite ease-in-out;
  background-color: ${({ theme }) => theme.colorPrimary2};
  border-radius: 50%;
  height: 6px;
  width: 6px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 4px;

  &:nth-child(1) {
    animation-delay: 200ms;
  }

  &:nth-child(2) {
    animation-delay: 300ms;
  }

  &:nth-child(3) {
    animation-delay: 400ms;
  }

  &:last-child {
    margin-right: 0;
  }
`;

export const ActiveMessagesLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => `${theme.spaceSix} 0`};
  border-top: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
`;

export const NoRoomsFoundOrError = styled.div`
  font-size: ${({ theme }) => theme.fontLarge};
  font-weight: 400;
  padding: ${({ theme }) =>
    `${theme.spaceSix} ${theme.spaceSix} ${theme.spaceSix} ${theme.spaceEight}`};
  border-top: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
`;
