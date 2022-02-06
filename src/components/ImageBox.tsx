import styled from 'styled-components';

interface ImageBoxProps {
  src: string;
  width?: string;
  height?: string;
}

const ImageBox = styled.div<ImageBoxProps>`
  width: ${(props) => (props.width ? `${props.width}` : '100px')};
  height: ${(props) => (props.height ? `${props.height}` : '100px')};
  background: no-repeat center/contain ${(props) => `url(${props.src})`};
`;

export default ImageBox;
