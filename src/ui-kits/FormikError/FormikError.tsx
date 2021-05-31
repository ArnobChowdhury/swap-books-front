import { ErrorGutter, ErrorText, ErrorWrapper } from './FormikError.styles';

interface FormikErrorProps {
  hasGutter?: boolean;
  isTouched?: boolean;
  error?: string;
  noflexBasis?: boolean;
}

export const FormikError = ({
  hasGutter,
  isTouched,
  error,
  noflexBasis = false,
}: FormikErrorProps) => {
  return (
    <ErrorWrapper noFlexBasis={noflexBasis}>
      {hasGutter && <ErrorGutter />}
      {isTouched && error ? <ErrorText>{error}</ErrorText> : null}
    </ErrorWrapper>
  );
};
