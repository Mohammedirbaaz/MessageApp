import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('videoFile', (data) => {
        console.log(data.video);
        const blob = new Blob([data.video], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        videoRef.current.src = url;
        videoRef.current.play();
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit('videoData', event.data);
      }
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Video Recorder</h1>
      <video ref={videoRef} autoPlay  controls/>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default VideoRecorder;
