import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getSocketURL } from '../services/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket;
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      newSocket = io(getSocketURL(), {
        auth: { token }
      });
      setSocket(newSocket);
    }
    return () => {
      if (newSocket) newSocket.close();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
