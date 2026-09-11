import React from 'react';
import { Glass } from "@samasante/liquid-glass";

export const Test: React.FC = () => {
  console.log('Test component rendered');
  return (
    <Glass style={{ background: 'rgba(0,0,255,0.3)', padding: 20, borderRadius: 16, marginBottom: 20 }}>
      <h2>Test Component</h2>
      <p>If you see this, the test component is working</p>
    </Glass>
  );
};
