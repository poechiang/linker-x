import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import App from './APP'

// render main window after app launched
const init = await window.api?.winReady()

const app = createElement(App, init)

const wrapper = document.querySelector('app-root-wrapper')

createRoot(wrapper!).render(app)
