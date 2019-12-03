import React from 'react';
// this is just dummy to test storybook
export interface ButtonProps {
  text: string;
}
const InterestButton = ({ text }: ButtonProps) => <button>{text}</button>;

export default InterestButton;
