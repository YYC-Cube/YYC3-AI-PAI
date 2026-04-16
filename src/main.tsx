/**
 * @file main.tsx
 * @description main组件/模块
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-19
 * @updated 2026-03-19
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags main,entry,react
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'
import { enableMapSet } from 'immer'

enableMapSet()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)