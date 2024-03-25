import { useContext } from 'react'
import { AppContext } from '../components/AppProvider'
export const useApp = () => useContext(AppContext)
