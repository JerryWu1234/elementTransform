<template>
  <div id="app">
    <el-button round>2323</el-button>
    <el-tree :data='data'></el-tree>
  </div>
</template>
<script>
export default {
  data(){
    return {
      data: [{
        label: '一级 1'
      }]
    }
  }
}
</script>>
