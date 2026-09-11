import React from 'react';

export const SimpleTest: React.FC = () => {
  return (
    <div style={{ 
      padding: 20, 
      background: 'red', 
      marginBottom: 20,
      border: '2px solid black'
    }}>
      <h2>SIMPLE TEST COMPONENT</h2>
      <p>If you see this, basic React rendering works</p>
    </div>
  );
};
