import { StyledUserIcon } from './UserIcon.styles';
import { getUserInitials } from 'utils/index';

interface UserIconProps {
  userName: string;
  hasRightMargin?: boolean;
  largeIcon?: boolean;
  hasBodyColor?: boolean;
}

export const UserIcon = ({
  userName = '',
  hasRightMargin = false,
  largeIcon = false,
  hasBodyColor = false,
}: UserIconProps) => {
  const userInitials = getUserInitials(userName);
  return (
    <StyledUserIcon
      hasBodyColor={hasBodyColor}
      largeIcon={largeIcon}
      hasRightMargin={hasRightMargin}
    >
      {userInitials}
    </StyledUserIcon>
  );
};
