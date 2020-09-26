import { Container, FieldWrapper } from './UserInfo.styles';
import { FlexContainer } from 'components/FlexContainer';
import { FlexItem } from 'components/FlexItem';

interface UserInfoProps {
  userName: string;
  availableBooksToSwap: number;
  booksSwappedTillNow: number;
  withinYour5km: boolean;
}

export const UserInfo = ({
  userName,
  availableBooksToSwap,
  booksSwappedTillNow,
  withinYour5km,
}: UserInfoProps) => {
  return (
    <Container>
      <FlexContainer>
        <FlexItem sm={50}>
          <FieldWrapper>
            <strong>Username:</strong> {userName}
          </FieldWrapper>
        </FlexItem>

        <FlexItem sm={50}>
          <FieldWrapper>
            <strong>Available books to swap:</strong> {availableBooksToSwap}
          </FieldWrapper>
        </FlexItem>

        <FlexItem sm={50}>
          <FieldWrapper>
            <strong>Location:</strong>{' '}
            {withinYour5km ? 'Within your 5km' : 'Too far'}
          </FieldWrapper>
        </FlexItem>

        <FlexItem sm={50}>
          <FieldWrapper>
            <strong>Books swapped:</strong> {booksSwappedTillNow}
          </FieldWrapper>
        </FlexItem>
      </FlexContainer>
    </Container>
  );
};
