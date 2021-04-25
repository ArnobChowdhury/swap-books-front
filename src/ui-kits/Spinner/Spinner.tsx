import { LDSRing, TransparentBackground } from './Spinner.styles';

export const Spinner = ({ big = false }: { big?: boolean }) => {
  // TODO Kept for future
  // return (
  //   <TransparentBackground>
  //     <LDSRing>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //     </LDSRing>
  //   </TransparentBackground>
  // );
  return (
    <LDSRing big={big}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </LDSRing>
  );
};
