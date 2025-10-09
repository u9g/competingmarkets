import React, { useState } from 'react';

type VoteChoice = 'yes' | 'no';

const VoteComponent: React.FC = () => {
  const [voted, setVoted] = useState<VoteChoice | null>(null);

  const handleVote = (choice: VoteChoice): void => {
    setVoted(choice);
    // You can add additional logic here, like sending vote to backend
    console.log(`User voted: ${choice}`);
  };

  return (
    <div style={{
      width: '100%',
      height: '50px',
      display: 'flex',
      marginTop: '8px',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
    }}>
      <div
        onClick={() => handleVote('no')}
        style={{
          flex: 1,
          backgroundColor: voted === 'no' ? '#b71c1c' : '#d93025',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {voted === 'no' ? '✓ No' : 'No'}
      </div>
      <div
        onClick={() => handleVote('yes')}
        style={{
          flex: 1,
          backgroundColor: voted === 'yes' ? '#0d652d' : '#188038',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {voted === 'yes' ? '✓ Yes' : 'Yes'}
      </div>
    </div>
  );
};

export default VoteComponent;
