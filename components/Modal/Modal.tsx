import { ModalDiv, BackgroundDiv } from './Modal.styles';

export interface ModalProps {
  children: React.ReactNode;
  modalContentPadding?: string;
  onClick: (e: React.SyntheticEvent) => void;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
  modalContentPadding = '2rem',
}: ModalProps): JSX.Element => {
  return (
    <>
      <BackgroundDiv onClick={onClick} />
      <ModalDiv modalPadding={modalContentPadding}>{children}</ModalDiv>;
    </>
  );
};
