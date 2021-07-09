export default function ({ store, route, redirect }) {
  if (
    store.state.gebruiker.user.data === null &&
    route.path !== '/account' &&
    !route.path.startsWith('/uitstap')
  ) {
    return redirect('/account')
  }
}
