<template>
  <div class="menu">
    <div class="menu_filter">
      <el-popover
        v-model="isShowAdd"
        placement="top"
        trigger="click"
      >
        <p>请选择创建类型</p>
        <div>
          <el-button size="mini" type="default" @click="addMenu">菜单</el-button>
          <el-button type="primary" size="mini" @click="addBtn">按钮</el-button>
        </div>
        <el-button slot="reference" type="primary">新增</el-button>
      </el-popover>
    </div>
    <el-table
      :data="tree"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="defaultProps"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="name"
        label="名称"
        sortable
        width="180"
      />

      <el-table-column
        prop="type"
        label="类型"
        width="80"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.type === 1 ? '菜单' : scope.row.type === 2 ? '按钮' : '其他' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="seq"
        label="顺序"
        width="80"
      />
      <el-table-column
        prop="path"
        label="地址"
      />
      <el-table-column
        prop="seq"
        label="操作"
        fixed="right"
        width="200"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click="editMenu(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delMenu(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增、编辑菜单 -->
    <menu-form
      :title="title"
      :form-type="formType"
      :edit-form="editForm"
      :menu-add-visiable.sync="menuAddVisiable"
      @success="handleMenuAddSuccess"
    />
  </div>
</template>
<script>
import {
  menuTree,
  menuDel
} from '@/api/index.js';
export default {
  name: 'MenuIndex',
  components: {
    MenuForm: () => import('./components/MenuForm.vue')
  },
  data() {
    return {
      formType: '1', // 1-新增 2-编辑
      editForm: {},
      menuAddVisiable: false,
      activeName: 'second',
      isShowAdd: false,
      aclCasValue: [],
      type: '1', // 1-编辑部门 2-新增部门
      title: '添加权限模块',
      value: [],
      options: [],
      tree: [],
      defaultProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      },
      form: {
        value: [],
        parent_id: 0,
        name: '',
        seq: '',
        status: 1,
        remark: ''
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleMenuAddSuccess() {
      this.menuAddVisiable = false;
      this.init();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addMenu() {
      this.formType = '1';
      this.isShowAdd = false;
      this.menuAddVisiable = true;
      this.title = '新增菜单';
    },
    addBtn() {
      this.isShowAdd = false;
    },
    editMenu(row) {
      this.formType = '2';
      const aclCasValue = this.levelToArr(row.level);
      this.editForm = { ...row, aclCasValue };
      this.title = '编辑菜单';
      this.menuAddVisiable = true;
    },
    /**
     * 选中上级模块
     */
    levelToArr(level) {
      let result;
      if (level.indexOf('.') === -1) {
        result = [level];
      } else {
        result = level.split('.');
      }
      result.shift();
      result = result.map(item => parseInt(item));
      console.log(result);
      return result;
    },
    delMenu(row) {
      this.$confirm('当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await menuDel({
            id: row.id
          });
          if (res && res.data.code === 0) {
            this.$message.success('删除成功');
            this.init();
          }
        })
        .catch(() => {});
    },
    init() {
      Promise.all([this.menuTree()])
        .then(res => {})
        .catch(e => {});
    },

    async menuTree() {
      const res = await menuTree();
      if (res && res.data.code === 0) {
        const tree = res.data.data;
        this.tree = this.getTreeData(tree);
        this.deptList = this.formMatch(tree);
      }
    },
    formMatch(list) {
      const arr = [{
        name: '无',
        id: 0
      }];
      const result = arr.concat(list);
      return result;
    },
    /**
     * 递归树状结构将children为([])空时，变为undefined
     * @return{Array} data
     */
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
  }
};

</script>
<style lang="scss">
.menu {
  position: relative;
  padding: 15px;

  &_filter {
    padding: 0 5px;
    margin-bottom: 10px;
    color: #fff;
    line-height: 40px;

    .label {
      margin-right: 20px;
    }
  }

  &_tree_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding-right: 8px;
    font-size: 14px;
  }
  // reset element-ui css
  .el-cascader {
    display: block;
  }

  .el-select {
    display: block;
  }
  .permis_title {
    position: relative;
    margin-bottom: 20px;
    line-height: 60px;
  }
  .permis_title:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -10px;
    width: 576px;
    height: 1px;
    background-color: #eee;
  }
  .permis_form {
    padding: 0 10px 20px;
  }
}

</style>
