import { useContext } from 'react';
import { ActivityContainer, ActivitySections } from './ActivityBar.styles';
import { IconButton } from 'ui-kits/IconButton';
import { AddBookIcon } from 'assets/AddBookIcon';
import { LocatorIcon } from 'assets/LocatorIcon';
import { RootContext, RootContextProps } from 'contexts/RootContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { addABookRefresh } from 'redux/actions/book';
import { useDispatch } from 'react-redux';

export const ActivityBar = (): JSX.Element => {
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const isSignedIn = Boolean(accessToken);

  const rootContext = useContext(RootContext);
  const { setPopupType, setShowModal } = rootContext as RootContextProps;

  const handleLocationButtonClick = () => {
    setShowModal(true);
    setPopupType('location');
  };

  const dispatch = useDispatch();
  const handleAddABookButtonClick = () => {
    if (isSignedIn) {
      dispatch(addABookRefresh());
      setShowModal(true);
      setPopupType('addABook');
    } else {
      setShowModal(true);
      setPopupType('requireLoginOrSignup');
    }
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
