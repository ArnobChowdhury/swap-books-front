import styled from 'styled-components';
import { mediumScreen } from 'mediaConfig';

export const MapContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceTen};
  height: 50vh;
  box-shadow: 0 ${({ theme }) => theme.boxShadow};

  @media screen and (min-width: ${mediumScreen}px) {
    height: 60vh;
  }

  & div.leaflet-locationiq-expanded {
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.boxShadow};
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
