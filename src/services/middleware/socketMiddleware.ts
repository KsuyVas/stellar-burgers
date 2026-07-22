import { Middleware } from 'redux';

type WsActions = {
  wsConnect: string;
  wsDisconnect: string;
  wsConnecting: string;
  wsOpen: string;
  wsClose: string;
  wsError: string;
  wsMessage: string;
};

export const socketMiddleware =
  (wsActions: WsActions, withTokenRefresh: boolean = false): Middleware =>
  (store) =>
  (next) =>
  (action: any) => {
    const { dispatch } = store;
    const { type } = action;
    let socket: WebSocket | null = null;
    let isConnected: boolean = false;
    let reconnectTimer: number = 0;
    let url: string = '';

    if (type === wsActions.wsConnect) {
      url = action.payload;
      socket = new WebSocket(url);
      isConnected = true;
      dispatch({ type: wsActions.wsConnecting });
    }

    if (socket) {
      socket.onopen = () => {
        dispatch({ type: wsActions.wsOpen });
      };

      socket.onerror = () => {
        dispatch({ type: wsActions.wsError, payload: 'Ошибка WebSocket' });
      };

      socket.onclose = () => {
        dispatch({ type: wsActions.wsClose });
        if (isConnected) {
          reconnectTimer = window.setTimeout(() => {
            dispatch({ type: wsActions.wsConnect, payload: url });
          }, 3000);
        }
      };

      socket.onmessage = (event: MessageEvent) => {
        const { data } = event;
        const parsedData = JSON.parse(data);

        if (
          withTokenRefresh &&
          parsedData.message === 'Invalid or missing token'
        ) {
          return;
        }

        dispatch({ type: wsActions.wsMessage, payload: parsedData });
      };

      if (type === wsActions.wsDisconnect) {
        clearTimeout(reconnectTimer);
        isConnected = false;
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
