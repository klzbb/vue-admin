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
    <el-drawer
      title="标题"
      :visible.sync="drawer"
      :with-header="false"
    >
      <div class="role_form">
        <div class="role_form_title">{{ title }}</div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="form.name" clearable placeholder="请填写角色名称" />
          </el-form-item>
          <el-form-item label="角色状态">
            <el-select v-model="form.status" clearable placeholder="请选择用户状态">
              <el-option label="无效" :value="0" />
              <el-option label="正常" :value="1" />
              <el-option label="冻结" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" clearable type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button @click="drawer = false">取消</el-button>
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
  deptTree,
  register,
  userAll,
  userList,
  delUserById
} from '@/api/index.js';
export default {
  name: 'Role2',
  data() {
    return {
      list: [],
      total: 0,
      pageNo: 1,
      pageSize: 15,
      userList: [],
      deptProps: {
        children: 'deptList',
        label: 'name',
        value: 'id'
      },
      deptTreeList: [],
      options: [],
      deptValue: '',
      title: '新增用户',
      formInline: {
        user: '',
        region: ''
      },
      form: {
        id: '',
        type: '1', // 表单类型 1-新增 2-编辑
        name: '',
        password: '123444',
        telephone: '',
        mail: '',
        deptId: '',
        status: 1,
        remark: ''
      },
      drawer: false
    };
  },
  watch: {
    deptValue(cur, old) {
      console.log(cur);
    }
  },
  mounted() {
    this.init();
  },
  methods: {

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
      this.title = '新增角色';
      this.drawer = true;
    },
    userSearch() {

    },
    async deptTree() {
      const res = await deptTree();
      if (res && res.data.code === 0) {
        const tree = res.data.data;
        this.deptTreeList = this.getTreeData(tree);
        return res;
      }
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].deptList.length < 1) {
          data[i].deptList = undefined;
        } else {
          this.getTreeData(data[i].deptList);
        }
      }
      return data;
    },
    handleChange(value) {
      console.log(value);
    },
    async submit() {
      const { type } = this.form;
      if (type === '1') {
        this.register();
      } else if (type === '2') {

      }
    },
    async register() {
      const len = this.deptValue.length - 1;
      this.form.deptId = this.deptValue[len];
      const { username, telephone, password, mail, status, remark, deptId } = this.form;
      const res = await register({
        username,
        telephone,
        password,
        mail,
        status,
        remark,
        deptId
      });
      if (res && res.data.code === 0) {
        this.drawer = false;
        this.$message.success('用户注册成功');
        this.init();
      }
    },
    async userAll() {
      const res = await userAll({ pageNo: this.pageNo, pageSize: this.pageSize });
      if (res && res.data.code === 0) {
        this.userList = res.data.data.data;
        this.total = res.data.data.total;
        return res;
      }
    },
    editRole(row) {
      this.title = '编辑角色';
      this.drawer = true;
      this.form = { ...row };
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
.role{
  padding:15px;
  &_form{
    padding:0 10px 20px;
    &_title{
      margin-bottom: 20px;
      position: relative;
      line-height: 60px;
    }
    &_title:after{
      content:'';
      width: 576px;
      height: 1px;
      background-color: #eee;
      position: absolute;
      bottom: 0;
      left: -10px;
    }
  }
  .el-select,
  .el-cascader{
    display:block;
  }
  .el-pagination{
    text-align:right;
    margin-top: 20px;
    padding-right: 50px;
  }
}
</style>
