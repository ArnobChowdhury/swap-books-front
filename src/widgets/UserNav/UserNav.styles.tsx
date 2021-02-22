import styled, { css } from 'styled-components';
import { largeScreen, mediumScreen } from 'mediaConfig';

export const UserNavLinkContainer = styled.div`
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const sharedStyles = css`
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  color: ${({ theme }) => theme.colorTextPrimary};
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  height: 100%;
`;

export const UserNavOptionWrapper = styled.div<{ marginTopAuto?: boolean }>`
  height: 6rem;
  padding: ${({ theme }) => `0 ${theme.spaceTen}`};
  margin-top: ${({ marginTopAuto }) => marginTopAuto && 'auto'};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colorSeparator};
  }

  &:not(:first-child) a {
    border-top: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  }

  &:nth-child(4) a {
    border-bottom: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  }
`;

export const UserNavLink = styled.a`
  display: block;
  color: ${({ theme }) => theme.colorTextPrimary};
  text-decoration: none;
  ${sharedStyles}
`;

export const UserLogout = styled.button`
  width: 100%;
  text-align: left;
  border: none;

  background: transparent;
  ${sharedStyles};
`;
