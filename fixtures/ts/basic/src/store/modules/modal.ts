// [TEST] normally execute when this is a module of module

interface ModalState {
  isOpen: boolean;
}

export const modalTest = {
  namespaced: true,
  state: {
    isOpen: false,
  },
  getters: {
    getIsOpen: (state: ModalState) => state.isOpen, // [TEST] noramlly find modal.ts's isOpen state
  },
  actions: {
    async open({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("open"); // [TEST] normally execute when a mutation is called inside action of a module, normally execute even if the context is destructured
          resolve(null);
        }, 1000);
      });
    },
    async close(context) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.commit("close"); // [TEST] normally execute when a mutation is called inside action of a module, normally execute even if the context is not destructured
          resolve(null);
        }, 1000);
      });
    },
  },
  mutations: {
    open(state: ModalState) {
      state.isOpen = true; // [TEST] noramlly find modal.ts's isOpen state
    },
    close(state: ModalState) {
      state.isOpen = false; // [TEST] noramlly find modal.ts's isOpen state
    },
  },
};
