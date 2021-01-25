<template>
  <div class="user_form">
    <el-drawer
      :title="title"
      :visible.sync="isShow"
      :wrapper-closable="false"
      :with-header="false"
      @opened="opened"
    >
      <div class="user_form">
        <div class="user_form_title">{{ title }}</div>
        <el-form ref="userForm" :model="userForm" label-width="80px">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="userForm.username" clearable placeholder="请填写用户名称" />
          </el-form-item>
          <el-form-item label="手机号码" prop="telephone">
            <el-input v-model="userForm.telephone" clearable placeholder="请填写手机号码" />
          </el-form-item>
          <el-form-item label="邮箱号码" prop="mail">
            <el-input v-model="userForm.mail" clearable placeholder="请填写邮箱号码" />
          </el-form-item>
          <el-form-item v-if="formType === '1'" label="账号密码" prop="password">
            <el-input v-model="userForm.password" type="password" clearable placeholder="请填写账号密码" />
          </el-form-item>
          <el-form-item label="部门" prop="deptValue">
            <el-cascader
              v-model="userForm.deptValue"
              clearable
              :options="deptTreeList"
              :props="deptProps"
              placeholder="请选择部门"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="角色" prop="selectedRoles">
            <el-select v-model="userForm.selectedRoles" multiple placeholder="请选择角色">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-select v-model="userForm.status" clearable placeholder="请选择用户状态">
              <el-option label="无效" :value="0" />
              <el-option label="正常" :value="1" />
              <el-option label="冻结" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="userForm.remark" clearable type="textarea" />
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
import { deptTree, roleList, updateById, register, menuTree } from '@/api/index.js';
export default {
  name: 'UserForm',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String, // 1-新增 2-编辑
      default: '1'
    },
    editForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      deptProps: {
        children: 'deptList',
        label: 'name',
        value: 'id'
      },
      deptTreeList: [],
      roles: [],
      isShowIcons: false,
      aclCasValue: [],
      cascaderProps: {
        checkStrictly: true,
        value: 'id',
        expandTrigger: 'hover',
        children: 'children',
        label: 'name'
      },
      tree: [],
      formLabelWidth: '120px',
      userForm: {
        deptValue: '',
        selectedRoles: [],
        id: '',
        type: '1', // 表单类型 1-新增 2-编辑
        username: '',
        password: '123444',
        telephone: '',
        mail: '',
        deptId: '',
        status: 1, // 用户状态 1-正常
        remark: ''
      }
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    opened() {
      this.init();
    },
    init() {
      Promise.all([
        this.deptTree(),
        this.roleList()
      ])
        .then(res => {
          if (this.formType === '2') {
            this.userForm = { ...this.editForm };
            this.userForm.deptValue = this.getDeptIds(this.deptTreeList, this.userForm.deptId);
          }
        })
        .catch(e => {});
    },
    /**
     * 设置选中部门
     */
    getDeptIds(deptList, currentDeptId) {
      let deptValue;
      function deep(deptList, currentDeptId) {
        for (let i = 0; i < deptList.length; i++) {
          if (deptList[i].id === currentDeptId) {
            if (deptList[i].level.indexOf('.') !== -1) {
              let arr = [];
              arr = deptList[i].level.split('.').map(item => parseInt(item));
              arr.shift();
              arr.push(currentDeptId);
              deptValue = arr;
            } else {
              deptValue = [currentDeptId];
            }
          } else if (deptList[i].deptList && deptList[i].deptList.length) {
            deep(deptList[i].deptList, currentDeptId);
          }
        }
      }
      deep(deptList, currentDeptId);
      return deptValue;
    },
    async deptTree() {
      const res = await deptTree();
      if (res && res.data.code === 0) {
        const tree = res.data.data;
        this.deptTreeList = this.getTreeData(tree);
        return res;
      }
    },

    /**
     * 递归树状结构将children为([])空时，变为undefined
     * @return{Array} data
     */
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].deptList.length < 1) {
          // deptList若为空数组，则将deptList设为undefined
          data[i].deptList = undefined;
        } else {
          // deptList若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].deptList);
        }
      }
      return data;
    },

    async roleList() {
      const res = await roleList();
      if (res && res.data.code === 0) {
        this.roles = res.data.data;
      }
    },
    cancel() {
      this.$refs.userForm.resetFields();
      this.$emit('update:isShow', false);
    },
    getIconName(iconName) {
      this.isShowIcons = false;
      this.userForm.icon = iconName;
    },
    setIcon() {
      this.isShowIcons = true;
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

    async submit() {
      if (this.formType === '1') {
        this.register();
      } else if (this.formType === '2') {
        this.updateUser();
      }
    },
    async updateUser() {
      const { username, telephone, mail, status, remark, deptId, id } = this.userForm;
      const rolesStr = this.userForm.selectedRoles.join(',');
      const res = await updateById({
        id,
        username,
        telephone,
        mail,
        status,
        remark,
        deptId,
        rolesStr
      });
      if (res && res.data.code === 0) {
        this.$refs.userForm.resetFields();
        this.$nextTick(() => {
          this.$refs.userForm.resetFields();
          this.$message.success('用户修改成功');
          this.$emit('success');
        });
      }
    },
    async register() {
      const len = this.userForm.deptValue.length - 1;
      this.userForm.deptId = this.userForm.deptValue[len];
      const { username, telephone, password, mail, status, remark, deptId } = this.userForm;
      const rolesStr = this.userForm.selectedRoles.join(',');
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
        this.$refs.userForm.resetFields();
        this.$nextTick(() => {
          this.$refs.userForm.resetFields();
          this.$message.success('用户注册成功');
          this.$emit('success');
        });
      }
    }
  }
};
</script>
<style lang="scss">
.menu_form {
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
  &_btns {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
  }
  .el-cascader,
  .el-select {
    display: block;
  }
}
</style>
