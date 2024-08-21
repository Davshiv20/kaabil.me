import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// Redux Store 
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {
  store,
  persistor
} from '@store/index';  
import AppRouter from '@router/index';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <AppRouter />
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
