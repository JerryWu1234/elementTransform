.<template>
  <div>
    <el-tree :data="data" :props="{ label: 'titile' }"></el-tree>
    <div @click='clickd' >43</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },

    };
  },
  methods:{
    clickd(){
      this.data.push({
         label: "一级 1",
      })
    }
  }
};
</script>

<style>
</style>
