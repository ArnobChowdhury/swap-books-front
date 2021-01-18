import { ModalDiv, BackgroundDiv } from './Modal.styles';

export interface ModalProps {
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
  largeModal?: boolean;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
  largeModal,
}: ModalProps): JSX.Element => {
  return (
    <>
      <BackgroundDiv onClick={onClick} />
      <ModalDiv largeModal={largeModal}>{children}</ModalDiv>
    </>
  );
};
