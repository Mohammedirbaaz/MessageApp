/*import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import notifysound from './notification_sound.wav'

const socket = io.connect("http://localhost:3001");

function App() {
  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState({Name:'',Message:''});
  const [name, setName] = useState("");

  const sendMessage = () => {
    console.log(name);
    socket.emit("send_message", {message:message, UserName:name} );
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      var sound=new Audio(notifysound);
      sound.play();
      console.log(data.UserId);
      setMessageReceived({Name:data.Name, Message:data.message.message});
    });
    console.log(socket);
  }, [socket]);

  useEffect(()=>{
    console.log(messageReceived);
    if(messageReceived.Message=="" && messageReceived.Name=="") return;
    
    var p=document.getElementById("messege_render");
    var divel=document.createElement("div");
    var el=document.createElement("p");
    var txt=document.createTextNode(messageReceived.Message);
    divel.style.display="block";
    divel.style.width="50%";
    divel.style.height="8vh";
    divel.style.backgroundColor="wheat";
    el.style.backgroundColor="gray";
    divel.style.margin="1%";
    el.style.padding="0% 1%";
    el.style.borderRadius="5px";


  
    if(messageReceived.Name==name)
    {
      el.style.float="right";
    }else el.style.float="left";
    el.appendChild(txt);
    divel.appendChild(el);
    p.appendChild(divel);

  },[messageReceived])
  return (
    <div className="App">
      <input
        placeholder="Name..."
        onChange={(event) => {
          setName(event.target.value);
        }}
      />

      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      <div id="messege_render"></div>
    </div>
  );
}

export default App;
*/


import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import AudioSender from './Component/Audiosender'
import VideoRecorder from "./Component/Videosender";

const socket = io.connect("http://localhost:3001");

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);
  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}

        <AudioSender/>
        <VideoRecorder/>
    </div>
  );
}

export default App;
