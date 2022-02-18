import styled, { css } from 'styled-components';
import { Nullable } from '../interface/common';

interface ImageBoxProps {
  src: Nullable<string>;
  width?: string;
  height?: string;
}

const ImageBox = styled.div<ImageBoxProps>`
  width: ${(props) => (props.width ? `${props.width}` : '100px')};
  height: ${(props) => (props.height ? `${props.height}` : '100px')};
  ${({ src }) =>
    src &&
    css`
      background: no-repeat center/contain url(${src});
    `}
`;

export default ImageBox;
