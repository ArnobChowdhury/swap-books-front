import { ModalDiv, BackgroundDiv } from './Modal.styles';

export interface ModalProps {
  children: React.ReactNode;
  modalContentPadding?: string;
  onClick: (e: React.SyntheticEvent) => void;
  largeModal?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
  modalContentPadding = '3rem',
  largeModal,
}: ModalProps): JSX.Element => {
  return (
    <>
      <BackgroundDiv onClick={onClick} />
      <ModalDiv modalPadding={modalContentPadding} largeModal={largeModal}>
        {children}
      </ModalDiv>
    </>
  );
};
