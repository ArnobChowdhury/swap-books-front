import { useRef, useState, useEffect, KeyboardEvent, FocusEvent } from 'react';
import {
  StyledInput,
  Container,
  Preview,
  PreviewPlaceholder,
  PreviewContainer,
} from './FileInput.styles';
import { useField } from 'formik';
import { FormikError } from 'ui-kits/FormikError';
import { Paragraph } from 'ui-kits/Paragraph';
import { Label } from 'ui-kits/Label';
import { UploadIcon } from 'assets/Upload';
import { useWindowSize } from 'hooks/useWindowSize';
import { smallScreen } from 'mediaConfig';

const showPreview = (
  event: React.ChangeEvent<HTMLInputElement>,
  imagNode: HTMLImageElement,
) => {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      if (e.target) {
        const res = e.target.result;
        if (typeof res === 'string') imagNode.src = res;
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  }
};

interface FileInputProps {
  name: string;
  labelText: string;
  autoFocus?: boolean;
}

export const FileInput = (props: FileInputProps) => {
  const previewImageRef = useRef<HTMLImageElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [showImg, setShowImg] = useState(false);

  const { labelText, autoFocus } = props;
  const [field, meta, helpers] = useField(props);
  const { name, onBlur } = field;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (previewImageRef.current) {
      showPreview(event, previewImageRef.current);
      setShowImg(true);
    }
    helpers.setValue(event.target.files?.[0]);
  };

  useEffect(() => {
    if (autoFocus && previewContainerRef.current) {
      previewContainerRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      (event.key === 'Enter' ||
        event.key === ' ' ||
        // @ts-ignore
        event.code === 'Space' ||
        event.keyCode === 32) &&
      hiddenInputRef.current
    ) {
      hiddenInputRef.current.click();
    }
  };

  const handleOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur(event);
  };

  const { width } = useWindowSize();

  return (
    <Container>
      <Label labelAtTop labelMaxWidth={width < smallScreen ? '200' : undefined}>
        <Paragraph centerAlign fontSize="small" fontWeight="regular">
          {labelText}
        </Paragraph>
        <PreviewContainer
          tabIndex={0}
          ref={previewContainerRef}
          onKeyDown={handleKeyDown}
          onBlur={handleOnBlur}
          id={name}
        >
          <Preview show={showImg} src="" ref={previewImageRef} />
          <PreviewPlaceholder show={!showImg}>
            <UploadIcon />
          </PreviewPlaceholder>
        </PreviewContainer>
        <StyledInput
          type="file"
          name={name}
          onChange={handleFileChange}
          ref={hiddenInputRef}
        />
        <Container>
          <FormikError noflexBasis isTouched={meta.touched} error={meta.error} />
        </Container>
      </Label>
    </Container>
  );
};
