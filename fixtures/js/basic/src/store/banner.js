import { modalTest as m } from "@/store/modules/modal"; // [TEST] normally execute when the imported path is absolute(2), normally execute when the name of the imported module is different with the exported name

export const notStore = {};

export const banner = {
  namespaced: true, // [TEST] normally execute when namespaced is true
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
  modules: {
    modal: m,
  },
};
