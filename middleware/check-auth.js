export default function ({ store, route, redirect }) {
  if (
    store.state.gebruiker.user.data === null &&
    route.path !== '/account' &&
    !route.path.startsWith('/uitstap')
  ) {
    if (process.browser) localStorage.setItem('openPath', route.path)
    return redirect('/account')
  }
}
