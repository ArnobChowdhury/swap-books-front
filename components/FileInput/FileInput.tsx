import { StyledInput, Label } from './FileInput.styles';
import { ChangeEvent } from 'react';

interface FileInputProps {
  name: string;
  labelText: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput = ({ labelText, onChange }: FileInputProps) => {
  return (
    <>
      <Label>{labelText}</Label>
      <StyledInput type="file" onChange={onChange} />
    </>
  );
};
