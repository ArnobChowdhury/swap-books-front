import { ModalDiv, BackgroundDiv } from './Modal.styles';
import { LoadingBar } from 'ui-kits/LoadingBar';

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
        {formSubmitting && <LoadingBar />}
        {children}
      </ModalDiv>
    </>
  );
};
