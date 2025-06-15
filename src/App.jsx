import React from 'react';
import {Routes,Route} from 'react-router-dom'

import VideoChat from './components/VideoChat';
import JoinRoom from './components/JoinRoom';

function App() {
  return (
      <Routes>
        <Route path='/' element={<JoinRoom />}/>
        <Route path='/call' element={<VideoChat />}/>
      </Routes>
  );
}

export default App;