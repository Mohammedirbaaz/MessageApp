import React, { useEffect, useState,useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const AudioSender = () => {
    const audioRef = useRef(null);
  const [isARecording, setIsARecording] = useState(false);
  const [mediaARecorder, setAMediaRecorder] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('audioData', (data) => {
        const blob = new Blob([data.audio], { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;
        audioRef.current.play();
        console.log(data);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startARecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setAMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit('audioData', event.data);
      }
    };

    recorder.start();
    setIsARecording(true);
  };

  const stopARecording = () => {
    mediaARecorder.stop();
    setIsARecording(false);
  };

  return (
    <div>
      <h1>Audio Sender</h1>
      <button onClick={isARecording ? stopARecording : startARecording}>
        {isARecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default AudioSender;
