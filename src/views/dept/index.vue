<template>
  <div class="dept">
    <div class="dept_dept">
      <div class="role_filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click="addDept">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tree"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="defaultProps"
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
          prop="seq"
          label="顺序"
        />
        <el-table-column
          prop="seq"
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- @open="open" -->

    <el-drawer
      :title="title"
      :visible="dialogFormVisible"
      :with-header="false"
      :wrapper-closable="false"
    >
      <div class="dept_form">
        <div class="dept_form_title">{{ title }}</div>
        <el-form ref="elForm" :model="form">
          <el-form-item prop="value" label="上级部门" :label-width="formLabelWidth">
            <el-cascader
              v-model="value"
              :clearable="true"
              :options="deptList"
              :props="cascaderProps"
              placeholder="请选择上级部门"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" :clearable="true" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="seq" label="顺序" :label-width="formLabelWidth">
            <el-input v-model="form.seq" :clearable="true" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
            <el-input v-model="form.remark" :clearable="true" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="dept_form_btns">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </div>
      </div>

    </el-drawer>

  </div>
</template>
<script>
import {
  deptTree,
  deptAdd,
  deptDel,
  deptUpdate,
  register,
  userList,
  delUserById
} from '@/api/index.js';
export default {
  name: 'Dept',
  data() {
    return {
      formInline: {},
      deptId: '',
      pageNo: 1,
      pageSize: 10,
      userList: [],
      total: 0,
      userTitle: '添加用户',
      userVisible: false,
      userDeptList: [],
      userForm: {
        username: '',
        telephone: '',
        password: '',
        mail: '',
        status: 1,
        remark: '',
        deptId: ''
      },
      type: '1', // 1-编辑部门 2-新增部门
      title: '添加部门',
      currentDept: {},
      deptList: [],
      value: [0],
      options: [],
      tree: [],
      defaultProps: {
        children: 'deptList',
        label: 'name'
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        value: [],
        parent_id: 0,
        name: '',
        seq: '',
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
  mounted() {
    this.init();
  },
  methods: {
    cancel() {
      this.$refs.elForm.resetFields();
      this.value = [0];
      this.dialogFormVisible = false;
    },

    async sure() {
      if (this.type === '2') {
        console.log(this.value);
        const len = this.value.length - 1;
        this.form.parent_id = this.value[len];
        const { parent_id: parentId, name, seq, remark } = this.form;
        const res = await deptAdd({
          parentId,
          name,
          seq,
          remark
        });
        if (res && res.data.code === 0) {
          this.form = {};
          this.dialogFormVisible = false;
          this.$message.success('添加部门成功');
          this.init();
        }
      } else if (this.type === '1') {
        const { parent_id: parentId, name, seq, remark, id } = this.form;
        const updateRes = await deptUpdate({
          parentId,
          name,
          seq,
          remark,
          id
        });
        if (updateRes && updateRes.data.code === 0) {
          this.form = {};
          this.dialogFormVisible = false;
          this.$message.success('更新部门成功');
          this.init();
        }
      }
    },
    handleChange(value) {},
    addDept() {
      this.type = '2';
      this.title = '添加部门';
      this.dialogFormVisible = true;
    },
    del(item) {
      this.$confirm('部门删除后将不可恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await deptDel({
            id: item.id
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
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.type = '1';
        this.title = '编辑部门';
        this.form = {
          ...item
        };
        this.value = this.formatToValue(item);
      });
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
      Promise.all([this.deptTree()])
        .then((res) => {})
        .catch((e) => {});
    },

    async deptTree() {
      const res = await deptTree();
      if (res && res.data.code === 0) {
        const tree = res.data.data;
        this.tree = this.getTreeData(tree);
        this.deptList = this.formMatch(tree);
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
<style lang="scss" scoped>
.dept {
  padding: 15px;
  position: relative;

  &_dept {
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

  &_form{
    padding: 0 10px 20px;
    &_title{
      position: relative;
      margin-bottom: 20px;
      line-height: 60px;
    }
    &_btns{
      text-align: right;
      padding-right:20px;
    }
  }

  // reset element-ui css
  .el-cascader {
    display: block;
  }

  .el-select {
    display: block;
  }
}
</style>
