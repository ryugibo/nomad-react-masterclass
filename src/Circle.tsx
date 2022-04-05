import styled from "styled-components";
import { Tracing } from "trace_events";
import { useState } from "react";

interface ContainerProps {
  bgColor: string;
  borderColor: string;
}

const Container = styled.div<ContainerProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 50%;
  border: 3px solid ${(props) => props.borderColor};
`;

interface CircleProps {
  bgColor: string;
  borderColor?: string;
  // boraderColor: string | undefined; 로도 작성가능
  text?: string;
}

function Circle({ bgColor, borderColor, text = "default text" }: CircleProps) {
  const [value, setValue] = useState<number | string>(0);
  setValue(2);
  setValue("aaa");
  // setValue(true); // error
  return (
    <Container bgColor={bgColor} borderColor={borderColor ?? bgColor}>
      {text}
    </Container>
  );
}

export default Circle;
