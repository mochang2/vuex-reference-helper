// [TEST] normally execute in js files

import { computed } from "vue";
import { useStore as us } from "vuex"; // [TEST] normally execute when the imported name is not "useStore"

export const useBanner = () => {
  const st = us(); // [TEST] normally execute when the name of the store is not "store"

  const isBannerOpen1 = computed(() => st.state.myBanner.isOpen);
  const isBannerOpen2 = computed(() => st.getters["myBanner/getIsOpen"]);
  const isBannerOpen3 = computed(() => st!.state?.myBanner!.isOpen); // [TEST] normally execute when optional chainings or non-null assertion operations are used
  const openBanner = () => {
    st
      .commit(
        "myBanner/open"
      ); /* [TEST] normally execute when there is any white spaces */
  };
  const closeBanner = () => {
    st.commit("myBanner/close");
  };

  return {
    isBannerOpen1,
    isBannerOpen2,
    isBannerOpen3,
    openBanner,
    closeBanner,
  };
};
