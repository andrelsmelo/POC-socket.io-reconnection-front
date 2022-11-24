import React, { useContext } from 'react';
import PlayerList from './PlayerList';
import Chat from './Chat';
import { GameContext, sendMessage } from '../contexts/GameContext';
import { Login } from './Login';

const Pong = () => {
  const { isConnected, player, players, messages } = useContext(
    GameContext
  );

  if (!isConnected) {
    return <div>Desconectado, conectando...</div>;
  }

  if (Object.keys(player).length === 0) {
    return <Login />;
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className='list-container'>
        <PlayerList players={players} />
      </div>
      <Chat sendMessage={sendMessage} messages={messages} />
    </div>
  );
};

export default Pong;
