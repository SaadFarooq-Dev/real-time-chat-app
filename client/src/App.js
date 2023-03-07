import socketIO from 'socket.io-client';
import './App.css';

const socket = socketIO.connect('http://localhost:4000');
console.log(socket);
const App = () => {
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
}

export default App;
