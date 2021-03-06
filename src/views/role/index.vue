<template>
  <div class="role">
    <div class="role_search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="roleAdd">新增</el-button>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="formInline.user" clearable placeholder="角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="userSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="list"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="name"
        label="角色名称"
        width="150"
      />
      <el-table-column
        prop="operate_time"
        label="最近修改时间"
        width="120"
      />
      <el-table-column
        prop="operator"
        label="最近修改者"
        width="200"
      />
      <el-table-column
        prop="status"
        label="角色状态"
        width="100"
      >
        <div slot-scope="scope">
          {{ scope.row.status | v10002 }}
        </div>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click="editRole(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="pageNo"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />
    <el-drawer
      :visible="drawer"
      :with-header="false"
      :wrapper-closable="false"
      @open="open"
    >
      <div class="role_form">
        <div class="role_form_title">{{ title }}</div>
        <el-form ref="roleForm" :model="form" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请填写角色名称" />
          </el-form-item>
          <el-form-item label="角色状态" prop="status">
            <el-select v-model="form.status" clearable placeholder="请选择用户状态">
              <el-option label="无效" :value="0" />
              <el-option label="正常" :value="1" />
              <el-option label="冻结" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" clearable type="textarea" />
          </el-form-item>
          <el-form-item label="权限选择">
            <el-tree
              ref="tree"
              :data="menuTree"
              show-checkbox
              check-strictly
              node-key="id"
              :default-checked-keys="checkedArr"
              :props="defaultProps"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  roleList,
  roleAdd,
  roleDel,
  roleTree,
  roleMenuSave,
  roleUpdate,
  menuTree,
  deptTree,
  register,
  userAll,
  userList,
  delUserById
} from '@/api/index.js';
export default {
  name: 'Role',
  data() {
    return {
      checkedArr: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuTree: [],
      type: '1',
      list: [],
      total: 0,
      pageNo: 1,
      pageSize: 15,
      deptProps: {
        children: 'deptList',
        label: 'name',
        value: 'id'
      },
      deptTreeList: [],
      options: [],
      title: '新增用户',
      formInline: {
        menuTree: [],
        user: '',
        region: ''
      },
      form: {
        menuTree: [],
        id: '',
        name: '',
        status: 1,
        remark: ''
      },
      drawer: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    open() {
      if (this.type === '2') {
        this.checkedArr = [];
        this.getMenuTree();
      }
    },
    async getMenuTree() {
      const res = await menuTree();
      if (res && res.data.code === 0) {
        const tree = res.data.data;
        this.menuTree = this.getTreeData(tree);
      }
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
    },
    cancel() {
      this.$refs.roleForm.resetFields();
      this.checkedArr = [];
      this.$nextTick(() => {
        this.drawer = false;
      });
    },
    editRole(row) {
      this.type = '1';
      this.drawer = true;
      this.$nextTick(() => {
        this.title = '编辑角色';
        this.form = { ...row };
        this.checkedArr = [];
        this.selectMenuTreeByRoleId(row.id);
      });
    },
    /**
     * 默认选中权限
     */
    async selectMenuTreeByRoleId(roleId) {
      const res = await roleTree({
        roleId
      });
      if (res && res.data.code === 0) {
        const list = res.data.data;
        this.menuTree = list;
        this.checkedArr = this.deepForChecked(list);
      }
    },
    /**
     * 递归树状结构获取选中节点
     * @return{Array} result
     */
    deepForChecked(data) {
      const result = [];
      function deep(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].checked === true) {
            result.push(data[i].id);
          }
          if (data[i].children.length > 0) {
            deep(data[i].children);
          }
        }
      }
      deep(data);
      return result;
    },
    /**
     * 添加角色；角色菜单关联
     */
    async submit() {
      const _this = this;
      if (_this.type === '2') {
        _this.menuTree;
        const menuIds = _this.$refs.tree.getCheckedNodes().map(item => item.id).join(',');
        const res = await roleAdd({ ..._this.form, menuIds });
        _this.$refs.roleForm.resetFields();
        _this.drawer = false;
        _this.$message.success('添加角色成功');
        _this.init();
      } else if (_this.type === '1') {
        const menuIds = _this.$refs.tree.getCheckedNodes().map(item => item.id).join(',');
        const res = await roleUpdate({ ..._this.form, menuIds });
        _this.$refs.roleForm.resetFields();
        _this.drawer = false;
        _this.$message.success('更新角色成功');
        _this.init();
      }
    },
    async roleList() {
      const res = await roleList();
      if (res && res.data.code === 0) {
        const list = res.data.data;
        this.list = list;
      }
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.userAll();
    },
    roleAdd() {
      this.type = '2';
      this.title = '新增角色';
      this.drawer = true;
    },
    userSearch() {

    },

    delRole(row) {
      const { id } = row;
      this.$confirm('角色删除后将不可恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await roleDel({
            roleId: id
          });
          if (res && res.data.code === 0) {
            this.$message.success('删除成功');
            this.init();
          }
        })
        .catch(() => {});
    },
    init() {
      Promise.all([this.roleList()])
        .then(res => {

        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style lang="scss">
.role {
  padding: 15px;
  &_form {
    padding: 0 10px 20px;
    &_title {
      position: relative;
      margin-bottom: 20px;
      line-height: 60px;
    }
    &_title:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: -10px;
      width: 576px;
      height: 1px;
      background-color: #eee;
    }
  }
  .el-select,
  .el-cascader {
    display: block;
  }
  .el-pagination {
    padding-right: 50px;
    margin-top: 20px;
    text-align: right;
  }
}
</style>
