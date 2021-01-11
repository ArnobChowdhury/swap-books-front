import { ActivityContainer, ActivitySections } from './ActivityBar.styles';
import { IconButton } from 'components/IconButton';
import { AddBookIcon } from 'assets/AddBookIcon';
import { LocatorIcon } from 'assets/LocatorIcon';

export interface ActivityBarProps {
  onLocatorButtonClick: () => void;
  onAddBookButtonClick: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  onLocatorButtonClick,
  onAddBookButtonClick,
}: ActivityBarProps): JSX.Element => {
  return (
    <ActivityContainer>
      <ActivitySections rightBorder>
        <IconButton
          buttonText="Select Location"
          onClick={onLocatorButtonClick}
          icon={<LocatorIcon />}
        />
      </ActivitySections>
      <ActivitySections>
        <IconButton
          buttonText="Add a book"
          onClick={onAddBookButtonClick}
          icon={<AddBookIcon />}
        />
      </ActivitySections>
    </ActivityContainer>
  );
};
