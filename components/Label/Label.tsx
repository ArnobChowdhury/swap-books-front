import { Label as LabelHTML, LabelSpan, RequiredSpan } from './Label.styles';

interface LabelProps {
  labelText?: string;
  labelAtTop: boolean;
  isRequired?: boolean;
  labelMinWidth?: string;
  children?: React.ReactNode;
  marginBottom?: string;
}

export const Label = ({
  labelText,
  labelAtTop,
  isRequired,
  labelMinWidth,
  children,
  marginBottom,
}: LabelProps): JSX.Element => {
  return (
    <LabelHTML {...{ labelAtTop }} marginBottom={marginBottom}>
      <LabelSpan {...{ labelAtTop }} labelMinWidth={labelMinWidth}>
        {isRequired && !labelAtTop ? (
          <RequiredSpan {...{ labelAtTop }}>*</RequiredSpan>
        ) : null}
        {labelText}
        {isRequired && labelAtTop ? (
          <RequiredSpan {...{ labelAtTop }}> (Required)</RequiredSpan>
        ) : null}
      </LabelSpan>
      {children}
    </LabelHTML>
  );
};
