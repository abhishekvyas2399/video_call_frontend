import { useContext, useMemo, createContext} from "react"
import {io} from "socket.io-client"

const socketContext=createContext(null);

export const useSocket=()=>{
    const socket=useContext(socketContext);
    return socket;
}

export const SocketProvider=({children})=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    const socket=useMemo(()=>io(server_url),[])
    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}