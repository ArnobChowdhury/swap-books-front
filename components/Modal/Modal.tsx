import { ModalDiv, BackgroundDiv } from './Modal.styles';

export interface ModalProps {
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
}: ModalProps): JSX.Element => {
  return (
    <>
      <BackgroundDiv onClick={onClick} />
      <ModalDiv>{children}</ModalDiv>;
    </>
  );
};
