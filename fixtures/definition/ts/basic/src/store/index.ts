import { createStore } from "vuex";

// [TEST] normally execute when the imported path is relative
import { notStore, banner } from "./banner"; // [TEST] normally execute when named export, normally execute when another exported variable exists
import popup from "./popup"; // [TEST] normally execute when default export

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
    getCount(state: RootState) {
      return state.count;
    },
    getAppDetail(state: RootState) {
      return state.appDetail;
    },
    abc: (state: RootState) => state.abc,
  },
  actions: {
    async increment({ dispatch }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          dispatch("incrementBy", 1); // [TEST] normally execute when a action is called inside action, normally execute even if the context is destructured
          resolve(null);
        }, 500);
      });
    },
    async incrementBy(context, payload: number) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.commit("incrementBy", payload); // [TEST] normally execute when a mutation is called inside action, normally execute even if the context is not destructured
          resolve(null);
        }, 500);
      });
    },
  },
  mutations: {
    increment(state: RootState) {
      state.count++;
    },
    incrementBy(state: RootState, payload: number) {
      state.count += payload;
    },
    setScrollPosition(state: RootState, position: number) {
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
