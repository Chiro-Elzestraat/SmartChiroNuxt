export default function({ route }) {
  if (process.browser && ((route.path !== '/account' && route.path !== '/'))) localStorage.setItem('openPath', route.path)
}
