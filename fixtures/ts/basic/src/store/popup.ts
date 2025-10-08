interface PopupState {
  isOpen: boolean;
}

export default {
  namespaced: false, // [TEST] normally execute when namespaced is false
  state: {
    isOpen: false,
  },
  getters: {
    getIsOpen: (state: PopupState) => state.isOpen,
  },
  mutations: {
    open(state: PopupState) {
      state.isOpen = true;
    },
    close(state: PopupState) {
      state.isOpen = false;
    },
  },
};
