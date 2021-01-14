import { ErrorGutter, ErrorText, ErrorWrapper } from './FormikError.styles';

interface FormikErrorProps {
  hasGutter?: boolean;
  isTouched?: boolean;
  error?: string;
}

export const FormikError = ({ hasGutter, isTouched, error }: FormikErrorProps) => {
  return (
    <ErrorWrapper>
      {hasGutter && <ErrorGutter />}
      {isTouched && error ? <ErrorText>{error}</ErrorText> : null}
    </ErrorWrapper>
  );
};
