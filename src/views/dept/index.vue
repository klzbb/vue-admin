<template>
  <div class="dept">
    <div class="dept_dept">
      <div class="dept_dept_label">
        <span class="label">部门列表</span>
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
      <div class="dept_user_label">
        <span class="label">用户列表</span>
        <i class="el-icon-circle-plus-outline" @click="userAdd" />
      </div>
      <div class="dept_user_">
        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="username" label="姓名" width="180" />

          <el-table-column prop="dept_id" label="所属部门" width="180" />

          <el-table-column prop="mail" label="邮箱" width="180" />
          <el-table-column prop="telephone" label="电话" width="180" />
          <el-table-column prop="status" label="状态" width="180" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="userEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="userDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="pageNo"
          :page-size="100"
          layout="total, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      width="800px"
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="800px"
      :modal-append-to-body="false"
      :title="userTitle"
      :visible.sync="userVisible"
    >
      <el-form ref="userForm" :model="userForm">
        <el-form-item prop="value" label="上级部门" :label-width="formLabelWidth">
          <el-cascader
            v-model="userDeptList"
            :clearable="true"
            :options="tree"
            :props="cascaderProps"
            placeholder="请选择上级部门"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" placeholder="用户名" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" placeholder="密码" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="telephone" label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="userForm.telephone" placeholder="电话号码" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="mail" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="userForm.mail" placeholder="邮箱" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select v-model="userForm.status" placeholder="状态" clearable>
            <el-option :value="0" label="禁用" />
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="冻结" />
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input v-model="userForm.remark" placeholder="备注" clearable autocomplete="off" />
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
  deptTree,
  deptAdd,
  deptDel,
  deptUpdate,
  register,
  userList,
  delUserById
} from '@/api/index.js'
export default {
  name: 'Dept',
  data() {
    return {
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
      value: [],
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
    }
  },
  mounted() {
    this.init()
    this.test1()
  },
  methods: {

    test1() {
      const obj = { name: 'kljkklj' }
      this.test2(obj)
      console.log(obj)
    },
    test2(obj) {
      obj = { name: 123, age: 123 }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    userDel(row) {
      const { id } = row
      this.$confirm('用户删除后将不可恢复，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await delUserById({
            id
          })
          if (res && res.data.code === 0) {
            this.$message.success('删除成功')
            this.selectUserListByDeptId(this.deptId)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    userEdit(row) {},
    nodeClick(data) {
      const { id: deptId } = data
      this.deptId = deptId
      this.selectUserListByDeptId(deptId)
    },
    async selectUserListByDeptId(deptId) {
      const params = {
        deptId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      const res = await userList(params)
      if (res && res.data.code === 0) {
        this.userList = res.data.data.data
        this.total = res.data.data.total
      }
    },
    userAdd() {
      this.userForm = {}
      this.userDeptList = []
      this.userTitle = '添加用户'
      this.userVisible = true
    },
    async submit() {
      console.log(this.value)
      const len = this.userDeptList.length - 1
      this.userForm.deptId = this.userDeptList[len]
      const {
        username,
        telephone,
        password,
        mail,
        status,
        remark,
        deptId
      } = this.userForm

      const res = await register({
        username,
        telephone,
        password,
        mail,
        status,
        remark,
        deptId
      })
      if (res && res.data.code === 0) {
        this.userVisible = false
        this.$message.success('用户注册成功')
        if (this.deptId) this.selectUserListByDeptId(this.deptId)
      }
    },
    async sure() {
      if (this.type === '2') {
        console.log(this.value)
        const len = this.value.length - 1
        this.form.parent_id = this.value[len]
        const { parent_id: parentId, name, seq, remark } = this.form
        const res = await deptAdd({
          parentId,
          name,
          seq,
          remark
        })
        if (res && res.data.code === 0) {
          this.form = {}
          this.dialogFormVisible = false
          this.$message.success('添加部门成功')
          this.init()
        }
      } else if (this.type === '1') {
        const { parent_id: parentId, name, seq, remark, id } = this.form
        const updateRes = await deptUpdate({
          parentId,
          name,
          seq,
          remark,
          id
        })
        if (updateRes && updateRes.data.code === 0) {
          this.form = {}
          this.dialogFormVisible = false
          this.$message.success('更新部门成功')
          this.init()
        }
      }
    },
    handleChange(value) {},
    addDept() {
      this.type = '2'
      this.title = '添加部门'
      this.dialogFormVisible = true
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
          })
          if (res && res.data.code === 0) {
            this.$message.success('删除成功')
            this.init()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    edit(item) {
      this.type = '1'
      this.title = '编辑部门'
      this.form = {
        ...item
      }
      this.value = this.formatToValue(item)
      this.dialogFormVisible = true
    },
    // 选中部门value 值转换 0.23.34 => [23,34]
    formatToValue(item) {
      let arr = []
      if (item.level.indexOf('.') !== -1) {
        const tempArr = item.level.split('.')
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i] !== '0') {
            arr.push(parseInt(tempArr[i]))
          }
        }
      } else {
        arr = [0]
      }
      console.log(arr)
      return arr
    },
    init() {
      Promise.all([this.deptTree()])
        .then(res => {})
        .catch(e => {})
    },

    async deptTree() {
      const res = await deptTree()
      if (res && res.data.code === 0) {
        const tree = res.data.data
        this.tree = this.getTreeData(tree)
        this.deptList = this.formMatch(tree)
      }
    },
    formMatch(list) {
      const arr = [
        {
          name: '无',
          id: 0
        }
      ]
      const result = arr.concat(list)
      return result
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].deptList.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].deptList = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].deptList)
        }
      }
      return data
    }
  }
}
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
}
</style>
