import { useContext } from 'react';
import { ActivityContainer, ActivitySections } from './ActivityBar.styles';
import { IconButton } from 'ui-kits/IconButton';
import { AddBookIcon } from 'assets/AddBookIcon';
import { LocatorIcon } from 'assets/LocatorIcon';
import { RootContext, RootContextProps } from 'contexts/RootContext';

export const ActivityBar = (): JSX.Element => {
  const rootContext = useContext(RootContext);
  const { setPopupType, setShowModal } = rootContext as RootContextProps;

  const handleLocationButtonClick = () => {
    setShowModal(true);
    setPopupType('location');
  };

  const handleAddABookButtonClick = () => {
    setShowModal(true);
    setPopupType('addABook');
  };

  return (
    <ActivityContainer>
      <ActivitySections rightBorder>
        <IconButton
          buttonText="Select location"
          onClick={handleLocationButtonClick}
          icon={<LocatorIcon />}
        />
      </ActivitySections>
      <ActivitySections>
        <IconButton
          buttonText="Add a book"
          onClick={handleAddABookButtonClick}
          icon={<AddBookIcon />}
        />
      </ActivitySections>
    </ActivityContainer>
  );
};
