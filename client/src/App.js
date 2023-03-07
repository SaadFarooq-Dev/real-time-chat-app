import { Routes, Route } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import socketIO from 'socket.io-client';
import SignIn from './components/SignIn/Signin';
import SignUp from './components/SignUp/SignUp';
import { ColorRing } from 'react-loader-spinner'
import { useEffect, useState } from 'react';

const socket = socketIO.connect('http://localhost:4000',{query:`username=${localStorage.getItem('userName')}`});

const App = () => {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    socket.on('connect',()=>{
      setLoader(true)
    })
  }, [socket]);

  return (
    <>
    {!loader ?
    <ColorRing
    visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
    /> :
    <div>
      <Routes>
        <Route path='/' element={<SignIn socket={socket} />}></Route>
        <Route path='/login' element={<SignIn socket={socket} />}></Route>
        <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        <Route path="/signup" element={<SignUp socket={socket} />}></Route>
      </Routes>
    </div>
}
    </>
  );
}

export default App;
