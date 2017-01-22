export function getUser(state) {
  return state.user
}

export function saveUser(store, val) {
  store.dispatch('SAVEUSER', val);
}

export function saveUser(store, val) {
  store.dispatch('SAVE_CURRENT_VIEW', val);
}