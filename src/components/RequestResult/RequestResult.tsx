import { Container, IconContainer, ReqMsg } from './RequestResult.styles';
import { Tick } from 'assets/Tick';
import { Danger } from 'assets/Danger';
import { LocatorIcon } from 'assets/LocatorIcon';

export interface RequestResultProps {
  msg: string;
  reqStatus: 'success' | 'error' | 'needLocation' | 'noBooks';
}

export const RequestResult = ({
  msg,
  reqStatus,
}: RequestResultProps): JSX.Element => {
  return (
    <Container>
      <IconContainer>
        {reqStatus === 'success' && <Tick size={50} />}
        {reqStatus === 'error' && <Danger size={50} />}
        {reqStatus === 'needLocation' && (
          <LocatorIcon isPrimaryColor width="50" height="50" />
        )}
        {reqStatus === 'noBooks' && <p style={{ fontSize: '50px' }}>&#128577;</p>}
      </IconContainer>
      <ReqMsg>{msg}</ReqMsg>
    </Container>
  );
};
