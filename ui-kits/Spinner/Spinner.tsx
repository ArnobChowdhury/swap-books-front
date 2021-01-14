import { LDSRing, TransparentBackground } from './Spinner.styles';

export const Spinner = () => {
  return (
    <TransparentBackground>
      <LDSRing>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LDSRing>
    </TransparentBackground>
  );
};
