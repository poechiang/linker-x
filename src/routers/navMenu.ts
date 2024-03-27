import loader from './loader'
export const sideMenuItems = loader()
  .filter(({ menu }) => menu !== false)
  .map(route => ({
    // ...route,
    icon: route.icon,
    key: route.path!,
  }))
