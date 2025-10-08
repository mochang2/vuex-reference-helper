import { createStore } from "vuex";

// [TEST] normally execute when the imported path is relative
import { notStore, banner } from "./banner"; // [TEST] normally execute when named export, normally execute when another exported variable exists
import popup from "./popup"; // [TEST] normally execute when default export

export const store = createStore({
  state: {
    count: 0, // [TEST] normally execute primitive type
    appDetail: {
      // [TEST] normally execute nested object
      scrollPosition: 100,
      size: {
        width: 0,
        height: 0,
      },
    },
    abc: "abc", // [TEST] normally execute when getters have the same name
  },
  getters: {
    getCount(state) {
      return state.count;
    },
    getAppDetail(state) {
      return state.appDetail;
    },
    abc: (state) => state.abc,
  },
  actions: {
    async increment({ dispatch }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          dispatch("incrementBy", 1); // [TEST] normally execute when a action is called inside action, normally execute even if the context is destructured
          resolve();
        }, 500);
      });
    },
    async incrementBy(context, payload) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.commit("incrementBy", payload); // [TEST] normally execute when a mutation is called inside action, normally execute even if the context is not destructured
          resolve();
        }, 500);
      });
    },
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    incrementBy(state, payload) {
      state.count += payload;
    },
    setScrollPosition(state, position) {
      state.appDetail.scrollPosition = position;
    },
  },
  modules: {
    myBanner: banner, // [TEST] normally execute when the name of module is different with the imported name
    popup, // [TEST] normally execute when the name of module is same with the imported name

    // the below code does not work in current version
    // test: {
    //   state: {
    //     abc: "abc",
    //   },
    //   getters: {
    //     getAbc: (state) => {
    //       return this.state.abc;
    //     },
    //   },
    // },
  },
});
