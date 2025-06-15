import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';

const VideoChat = () => {
  const socket = useSocket();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteUserId,setRemoteUserId]=useState(null);


  useEffect(()=>{
    socket.on("newUser",({Id})=>{
      setRemoteUserId(Id);
    })
  },[socket])

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    startMedia();
  }, []);

  useEffect(()=>{
    if(peerConnectionRef.current && remoteUserId){
      peerConnectionRef.current.onicecandidate = (event) => {
        if(event.candidate){
          socket.emit('ice-candidate', {Id:remoteUserId,iceCandidate:event.candidate});
        }
      };
    }
  },[peerConnectionRef,remoteUserId,socket]);

  useEffect(() => {
    if (!socket || !localStream) return;

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });

    localStream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStream);
    });


    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    socket.on('offer', async ({Id,offer}) => {
      setRemoteUserId(Id);
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', {Id,answer});
    });

    socket.on('answer', async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({Id,iceCandidate}) => {
      try {
        await peerConnectionRef.current.addIceCandidate(iceCandidate);
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [socket, localStream]);

  const initiateCall = async () => {
    if (!peerConnectionRef.current) return;

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit('offer',{Id:remoteUserId,offer});
  };

  return (
    <div>
      <h2>WebRTC Video Chat</h2>
      {remoteUserId?<button onClick={initiateCall}>Start Call</button>:""}
      <div>
        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '300px' }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px' }} />
      </div>
    </div>
  );
};

export default VideoChat;