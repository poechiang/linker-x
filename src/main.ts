import enUS from '@assets/locale/enUS'
import zhCN from '@assets/locale/zhCN'
import i18n from 'i18next'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { initReactI18next } from 'react-i18next'
import App from './APP'

// import buildToRouters from './routers/loader'

// buildToRouters()
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = { zhCN, enUS }

i18n.use(initReactI18next).init({
  resources,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
})

i18n.changeLanguage(window.store.language || 'zhCN')
const app = createElement(App)

const wrapper = document.querySelector('app-root-wrapper')

createRoot(wrapper!).render(app)
