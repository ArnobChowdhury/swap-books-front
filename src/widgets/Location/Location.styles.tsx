import styled from 'styled-components';
import { smallScreen } from 'mediaConfig';

export const MapContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceTen};
  height: 50vh;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);

  @media screen and (min-width: ${smallScreen}px) {
    height: 60vh;
  }

  & div.leaflet-locationiq-expanded {
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    border: 0;
  }

  & div.leaflet-locationiq-expanded input {
    font-family: Rubik;
  }

  & .locationPopup {
    width: 140px;
    font-family: Rubik;
  }
`;
