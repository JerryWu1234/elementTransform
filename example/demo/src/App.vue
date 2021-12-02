<template>
  <div id="app">
    <customer-button></customer-button>,
    <customer-tree></customer-tree>
  </div>
</template>
<script>
import customerButton from './componentTestCase/button.vue'
import customerTree from './componentTestCase/tree.vue'
export default {
  components: {
    customerButton,
    customerTree
  }
};
</script>>
