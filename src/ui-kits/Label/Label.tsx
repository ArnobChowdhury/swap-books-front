import { Label as LabelHTML, DIV, LabelSpan, RequiredSpan } from './Label.styles';
import { ReactNode } from 'react';

interface LabelProps {
  labelText?: string | ReactNode;
  labelAtTop: boolean;
  isRequired?: boolean;
  labelMinWidth?: string;
  labelMaxWidth?: string;
  children?: React.ReactNode;
  marginBottom?: string;
  as?: 'div';
  htmlFor?: string;
}

export const Label = ({
  labelText,
  labelAtTop,
  isRequired,
  labelMinWidth,
  children,
  marginBottom,
  as,
  htmlFor,
  labelMaxWidth,
}: LabelProps): JSX.Element => {
  return (
    <>
      {!as ? (
        <LabelHTML
          {...{ labelAtTop }}
          marginBottom={marginBottom}
          htmlFor={htmlFor}
          labelMaxWidth={labelMaxWidth}
        >
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
