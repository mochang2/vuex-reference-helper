// [TEST] normally execute when this is a module of module

export const modalTest = {
  namespaced: true,
  state: {
    isOpen: false,
  },
  getters: {
    getIsOpen: (state) => state.isOpen, // [TEST] noramlly find modal.js's isOpen state
  },
  actions: {
    async open({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("open"); // [TEST] normally execute when a mutation is called inside action of a module, normally execute even if the context is destructured
          resolve();
        }, 1000);
      });
    },
    async close(context) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.commit("close"); // [TEST] normally execute when a mutation is called inside action of a module, normally execute even if the context is not destructured
          resolve();
        }, 1000);
      });
    },
  },
  mutations: {
    open(state) {
      state.isOpen = true; // [TEST] noramlly find modal.js's isOpen state
    },
    close(state) {
      state.isOpen = false; // [TEST] noramlly find modal.js's isOpen state
    },
  },
};
