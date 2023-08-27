import { Server as NetServer } from 'http'
import { NextRequest } from 'next/server';
import { Server } from 'socket.io'

import {
    NextApiResponseWithSocket,
    ServerToClientEvents,
    ClientToServerEvents,
} from "@/src/app/types/custom-types";

export const config = {
    api: {
      bodyParser: false,
    },
}
const ioHandler = (req: NextRequest, res: NextApiResponseWithSocket) => {
    if (!res.socket?.server?.io) {
        const path = "/api/socket/io"
        const httpServer: NetServer = res.socket?.server as any
        console.log('socket route: ', httpServer)

        const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
            path,
            // @ts-ignore
            addTrailingSlash: false,
        })

        io.on('connection', (socket) => {
            console.log('Novo usuário conectado');
          
            socket.on('stream', (streamData) => {
              socket.broadcast.emit('watchStream', streamData);
            });
          
            socket.on('disconnect', () => {
              console.log('Usuário desconectado');
            });
          });
        
        res.socket.server.io = io
    }

    res.end()
}

export default ioHandler