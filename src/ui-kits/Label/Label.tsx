import { Label as LabelHTML, DIV, LabelSpan, RequiredSpan } from './Label.styles';

interface LabelProps {
  labelText?: string;
  labelAtTop: boolean;
  isRequired?: boolean;
  labelMinWidth?: string;
  children?: React.ReactNode;
  marginBottom?: string;
  as?: 'div';
}

export const Label = ({
  labelText,
  labelAtTop,
  isRequired,
  labelMinWidth,
  children,
  marginBottom,
  as,
}: LabelProps): JSX.Element => {
  return (
    <>
      {!as ? (
        <LabelHTML {...{ labelAtTop }} marginBottom={marginBottom}>
          <LabelSpan {...{ labelAtTop }} labelMinWidth={labelMinWidth}>
            {labelText}
            {isRequired && (
              <RequiredSpan {...{ labelAtTop }}>
                <sup>*</sup>
              </RequiredSpan>
            )}
          </LabelSpan>
          {children}
        </LabelHTML>
      ) : (
        <DIV {...{ labelAtTop }} marginBottom={marginBottom}>
          <LabelSpan {...{ labelAtTop }} labelMinWidth={labelMinWidth}>
            {isRequired && <RequiredSpan {...{ labelAtTop }}>*</RequiredSpan>}
            {labelText}
          </LabelSpan>
          {children}
        </DIV>
      )}
    </>
  );
};
