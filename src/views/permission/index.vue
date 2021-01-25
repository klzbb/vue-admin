<template>
  <div class="dept">
    <div class="dept_dept">
      <div class="dept_dept_label">
        <!-- <el-button type="primary" @click="addMenu">新增</el-button> -->
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
          prop="url"
          label="功能链接"
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
    </div>
    <!-- 右侧弹窗 -->
    <el-drawer
      class="permis"
      title="标题"
      :visible.sync="isShowMenuDialog"
      :with-header="false"
    >
      <el-form ref="aclForm" class="permis_form" :model="aclForm">
        <div class="permis_title">{{ title }}</div>
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
        <el-form-item prop="name" label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="aclForm.name" placeholder="菜单名称" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="url" label="菜单URL" :label-width="formLabelWidth">
          <el-input v-model="aclForm.url" placeholder="请输入菜单URL" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="component" label="组件地址" :label-width="formLabelWidth">
          <el-input v-model="aclForm.component" placeholder="请输入组件地址" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标" :label-width="formLabelWidth">
          <el-input v-model="aclForm.icon" placeholder="请输入菜单图标" clearable autocomplete="off">
            <el-button slot="append" icon="el-icon-setting" @click="setIcon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select v-model="aclForm.status" placeholder="状态" clearable>
            <el-option :value="0" label="冻结" />
            <el-option :value="1" label="正常" />
          </el-select>
        </el-form-item>
        <el-form-item prop="seq" label="菜单顺序" :label-width="formLabelWidth">
          <el-input v-model="aclForm.seq" placeholder="菜单顺序" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input v-model="aclForm.remark" placeholder="备注" clearable autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowMenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-drawer>
    <!-- 图标弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      width="35%"
      :before-close="handleClose"
    >
      <el-tabs v-model="activeName" @tab-click="iconTab">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  menuTree,
  menuDel,
  menuAdd,
  menuUpdate,
  findMenuLevelById,
  deptUpdate,
  register,
  userList,
  delUserById
} from '@/api/index.js';
export default {
  name: 'Dept',
  data() {
    return {
      activeName: 'second',
      dialogVisible: false,
      isShowAdd: false,
      aclModuleId: '',
      pageNo: 1,
      pageSize: 10,
      userList: [],
      total: 0,
      isShowMenuDialog: false,
      aclCasValue: [],
      aclForm: {
        name: '',
        parent_id: 0,
        component: '',
        icon: '',
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
        children: 'children',
        hasChildren: 'hasChildren'
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        value: [],
        parent_id: 0,
        name: '',
        seq: '',
        status: 1,
        remark: ''
      },
      formLabelWidth: '120px',
      cascaderProps: {
        checkStrictly: true,
        value: 'id',
        expandTrigger: 'hover',
        children: 'children',
        label: 'name'
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    iconTab(tab, event) {
      console.log(tab, event);
    },
    /**
     * 设置图标
     */
    setIcon() {
      this.dialogVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    async getLevel(aclModuleId) {
      const res = await findMenuLevelById({ aclModuleId });
      const { level } = res.data.data;
      let result;
      if (level.indexOf('.') === -1) {
        result = [level];
      } else {
        result = level.split('.');
      }
      result.push(aclModuleId);
      result.shift();
      result = result.map(item => parseInt(item));
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
      const temp = tree.filter(item => item.id === parentId);
      if (temp.length > 0) {

      } else {
        this.deepByParentId();
      }

      return result;
    },
    nodeClick(data) {
      const {
        id: aclModuleId
      } = data;
      this.aclModuleId = aclModuleId;
      this.selectAclListByAclModuleId(aclModuleId);
    },

    userAdd() {
      this.aclForm = {};
      this.aclCasValue = [];
      this.aclTitle = '添加权限点';
      this.isShowMenuDialog = true;
    },
    /**
     * 提交按钮
     */
    async sure() {
      if (this.type === '2') {
        this.createMenu();
      } else if (this.type === '1') {
        this.updateMenu();
      }
    },
    /**
     * 创建菜单
     */
    async createMenu() {
      const len = this.aclCasValue.length - 1;
      this.aclForm.parent_id = this.aclCasValue[len];
      const {
        parent_id: parentId,
        name,
        seq,
        url,
        type,
        status,
        remark
      } = this.aclForm;
      const res = await menuAdd({
        parentId: parentId || 0,
        name,
        seq,
        url,
        type,
        status,
        remark
      });
      if (res && res.data.code === 0) {
        this.aclForm = {};
        this.isShowMenuDialog = false;
        this.$message.success('添加菜单成功');
        this.init();
      }
    },
    /**
     * 更新菜单
     */
    async updateMenu() {
      const len = this.aclCasValue.length - 1;
      this.aclForm.parent_id = this.aclCasValue[len];
      const {
        parent_id: parentId,
        name,
        seq,
        url,
        type,
        status,
        remark,
        id
      } = this.aclForm;
      const updateRes = await menuUpdate({
        parentId: parentId || 0,
        name,
        seq,
        url,
        type,
        status,
        remark,
        id
      });
      if (updateRes && updateRes.data.code === 0) {
        this.aclForm = {};
        this.isShowMenuDialog = false;
        this.$message.success('更新菜单成功');
        this.init();
      }
    },
    handleChange(value) {},
    addMenu() {
      this.isShowAdd = false;
      this.type = '2';
      this.form.status = 1;
      this.aclForm.type = 1;
      this.title = '新增菜单';
      this.isShowMenuDialog = true;
    },
    addBtn() {
      this.isShowAdd = false;
      this.title = '新增按钮';
      this.aclForm.type = 2;
      this.isShowMenuDialog = true;
    },
    editMenu(row) {
      this.type = '1';
      this.aclForm = { ...row };
      this.aclCasValue = this.levelToArr(row.level);
      this.title = '编辑菜单';
      this.isShowMenuDialog = true;
    },
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
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    edit(item) {
      this.type = '1';
      this.title = '编辑权限模块';
      this.form = {
        ...item
      };
      console.log(this.form);
      this.value = this.formatToValue(item);
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
<style lang="scss" scoped>
.dept {
  position: relative;
  padding: 15px;

  &_dept {
    width: 100%;
    &_label {
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
  }

  &_user {
    position: absolute;
    top: 15px;
    left: 365px;
    width: 100%;
    padding-left: 30px;

    &_label {
      height: 40px;
      padding: 0 5px;
      margin-bottom: 10px;
      color: #fff;
      line-height: 40px;
      background-color: #409eff;

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
