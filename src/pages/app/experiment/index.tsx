import { ExperimentOutline } from '@assets/icons'
// import ErrorBoundary from '@components/ErrorBoundary'
import { useEffect } from 'react'
export const menu = {
  type: 'settings',
  label: '实验功能',
  icon: <ExperimentOutline />,
}
export default () => {
  useEffect(() => {
    throw new Error('test')
  }, [])

  return (
    <>
      123456
      {/* <ErrorBoundary></ErrorBoundary> */}
    </>
  )
}
