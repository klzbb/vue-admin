<template>
  <div class="menu_add">
    <el-drawer
      class="permis"
      title="标题"
      :visible.sync="visiable"
      :with-header="false"
      :wrapper-closable="false"
      destroy-on-close
    >
      <el-form ref="aclForm" class="permis_form" :model="aclForm">
        <div class="permis_title">新增菜单</div>
        <el-form-item prop="value" label="上级模块" :label-width="formLabelWidth">
          <el-cascader
            v-model="aclCasValue"
            :clearable="true"
            :options="tree"
            :props="cascaderProps"
            placeholder="请选择上级权限模块"
            @focus="focus"
          />
        </el-form-item>
        <el-form-item prop="name" label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="aclForm.name" placeholder="菜单名称" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="path" label="菜单URL" :label-width="formLabelWidth">
          <el-input v-model="aclForm.path" placeholder="请输入菜单URL" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="component" label="组件地址" :label-width="formLabelWidth">
          <el-input v-model="aclForm.component" placeholder="请输入组件地址" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="componentName" label="组件名称" :label-width="formLabelWidth">
          <el-input v-model="aclForm.componentName" placeholder="请输入组件名称" clearable autocomplete="off" />
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
      <div class="menu_add_btns">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="createMenu">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { aclmoduleAdd, aclmoduleTree } from '@/api/index.js';
export default {
  name: 'MenuAdd',
  props: {
    visiable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
      aclForm: {
        name: '',
        parent_id: 0,
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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      Promise.all([this.aclmoduleTree()])
        .then(res => {})
        .catch(e => {});
    },
    cancel() {
      this.visiable = false;
      this.$emit('update:menuEditVisiable', false);
    },
    setIcon() {
      this.dialogVisible = true;
    },
    focus() {
      this.aclmoduleTree();
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
        path,
        type,
        component,
        componentName,
        icon,
        status,
        remark
      } = this.aclForm;
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
        this.$refs.aclForm.resetFields();
        this.aclCasValue = [];
        this.isShowMenuDialog = false;
        this.$message.success('添加菜单成功');
        this.$emit('success');
      }
    }

  }
};
</script>
<style lang="scss">
.menu_add {
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
