<template>
  <div class="menu_form">
    <el-drawer
      class="permis"
      :visible="menuAddVisiable"
      :with-header="false"
      :wrapper-closable="false"
      @opened="open"
    >
      <el-form ref="menuForm" class="permis_form" :model="menuForm">
        <div class="permis_title">{{ title }}</div>
        <el-form-item prop="value" label="上级模块" :label-width="formLabelWidth">
          <el-cascader
            v-model="aclCasValue"
            :clearable="true"
            :options="tree"
            :props="cascaderProps"
            placeholder="请选择上级权限模块"
          />
        </el-form-item>
        <el-form-item prop="name" label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="menuForm.name" placeholder="菜单名称" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="path" label="Path" :label-width="formLabelWidth">
          <el-input v-model="menuForm.path" placeholder="请输入菜单URL" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="component" label="Component" :label-width="formLabelWidth">
          <el-input v-model="menuForm.component" placeholder="请输入组件地址" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="componentName" label="componentName" :label-width="formLabelWidth">
          <el-input v-model="menuForm.componentName" placeholder="请输入组件名称" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标" :label-width="formLabelWidth">
          <el-input v-model="menuForm.icon" placeholder="点击右侧按钮选择图标" clearable autocomplete="off">
            <el-button slot="append" icon="el-icon-setting" @click="setIcon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select v-model="menuForm.status" placeholder="状态" clearable>
            <el-option :value="0" label="冻结" />
            <el-option :value="1" label="正常" />
          </el-select>
        </el-form-item>
        <el-form-item prop="seq" label="菜单顺序" :label-width="formLabelWidth">
          <el-input v-model="menuForm.seq" placeholder="菜单顺序" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input v-model="menuForm.remark" placeholder="备注" clearable autocomplete="off" />
        </el-form-item>
      </el-form>
      <div class="menu_form_btns">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-drawer>
    <Icons
      :is-show.sync="isShowIcons"
      @sure="getIconName"
    />
  </div>
</template>
<script>
import { aclmoduleAdd, aclmoduleTree, aclmoduleUpdate } from '@/api/index.js';
import Icons from './Icons.vue';
export default {
  name: 'MenuForm',
  components: { Icons },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    menuAddVisiable: {
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
      menuForm: {
        name: '',
        parentId: 0,
        component: '',
        componentName: '',
        icon: '',
        path: '',
        type: 1,
        status: 1,
        seq: '',
        remark: ''
      }
    };
  },
  methods: {
    open() {
      this.init();
    },
    init() {
      Promise.all([this.aclmoduleTree()])
        .then(res => {
          if (this.formType === '2') {
            this.menuForm = { ...this.editForm };
            this.aclCasValue = this.menuForm.aclCasValue;
          }
        })
        .catch(e => {});
    },
    cancel() {
      this.$emit('update:menuAddVisiable', false);
    },
    getIconName(iconName) {
      this.isShowIcons = false;
      this.menuForm.icon = iconName;
    },
    setIcon() {
      this.isShowIcons = true;
    },
    async aclmoduleTree() {
      const res = await aclmoduleTree();
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
    },
    async submit() {
      if (this.formType === '1') {
        this.createMenu();
      } else if (this.formType === '2') {
        this.updateMenu();
      }
    },
    /**
     * 创建菜单
     */
    async createMenu() {
      const len = this.aclCasValue.length - 1;
      this.menuForm.parentId = this.aclCasValue[len];
      const {
        parentId,
        name,
        seq,
        path,
        type,
        component,
        componentName,
        icon,
        status,
        remark
      } = this.menuForm;
      const res = await aclmoduleAdd({
        parentId: parentId || 0,
        name,
        seq,
        path,
        component,
        componentName,
        icon,
        type,
        status,
        remark
      });
      if (res && res.data.code === 0) {
        this.$refs.menuForm.resetFields();
        this.aclCasValue = [];
        this.$message.success('添加菜单成功');
        this.$emit('success');
      }
    },
    /**
     * 更新菜单
     */
    async updateMenu() {
      const len = this.aclCasValue.length - 1;
      this.menuForm.parentId = this.aclCasValue[len];
      const {
        parentId,
        name,
        seq,
        path,
        type,
        component,
        componentName,
        icon,
        status,
        remark,
        id
      } = this.menuForm;
      const updateRes = await aclmoduleUpdate({
        parentId: parentId || 0,
        name,
        seq,
        path,
        type,
        component,
        componentName,
        icon,
        status,
        remark,
        id
      });
      if (updateRes && updateRes.data.code === 0) {
        this.$refs.menuForm.resetFields();
        this.aclCasValue = [];
        this.$message.success('更新菜单成功');
        this.$emit('success');
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
