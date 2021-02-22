import {
  Container,
  ProfileIconContainer,
  ProfileInfoContainer,
} from './UserInfo.styles';
import { UserIcon } from 'ui-kits/UserIcon';
import { Header } from 'ui-kits/Header';
import { Paragraph } from 'ui-kits/Paragraph';
import theme from 'theme';

export interface UserInfoProps {
  userName: string;
  numOfAvailableBooks: number;
  numOfBooksSwapped?: number;
}

export const UserInfo = ({
  userName,
  numOfAvailableBooks,
  numOfBooksSwapped,
}: UserInfoProps) => {
  const { spaceSix, spaceFive } = theme;
  return (
    <Container>
      <ProfileIconContainer>
        <UserIcon largeIcon userName={userName} />
      </ProfileIconContainer>
      <ProfileInfoContainer>
        <Header marginBelow={spaceSix} largeFont>
          {userName}
        </Header>
        <Paragraph marginBelow={spaceFive}>
          Books Available to Swap: {numOfAvailableBooks}
        </Paragraph>
        {numOfBooksSwapped && (
          <Paragraph>Books Swapped till now: {numOfBooksSwapped}</Paragraph>
        )}
      </ProfileInfoContainer>
    </Container>
  );
};
