import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App.tsx'
import './styles.css'

const root = document.getElementById('root')!;

createRoot(root).render(
    <StrictMode>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </StrictMode>,
)