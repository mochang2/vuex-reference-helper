import { createStore as cs } from "vuex"; // [TEST] normally execute when the name of the imported module is different with the exported name

interface RootState {
  count: number;
  appDetail: {
    scrollPosition: number;
    size: {
      width: number;
      height: number;
    };
  };
  abc: string;
}

export default cs({
  state: {
    count: 0,
  },
  getters: {
    getCount(state: RootState) {
      return state.count;
    },
  },
  mutations: {},
  modules: {},
});
