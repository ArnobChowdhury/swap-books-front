import { Paragraph } from 'ui-kits/Paragraph';
import { Button } from 'ui-kits/Button';
import { ButtonWrapper } from './NeedBook.styles';

export const NeedBook = ({
  onAddButtonClick,
}: {
  onAddButtonClick: () => void;
}): JSX.Element => {
  return (
    <>
      <Paragraph fontSize="large" centerAlign fontWeight="regular">
        You need to add at least one book before you can show interest on others
        books.
      </Paragraph>
      <ButtonWrapper>
        <Button onClick={onAddButtonClick} asButtonTag color="blue">
          Add a book
        </Button>
      </ButtonWrapper>
    </>
  );
};
