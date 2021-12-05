.<template>
  <div>
    <el-tree :data="data" :props="m"></el-tree>
    <div @click="clickd">43</div>
    <el-tree :data="data" :props="{ label: 'titile' }" :render-content="renderContent" @on-select-change="onSelectChange"></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      m: { label: "titile" },
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
  methods: {
    onSelectChange(d,c){console.log(d,c)},
    loadNode() {},
    clickd() {
      this.data.push({
        label: "一级 1",
      });
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              Append
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              Delete
            </el-button>
          </span>
        </span>
      );
    },
  },
};
</script>

<style>
</style>
