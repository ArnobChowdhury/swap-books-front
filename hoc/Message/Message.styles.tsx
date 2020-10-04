import styled from 'styled-components';

export const MessageBoxContainer = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  bottom: ${({ theme }) => theme.spaceTen};
  right: ${({ theme }) => theme.spaceTen};
  height: 400px;
  width: 600px;
  border-radius: 5px;
  box-shadow: 0px 5px 40px rgba(0, 0, 0, 0.36);
  background: rgb(245, 245, 245);

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaceFive};
`;

export const MessageIconContainer = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: ${({ theme }) => theme.spaceTen};
  right: ${({ theme }) => theme.spaceTen};
  height: 70px;
  width: 70px;
  border-radius: 100%;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.26);
  display: ${({ show }) => (show ? 'flex' : 'none')};
  justify-content: center;
  background: ${({ theme }) => theme.colorYellowDeep};
  align-items: center;
  cursor: pointer;
`;

export const CrossIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const MessageListContainer = styled.div`
  height: 100%;
  flex-basis: 25%;
  margin-right: ${({ theme }) => theme.spaceFive};
  border-radius: 3px;
  background: rgb(255, 255, 255);
`;

export const MessageListTitle = styled.div`
  height: 40px;
  font-size: ${({ theme }) => theme.fontSizeMedium};
  font-weight: 600;
  padding: ${({ theme }) => theme.spaceFive};
`;

export const MessageListUL = styled.ul`
  list-style: none;
  height: 100%;
`;
//padding: ${({ theme }) => theme.spaceTen};

export const MessageListItem = styled.li<{ isActive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizeMedium};
  cursor: pointer;
  background: ${({ theme, isActive }) => isActive && theme.colorYellowDeep};
  padding: ${({ theme }) => theme.spaceFive};
  &:hover {
    background: ${({ isActive, theme }) => !isActive && theme.colorGreyLight};
  }
`;

// todo need to introduce below light backgournd to the theme
export const MessageBox = styled.div`
  background: rgb(255, 255, 255);
  border-radius: 3px;
  height: 100%;
  width: 100%;
`;

export const MessageContent = styled.div`
  height: 88%;
  width: 100%;
`;

export const MessageContentTop = styled.div`
  height: 40px;
  width: 100%;
  font-size: ${({ theme }) => theme.fontSizeOne};
  font-weight: 600;
  padding: ${({ theme }) => theme.spaceFive};
`;

export const MessageContentMain = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spaceFive};
`;

export const MessageInputWrapper = styled.div`
  height: 12%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `0 ${theme.spaceFive} ${theme.spaceFive}`};
`;

export const MessageInput = styled.input`
  height: 100%;
  width: 420px;
  border: ${({ theme }) => `1px solid ${theme.colorYellowDeep}`};
  padding: ${({ theme }) => theme.spaceFive};
  margin-right: ${({ theme }) => theme.spaceFour};
  border-radius: 3px;
`;

export const SendIconWrapper = styled.button`
  cursor: pointer;
  border: none;
  height: 100%;
  display: flex;
  align-items: center;
  background: transparent;
  transition: 0.1s;
  outline: none;

  &:active {
    transform: translateY(5%);
  }
`;
