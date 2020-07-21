<template>
  <div class="dept">
    <el-tree
      :data="tree"
      show-checkbox
      node-key="id"
      :default-checked-keys="[]"
      :props="defaultProps"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click.stop="edit(data)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="del(data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import { deptTree } from '@/api/index.js'
export default {
  name: 'Dept',
  data() {
    return {

      tree: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        },
        {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        },
        {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
      defaultProps: {
        children: 'deptList',
        label: 'name'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    edit(item) {
      debugger
    },
    init() {
      Promise.all([this.deptTree()]).then(res => {}).catch(e => {})
    },
    async deptTree() {
      const res = await deptTree()
      if (res && res.data.code === 0) {
        this.tree = res.data.data
      }
    }
  }
}
</script>
