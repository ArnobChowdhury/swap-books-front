import { ModalDiv, LogoBox, BackgroundDiv } from './Modal.styles';
import { LoadingBar } from 'ui-kits/LoadingBar';
import { LogoIcon } from 'assets/LogoIcon';

export interface ModalProps {
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
  largeModal?: boolean;
  formSubmitting?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
  largeModal,
  formSubmitting,
}: ModalProps): JSX.Element => {
  return (
    <>
      <BackgroundDiv onClick={onClick} />
      <ModalDiv largeModal={largeModal}>
        <LogoBox>
          <LogoIcon width={30} />
        </LogoBox>
        {formSubmitting && <LoadingBar />}
        {children}
      </ModalDiv>
    </>
  );
};
