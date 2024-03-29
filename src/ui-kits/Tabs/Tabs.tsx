import React from 'react';
import { Container, SingleTab } from './Tabs.styles';

interface TabsProps {
  options: any[];
  onClick: (name: any) => void;
  selectedTab: string;
}

export const Tabs = ({ options, onClick, selectedTab }: TabsProps) => {
  const tabSize = 100 / options.length;

  let tabs = options.map((option, index) => {
    return (
      <SingleTab
        size={tabSize}
        onClick={() => onClick(option)}
        key={index}
        isSelected={selectedTab === option}
      >
        {option}
      </SingleTab>
    );
  });

  return <Container>{tabs}</Container>;
};
