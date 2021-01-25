<template>
  <div class="user">
    <div class="user_search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="userAdd">新增</el-button>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="formInline.user" clearable placeholder="用户姓名" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="formInline.user" clearable placeholder="手机号码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="userSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="userList"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="username"
        label="用户名称"
        width="150"
      />
      <el-table-column
        prop="telephone"
        label="手机号码"
        width="120"
      />
      <el-table-column
        prop="mail"
        label="邮箱"
        width="200"
      />
      <el-table-column
        prop="deptName"
        label="部门名称"
        width="120"
      />
      <el-table-column
        prop="status"
        label="用户状态"
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
          <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delUser(scope.row)">删除</el-button>
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
    <user-form
      :title="title"
      :form-type="formType"
      :edit-form="editForm"
      :is-show.sync="isShow"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import {
  deptTree,
  register,
  userAll,
  userList,
  roleList,
  delUserById,
  updateById
} from '@/api/index.js';
import UserForm from './components/UserForm.vue';
export default {
  name: 'UserList',
  components: { UserForm },
  data() {
    return {
      title: '',
      isShow: false,
      formType: '1', // 1-新增 2-编辑
      editForm: {},
      selectedRoles: [],
      roles: [],
      total: 0,
      pageNo: 1,
      pageSize: 15,
      userList: [],

      deptTreeList: [],
      options: [],
      deptValue: '',
      formInline: {
        user: '',
        region: ''
      },

      drawer: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleSuccess() {
      this.isShow = false;
      this.init();
    },

    handleCurrentChange(val) {
      this.pageNo = val;
      this.userAll();
    },
    userAdd() {
      this.formType = '1';
      this.title = '新增用户';
      this.isShow = true;
    },
    userSearch() {

    },
    async userAll() {
      const res = await userAll({ pageNo: this.pageNo, pageSize: this.pageSize });
      if (res && res.data.code === 0) {
        this.userList = res.data.data.data;
        this.total = res.data.data.total;
        return res;
      }
    },
    editUser(row) {
      this.title = '编辑用户';
      this.formType = '2';
      this.isShow = true;
      this.$nextTick(() => {
        const selectedRoles = (row.roleIds && row.roleIds.split(',').map(item => parseInt(item))) || [];
        this.editForm = { type: '2', ...row, selectedRoles };
      });
    },

    delUser(row) {
      const { id } = row;
      this.$confirm('用户删除后将不可恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await delUserById({
            id
          });
          if (res && res.data.code === 0) {
            this.$message.success('删除成功');
            this.init();
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    init() {
      Promise.all([this.userAll()])
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
.user {
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
