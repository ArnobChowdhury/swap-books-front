import { useState } from 'react';
import {
  ModalDiv,
  BackgroundDiv,
  SliderBG,
  SliderContainer,
  LeftArrowContainer,
} from './Modal.styles';
import { LoadingBar } from 'ui-kits/LoadingBar';
import { mediumScreen } from 'mediaConfig';
import { IconOnlyButton } from 'ui-kits/IconOnlyButton';
import { LeftArrow } from 'assets/LeftArrow';

export interface ModalProps {
  children: React.ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
  largeModal?: boolean;
  formSubmitting?: boolean;
  opensInBottom?: boolean;
  currentWidth: number;
}
export const Modal: React.FC<ModalProps> = ({
  children,
  onClick,
  largeModal,
  formSubmitting,
  opensInBottom = false,
  currentWidth,
}: ModalProps): JSX.Element => {
  // TODO WHEN REQUEST ONGOING USER SHOULD BE STOPPED FROM CLOSING THE MODAL
  const showSlider = currentWidth < mediumScreen;

  const [closeSlider, setCloseSlider] = useState(false);
  const handleSliderClose = (e: React.SyntheticEvent) => {
    setCloseSlider(true);
    setTimeout(() => {
      onClick(e);
    }, 200);
  };
  return (
    <>
      {(!showSlider || opensInBottom) && (
        <>
          <BackgroundDiv onClick={onClick} />
          <ModalDiv opensInBottom={opensInBottom} largeModal={largeModal}>
            {formSubmitting && <LoadingBar />}
            {children}
          </ModalDiv>
        </>
      )}
      {showSlider && !opensInBottom && (
        <SliderBG closeSlider={closeSlider}>
          <LeftArrowContainer>
            <IconOnlyButton size={32} onClick={handleSliderClose}>
              <LeftArrow />
            </IconOnlyButton>
          </LeftArrowContainer>
          <SliderContainer>
            {formSubmitting && <LoadingBar />}
            {children}
          </SliderContainer>
        </SliderBG>
      )}
    </>
  );
};
