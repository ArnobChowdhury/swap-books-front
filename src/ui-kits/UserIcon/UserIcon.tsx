import { StyledUserIcon } from './UserIcon.styles';
import { getUserInitials } from 'utils/index';

interface UserIconProps {
  userName: string;
  hasRightMargin?: boolean;
  largeIcon?: boolean;
}

export const UserIcon = ({
  userName = '',
  hasRightMargin = false,
  largeIcon = false,
}: UserIconProps) => {
  const userInitials = getUserInitials(userName);
  return (
    <StyledUserIcon largeIcon={largeIcon} hasRightMargin={hasRightMargin}>
      {userInitials}
    </StyledUserIcon>
  );
};
