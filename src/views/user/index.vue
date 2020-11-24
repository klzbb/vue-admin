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
    <el-drawer
      title="标题"
      :visible.sync="drawer"
      :with-header="false"
    >
      <div class="user_form">
        <div class="user_form_title">{{ title }}</div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="用户名称">
            <el-input v-model="form.username" clearable placeholder="请填写用户名称" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="form.telephone" clearable placeholder="请填写手机号码" />
          </el-form-item>
          <el-form-item label="邮箱号码">
            <el-input v-model="form.mail" clearable placeholder="请填写邮箱号码" />
          </el-form-item>
          <el-form-item v-if="form.type === '1'" label="账号密码">
            <el-input v-model="form.password" type="password" clearable placeholder="请填写账号密码" />
          </el-form-item>
          <el-form-item label="部门">
            <el-cascader
              v-model="deptValue"
              clearable
              :options="deptTreeList"
              :props="deptProps"
              placeholder="请选择部门"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="selectedRoles" multiple placeholder="请选择角色">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态">
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
  deptTree,
  register,
  userAll,
  userList,
  roleList,
  delUserById,
  updateById
} from '@/api/index.js';
export default {
  name: 'UserList',
  data() {
    return {
      selectedRoles: [],
      roles: [],
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
        username: '',
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
        this.roles = res.data.data;
      }
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.userAll();
    },
    userAdd() {
      this.title = '新增用户';
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
        this.updateById();
      }
    },
    async updateById() {
      const len = this.deptValue.length - 1;
      this.form.deptId = this.deptValue[len];
      const { username, telephone, password, mail, status, remark, deptId } = this.form;
      const rolesStr = this.selectedRoles.join(',');
      const res = await updateById({
        username,
        telephone,
        password,
        mail,
        status,
        remark,
        deptId,
        rolesStr
      });
      if (res && res.data.code === 0) {
        this.drawer = false;
        this.$message.success('用户注册成功');
        this.init();
      }
    },
    async register() {
      const len = this.deptValue.length - 1;
      this.form.deptId = this.deptValue[len];
      const { username, telephone, password, mail, status, remark, deptId } = this.form;
      const rolesStr = this.selectedRoles.join(',');
      const res = await register({
        username,
        telephone,
        password,
        mail,
        status,
        remark,
        deptId,
        rolesStr
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
    editUser(row) {
      this.title = '编辑用户';
      this.drawer = true;
      this.form = { type: '2', ...row };
      this.selectedRoles = (row.roleIds && row.roleIds.split(',').map(item => parseInt(item))) || [];
      this.setDeptIds(this.deptTreeList, row.deptId);
    },
    /**
     * 设置选中部门
     */
    setDeptIds(deptList, currentDeptId) {
      for (let i = 0; i < deptList.length; i++) {
        // console.log('item==', deptList[i]);
        if (deptList[i].id === currentDeptId) {
          console.log(deptList[i].level);
          if (deptList[i].level.indexOf('.') !== -1) {
            let arr = [];
            arr = deptList[i].level.split('.').map(item => parseInt(item));
            arr.shift();
            arr.push(currentDeptId);
            this.deptValue = arr;
          } else {
            this.deptValue = [currentDeptId];
          }
        } else if (deptList[i].deptList && deptList[i].deptList.length > 0) {
          this.setDeptIds(deptList[i].deptList, currentDeptId);
        }
      }
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
      Promise.all([this.deptTree(), this.userAll(), this.roleList()])
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
