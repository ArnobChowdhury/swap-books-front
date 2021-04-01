import { Container, IconContainer, ReqMsg } from './RequestResult.styles';
import { Tick } from 'assets/Tick';
import { Danger } from 'assets/Danger';

export interface RequestResultProps {
  msg: string;
  reqStatus: 'success' | 'error';
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
      </IconContainer>
      <ReqMsg>{msg}</ReqMsg>
    </Container>
  );
};
