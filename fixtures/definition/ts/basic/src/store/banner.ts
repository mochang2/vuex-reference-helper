import { modalTest as m } from "@/store/modules/modal"; // [TEST] normally execute when the imported path is absolute(2), normally execute when the name of the imported module is different with the exported name

interface BannerState {
  isOpen: boolean;
}

export const notStore = {};

export const banner = {
  namespaced: true, // [TEST] normally execute when namespaced is true
  state: {
    isOpen: false,
  },
  getters: {
    getIsOpen: (state: BannerState) => state.isOpen,
  },
  mutations: {
    open(state: BannerState) {
      state.isOpen = true;
    },
    close(state: BannerState) {
      state.isOpen = false;
    },
  },
  modules: {
    modal: m,
  },
};
