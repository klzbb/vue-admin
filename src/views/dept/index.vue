<template>
  <div class="dept">
    <div class="dept_dept">
      <div class="dept_dept_label">
        <span>部门列表</span>
        <i class="el-icon-circle-plus-outline" @click="addDept" />
      </div>
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
    <div class="dept_user">
      kkk
    </div>
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
    addDept() {

    },
    del(item) {

    },
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
<style lang="scss">
.dept{
  padding:15px;
  position: relative;
  &_dept{
    width: 200px;
    &_label{
      background-color: #409eff;
      color: #fff;
      height: 40px;
      line-height: 40px;
      padding:0 5px;
    }
  }
  &_user{
    width: 100%;
    position: absolute;
    top: 15px;
    left: 215px;
  }
}
</style>
