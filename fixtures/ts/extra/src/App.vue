<template>
  <p>index.js</p>
  <div>count: {{ count }}</div>
</template>
<script lang="ts">
// [TEST] normally execute in a not setup script file, normally execute even if a template tag precedes a script tag, normally execute even there is no extra whitespace between a template tag and a script tag

import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

// index.js
const count = computed(() => store.getters.getCount);
</script>
