import { StyledUserIcon } from './UserIcon.styles';
import { getUserInitials } from 'utils/index';

interface UserIconProps {
  userName: string;
  hasRightMargin?: boolean;
}

export const UserIcon = ({
  userName = '',
  hasRightMargin = false,
}: UserIconProps) => {
  const userInitials = getUserInitials(userName);
  return (
    <StyledUserIcon hasRightMargin={hasRightMargin}>{userInitials}</StyledUserIcon>
  );
};
