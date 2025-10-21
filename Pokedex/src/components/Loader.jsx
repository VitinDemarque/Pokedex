// src/components/CenteredLoader.jsx
import styled, { keyframes } from "styled-components";

const fade = keyframes`from{opacity:0}to{opacity:1}`;
const spin = keyframes`to{ transform: rotate(360deg) }`;

const Overlay = styled.div`
  position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.25); backdrop-filter: blur(2px); z-index: 9999; animation: ${fade} .12s ease-out;
`;
const Spinner = styled.div`
  width: 64px; height: 64px; border-radius: 50%;
  border: 4px solid rgba(255,255,255,.25);
  border-top-color: ${({theme}) => theme.colors?.primary || "#ffcc00"};
  animation: ${spin} .8s linear infinite;
`;
const Label = styled.div`
  margin-top: 12px; color: #fff; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,.5); text-align: center;
`;

export default function CenteredLoader() {
  return (
    <Overlay role="status" aria-live="polite" aria-label="Carregando">
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Spinner />
        <Label>Carregando…</Label>
      </div>
    </Overlay>
  );
}