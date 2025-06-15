import { useCallback, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

import { useNavigate } from "react-router-dom"

export default function JoinRoom(){
    const roomRef=useRef();
    const navigate=useNavigate();

    const socket=useSocket();

    const handleNavigation=useCallback(()=>{
        navigate(`/call`)
    },[])

    useEffect(()=>{
        socket.on("joinRoom",handleNavigation);

        return ()=>{
            socket.off("joinRoom",handleNavigation);
        }
    },[socket,handleNavigation])

    const handleJoinRoom=useCallback(()=>{
        const room= roomRef.current.value;
        if(room!=""){
            socket.emit("joinRoom",room);
        }
    },[roomRef,socket])

    return (
        <>
            <label htmlFor="room">Room : </label>
            <input type="text" name="room" id="room" ref={roomRef}/>
            <button onClick={handleJoinRoom}> Join Room </button>
        </>
    )
}