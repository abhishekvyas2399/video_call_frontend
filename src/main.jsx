import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/SocketContext';

import {BrowserRouter}  from 'react-router-dom'


createRoot(document.getElementById('root')).render(
<SocketProvider>
        <BrowserRouter>
                <App />
        </BrowserRouter>
</SocketProvider>
)