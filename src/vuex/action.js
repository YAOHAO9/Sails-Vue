export function getUser(state) {
  return "123"
}

export function saveUser(store, val) {
  store.dispatch('SAVEUSER', val);
}