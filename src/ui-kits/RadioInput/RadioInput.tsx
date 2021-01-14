import { ChangeEvent } from 'react';
import { Input, LabelSpan, RadioLabel } from './RadioInput.styles';

interface RadioInputProps {
  name: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  labelText: string;
  checked: boolean;
}

export const RadioInput = ({
  name,
  value,
  onChange,
  labelText,
  checked,
}: RadioInputProps) => {
  return (
    <RadioLabel>
      <Input
        type="radio"
        checked={checked}
        value={value}
        onChange={onChange}
        name={name}
      />
      <LabelSpan>{labelText}</LabelSpan>
    </RadioLabel>
  );
};
