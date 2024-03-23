import { AppContext } from '@components/AppProvider'
import { useContext } from 'react'
export const useApp = () => useContext(AppContext)
