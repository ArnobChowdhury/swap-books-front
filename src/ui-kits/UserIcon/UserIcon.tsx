import { StyledUserIcon, IsOnline } from './UserIcon.styles';
import { getUserInitials } from 'utils/index';

interface UserIconProps {
  userName: string;
  hasRightMargin?: boolean;
  largeIcon?: boolean;
  hasBodyColor?: boolean;
  isOnline?: boolean;
}

export const UserIcon = ({
  userName = '',
  hasRightMargin = false,
  largeIcon = false,
  hasBodyColor = false,
  isOnline = false,
}: UserIconProps) => {
  const userInitials = getUserInitials(userName);
  return (
    <StyledUserIcon
      hasBodyColor={hasBodyColor}
      largeIcon={largeIcon}
      hasRightMargin={hasRightMargin}
    >
      {isOnline && <IsOnline />}
      {userInitials}
    </StyledUserIcon>
  );
};
