export default {
  namespaced: false, // [TEST] normally execute when namespaced is false
  state: {
    isOpen: false,
  },
  getters: {
    getIsOpen: (state) => state.isOpen,
  },
  mutations: {
    open(state) {
      state.isOpen = true;
    },
    close(state) {
      state.isOpen = false;
    },
  },
};
