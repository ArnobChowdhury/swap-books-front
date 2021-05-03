import { ModalDiv, BackgroundDiv } from './Modal.styles';
import { LoadingBar } from 'ui-kits/LoadingBar';

export interface ModalProps {
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
  largeModal?: boolean;
  formSubmitting?: boolean;
  opensInBottom?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
  largeModal,
  formSubmitting,
  opensInBottom = false,
}: ModalProps): JSX.Element => {
  return (
    <>
      <BackgroundDiv onClick={onClick} />
      <ModalDiv opensInBottom={opensInBottom} largeModal={largeModal}>
        {formSubmitting && <LoadingBar />}
        {children}
      </ModalDiv>
    </>
  );
};
