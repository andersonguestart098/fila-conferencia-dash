// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App.tsx'
import PedidosSomenteLista from './pages/PedidosSomenteLista'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Tela principal: lista + detalhe */}
        <Route path="/" element={<App />} />

        {/* Tela só com a lista de pedidos */}
        <Route path="/lista" element={<PedidosSomenteLista />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
