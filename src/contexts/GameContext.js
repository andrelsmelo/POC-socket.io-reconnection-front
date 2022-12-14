import React, { useReducer, useEffect } from 'react';
import socketClient from 'socket.io-client';

const socket = socketClient(process.env.REACT_APP_SOCKET_ADDRESS, {
  autoConnect: false,
});

const GameContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'RESET_STATE':
      return { ...initialState, isConnected: state.isConnected };
    case 'PLAYER':
      return {
        ...state,
        player: action.payload,
      };
    case 'PLAYERS':
      return {
        ...state,
        players: action.payload,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
};

const initialState = {
  isConnected: false,
  player: {},
  players: {},
  messages: [],
};

const GameProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.on('connect', () => {
      if (localStorage.getItem('player')) {
        socket.emit('Reconnect', JSON.parse(localStorage.getItem('player')));
      }

      dispatch({ type: 'CONNECTED', payload: true });
    });
    socket.on('disconnect', () => {
      dispatch({ type: 'CONNECTED', payload: false });
    });
    socket.on('PlayersRefresh', (players) => {
      const player = players[socket.id];
      if (player) {
        localStorage.setItem('player', JSON.stringify(player));
        dispatch({ type: 'PLAYER', payload: players[socket.id] });
      } else {
        dispatch({ type: 'RESET_STATE' });
      }

      dispatch({ type: 'PLAYERS', payload: players });
    });
    socket.on('ReceiveMessage', (receivedMessage) => {
      dispatch({ type: 'ADD_MESSAGE', payload: receivedMessage });
    });
    socket.open();
  }, []);

  return (
    <GameContext.Provider value={state}>{props.children}</GameContext.Provider>
  );
};

const sendMessage = (message) => {
  socket.emit('SendMessage', message);
};

const login = (name) => {
  socket.emit('Login', name);
};

export {
  GameContext,
  GameProvider,
  sendMessage,
  login,
};
