<template>
  <div class="dept">
    <div class="dept_dept">
      <div class="dept_dept_label">
        <span class="label">角色列表</span>
        <i class="el-icon-circle-plus-outline" @click="addDept" />
      </div>
      <el-tree
        :data="tree"
        show-checkbox
        node-key="id"
        :default-checked-keys="[]"
        :props="defaultProps"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="dept_dept_tree_item">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click.stop="edit(data)">编辑</el-button>
            <el-button type="text" size="mini" @click.stop="del(data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="dept_user">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#409eff"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item index="1">角色与权限</el-menu-item>
        <el-menu-item index="4">角色与用户</el-menu-item>
      </el-menu>
      <div class="dept_user_">
        <el-tree
          :data="roleAclList"
          show-checkbox
          node-key="id"
          :default-checked-keys="[]"
          :props="roleAclProps"
        >
          <span slot-scope="{ node, data }" class="dept_dept_tree_item">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click.stop="edit(data)">编辑</el-button>
              <el-button type="text" size="mini" @click.stop="del(data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      width="800px"
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="elForm" :model="form">
        <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" :clearable="true" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="状态" clearable>
            <el-option :value="0" label="禁用" />
            <el-option :value="1" label="正常" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" :clearable="true" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="800px"
      :modal-append-to-body="false"
      :title="aclTitle"
      :visible.sync="userVisible"
    >
      <el-form ref="aclForm" :model="aclForm">
        <el-form-item prop="value" label="上级模块" :label-width="formLabelWidth">
          <el-cascader
            v-model="aclCasValue"
            :clearable="true"
            :options="tree"
            :props="cascaderProps"
            placeholder="请选择上级权限模块"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item prop="name" label="权限点名称" :label-width="formLabelWidth">
          <el-input v-model="aclForm.name" placeholder="权限点名称" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="url" label="功能链接" :label-width="formLabelWidth">
          <el-input v-model="aclForm.url" placeholder="功能链接" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="type" label="类型" :label-width="formLabelWidth">
          <el-select v-model="aclForm.type" placeholder="类型" clearable>
            <el-option :value="1" label="菜单" />
            <el-option :value="2" label="按钮" />
            <el-option :value="3" label="其他" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select v-model="aclForm.status" placeholder="状态" clearable>
            <el-option :value="0" label="冻结" />
            <el-option :value="1" label="正常" />
          </el-select>
        </el-form-item>
        <el-form-item prop="seq" label="展示顺序" :label-width="formLabelWidth">
          <el-input v-model="aclForm.seq" placeholder="展示顺序" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input v-model="aclForm.remark" placeholder="备注" clearable autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  roleAdd,
  roleUpdate,
  roleList,
  roleDel,
  roleTree,
  aclmoduleTree,
  aclmoduleDel,
  aclmoduleAdd,
  aclmoduleUpdate,
  aclAdd,
  aclDel,
  aclUpdate,
  aclPageList,
  aclmoduleFindLevelById,
  deptUpdate,
  register,
  userList,
  delUserById
} from '@/api/index.js';
export default {
  name: 'Role',
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',

      aclModuleId: '',
      pageNo: 1,
      pageSize: 10,
      roleAclList: [],
      total: 0,
      aclTitle: '添加用户',
      userVisible: false,
      aclCasValue: [],
      aclForm: {
        name: '',
        aclModuleId: '',
        url: '',
        type: '',
        status: 1,
        seq: '',
        remark: ''
      },
      type: '1', // 1-编辑部门 2-新增部门
      title: '添加权限模块',
      currentDept: {},
      deptList: [],
      value: [],
      options: [],
      tree: [],
      defaultProps: {
        children: 'deptList',
        label: 'name'
      },
      roleAclProps: {
        isLeaf: this.leafFn,
        children: 'aclModuleList',
        label: 'name'
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        status: 1,
        remark: ''
      },
      formLabelWidth: '120px',
      cascaderProps: {
        checkStrictly: true,
        value: 'id',
        expandTrigger: 'hover',
        children: 'deptList',
        label: 'name'
      }
    };
  },
  watch: {
    aclCasValue(cur, old) {
      console.log(cur);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    leafFn(data, node) {
      if (data.aclModuleList) {
        data.aclModuleList = data.aclModuleList.concat(data.aclList);
      }
      // debugger;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    aclDel(row) {
      const { id } = row;
      this.$confirm('权限点删除后将不可恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await aclDel({
            id
          });
          if (res && res.data.code === 0) {
            this.$message.success('删除成功');
            this.selectAclListByAclModuleId(this.aclModuleId);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    async aclEdit(row) {
      this.aclForm = {
        ...row
      };
      this.aclTitle = '编辑权限点';
      this.aclCasValue = await this.getLevel(row.acl_module_id);
      this.userVisible = true;
    },
    async getLevel(aclModuleId) {
      const res = await aclmoduleFindLevelById({
        aclModuleId
      });
      const { level } = res.data.data;
      let result;
      if (level.indexOf('.') === -1) {
        result = [level];
      } else {
        result = level.split('.');
      }
      result.push(aclModuleId);
      result.shift();
      result = result.map((item) => parseInt(item));
      return result;
    },
    /**
     * 根据tree 和 parentId 转化aclCasValue值
     * @param tree 树状数据结构
     * @param parentId 当前权限点父级权限模块id
     * @return array
     */
    deepByParentId(tree, parentId) {
      // 取得parentId所属的顶层权限模块
      const level = '';
      const result = [];
      const temp = tree.filter((item) => item.id === parentId);
      if (temp.length > 0) {

      } else {
        this.deepByParentId();
      }

      return result;
    },
    nodeClick(data) {
      this.selectAclListByAclModuleId(data.id);
    },
    async selectAclListByAclModuleId(roleId) {
      const res = await roleTree({
        roleId
      });
      if (res && res.data.code === 0) {
        this.roleAclList = res.data.data;
      }
    },
    userAdd() {
      this.aclForm = {};
      this.aclCasValue = [];
      this.aclTitle = '添加权限点';
      this.userVisible = true;
    },
    async submit() {
      const len = this.aclCasValue.length - 1;
      this.aclForm.aclModuleId = this.aclCasValue[len];
      const {
        name,
        aclModuleId,
        url,
        type,
        status,
        seq,
        remark
      } = this.aclForm;

      const res = await aclAdd({
        name,
        aclModuleId,
        url,
        type,
        status,
        seq,
        remark
      });
      if (res && res.data.code === 0) {
        this.userVisible = false;
        this.$message.success('权限点新增成功');
        if (this.aclModuleId) this.selectAclListByAclModuleId(this.aclModuleId);
      }
    },
    async sure() {
      if (this.type === '2') {
        const res = await roleAdd(this.form);
        this.form = {};
        this.dialogFormVisible = false;
        this.$message.success('添加角色成功');
        this.init();
      } else if (this.type === '1') {
        const res = await roleUpdate(this.form);
        this.form = {};
        this.dialogFormVisible = false;
        this.$message.success('更新角色成功');
        this.init();
      }
    },
    handleChange(value) {},
    addDept() {
      this.type = '2';
      this.title = '添加角色';
      this.dialogFormVisible = true;
    },
    del(item) {
      this.$confirm('角色删除后将不可恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await roleDel({
            roleId: item.id
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
    edit(item) {
      this.type = '1';
      this.title = '编辑角色';
      this.form = {
        ...item
      };
      this.dialogFormVisible = true;
    },
    // 选中部门value 值转换 0.23.34 => [23,34]
    formatToValue(item) {
      let arr = [];
      if (item.level.indexOf('.') !== -1) {
        const tempArr = item.level.split('.');
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i] !== '0') {
            arr.push(parseInt(tempArr[i]));
          }
        }
      } else {
        arr = [0];
      }
      console.log(arr);
      return arr;
    },
    init() {
      Promise.all([this.roleList()])
        .then((res) => {})
        .catch((e) => {});
    },

    async roleList() {
      const res = await roleList();
      if (res && res.data.code === 0) {
        const tree = res.data.data;
        this.tree = tree;
      }
    },
    formMatch(list) {
      const arr = [
        {
          name: '无',
          id: 0
        }
      ];
      const result = arr.concat(list);
      return result;
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].deptList.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].deptList = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].deptList);
        }
      }
      return data;
    }
  }
};
</script>
<style lang="scss">
.dept {
  padding: 15px;
  position: relative;

  &_dept {
    width: 350px;

    &_label {
      background-color: #409eff;
      color: #fff;
      height: 40px;
      line-height: 40px;
      padding: 0 5px;
      margin-bottom: 10px;

      .label {
        margin-right: 20px;
      }
    }

    &_tree_item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }

  &_user {
    width: 100%;
    position: absolute;
    top: 15px;
    left: 365px;
    padding-left: 30px;

    &_label {
      background-color: #409eff;
      color: #fff;
      height: 40px;
      line-height: 40px;
      padding: 0 5px;
      margin-bottom: 10px;

      .label {
        margin-right: 20px;
      }
    }
  }

  // reset element-ui css
  .el-cascader {
    display: block;
  }

  .el-select {
    display: block;
  }

  .el-menu--horizontal > .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}
</style>
