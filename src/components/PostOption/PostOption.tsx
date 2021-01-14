import { StyledButton } from './PostOption.styles';
import { MouseEvent, useState } from 'react';
import { PostOptionIcon } from 'assets/PostOptionIcon';

interface Option {
  name: string;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export interface PostOptionProps {
  options: Option[];
}

export const PostOption: React.FC<PostOptionProps> = ({
  options,
}: PostOptionProps): JSX.Element => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const optionsAsListItem = options.map((option, ind) => {
    return (
      <div key={ind} onClick={option.onClick}>
        {option.name}
      </div>
    );
  });

  return (
    <>
      <StyledButton onClick={() => setShowOptions(!showOptions)}>
        <PostOptionIcon width="20" height="20" />
      </StyledButton>
      {showOptions && optionsAsListItem}
    </>
  );
};
