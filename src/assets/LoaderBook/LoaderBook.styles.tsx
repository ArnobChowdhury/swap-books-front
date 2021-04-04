import styled, { keyframes } from 'styled-components';

const background = 'linear-gradient(135deg, #AC9FF7,#4531b0)';
const shadow = 'rgba(39, 94, 254, 0.28)';
const text = '#6C7486';
const page = 'rgba(255, 255, 255, 0.36)';
const pageFold = 'rgba(255, 255, 255, 0.52)';
const duration = '3s';
const rotationDeg = '6deg';

const page2 = keyframes`
	0% {
		transform: rotateY(180deg);
		opacity: 0;
	}

	20% {
		opacity: 1;
	}

	35%,
  100% {
		opacity: 0;
	}

	50%,
  100% {
		transform: rotateY(0deg);
	}
`;

const page3 = keyframes`
	15% {
		transform: rotateY(180deg);
		opacity: 0;
	}

	35% {
		opacity: 1;
	}

	50%,
  100% {
		opacity: 0;
	}

	65%,
  100% {
		transform: rotateY(0deg);
	}
`;

const page4 = keyframes`
	30% {
		transform: rotateY(180deg);
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	65%,
  100% {
		opacity: 0;
	}

	80%,
  100% {
		transform: rotateY(0deg);
	}
`;

const page5 = keyframes`
	45% {
		transform: rotateY(180deg);
		opacity: 0;
	}

	65% {
		opacity: 1;
	}

	80%,
  100% {
		opacity: 0;
	}

	95%,
  100% {
		transform: rotateY(0deg);
	}
`;

export const Loader = styled.div`
  width: 100px;
  height: 70px;
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
    bottom: 8px;
    width: 120px;
    top: 80%;
    box-shadow: 0 16px 12px ${shadow};
    transform: rotate(${rotationDeg});
  }

  &:before {
    left: 4px;
    transform: rotate(-${rotationDeg});
  }
  &:after {
    right: 4px;
    transform: rotate(${rotationDeg});
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  position: relative;
  z-index: 1;
  perspective: 600px;
  box-shadow: 0 4px 6px ${shadow};
  background-image: ${background};
`;

export const UnorderedList = styled.ul` 
	margin: 0;
	padding: 0;
	list-style: none;
	position: relative;

	& li:first-child {
		opacity: 1;
  		transform: rotateY(0);
	}

	& li:last-child {
		opacity: 1;
	}

	& li:nth-child(2) {
		animation-name: ${page2};
		color: ${pageFold};
	}

	& li:nth-child(3) {
		animation-name: ${page3};
		color: ${pageFold};
	}

	& li:nth-child(4) {
		animation-name: ${page4};
		color: ${pageFold};
	}

	& li:nth-child(5) {
		animation-name: ${page5};
		color: ${pageFold};
	}
}
`;

export const List = styled.li`
  position: absolute;
  top: 5px;
  left: 5px;
  transform-origin: 100% 50%;
  color: ${page};
  opacity: 0;
  transform: rotateY(180deg);
  animation: ${duration} ease infinite;
`;

export const SVG = styled.svg`
  width: 45px;
  height: 60px;
  display: block;
`;

const TextAnimation = keyframes`
	0% {
		content: '';
	}

	33% {
		content: '.';
	}

	66%
   	{
		content: '..';
	}

	100%
   	{
		content: '...';
	}
`;

export const TextWrapper = styled.div`
  display: block;
  margin-top: 10px;
  text-align: center;
`;

export const Text = styled.span`
  color: ${({ theme }) => theme.colorTextPrimary};
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
`;

export const DotDummy = styled.span`
  width: 10px;
  color: ${({ theme }) => theme.colorTextPrimary};
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  display: inline-block;
  text-align: left;
  letter-spacing: 2px;

  &:after {
    content: '';
    animation: ${TextAnimation} 3s ease infinite;
  }
`;
