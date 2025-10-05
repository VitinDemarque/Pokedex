export const theme = {
  colors: {
    primary: '#ffcb05',
    secondary: '#3d7dca',
    background: '#f0f0f0',
    text: '#333',
    white: '#ffffff',
    gray: '#a0a0a0',
    lightGray: '#e0e0e0',
    darkGray: '#555',
  },
  fonts: {
    main: "'Roboto', sans-serif",
  },
  spacing: (factor) => `${factor * 8}px`,
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    round: '50%',
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 10px rgba(0,0,0,0.15)',
  },
};