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
      >
        <span slot-scope="{ node, data }" class="dept_dept_tree_item">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">编辑</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="dept_user">
      <div class="dept_user_label">
        <span class="label">用户列表</span>
        <i class="el-icon-circle-plus-outline" @click="addDept" />
      </div>
    </div>
    <el-dialog
      width="800px"
      :modal-append-to-body="false"
      title="添加部门"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item label="上级部门" :label-width="formLabelWidth">
          <el-cascader
            v-model="value"
            :clearable="true"
            :options="deptList"
            :props="cascaderProps"
            placeholder="请选择上级部门"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" :clearable="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="顺序" :label-width="formLabelWidth">
          <el-input v-model="form.seq" :clearable="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" :clearable="true" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deptTree, deptAdd } from '@/api/index.js'
export default {
  name: 'Dept',
  data() {
    return {
      deptList: [],
      value: [],
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                },
                {
                  value: 'loading',
                  label: 'Loading 加载'
                },
                {
                  value: 'message',
                  label: 'Message 消息提示'
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                },
                {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框'
                },
                {
                  value: 'card',
                  label: 'Card 卡片'
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ],
      tree: [],
      defaultProps: {
        children: 'deptList',
        label: 'name'
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        parentId: 0,
        name: '',
        seq: '',
        remark: ''
      },
      formLabelWidth: '120px',
      cascaderProps: {
        value: 'id',
        expandTrigger: 'hover',
        children: 'deptList',
        label: 'name'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async sure() {
      const len = this.value.length - 1
      console.log(this.value)
      this.form.parentId = this.value[len]
      console.log(this.form)
      const res = await deptAdd(this.form)
      if (res && res.data.code === 0) {
        alert('kkk')
      }
    },
    handleChange(value) {},
    addDept() {
      this.dialogFormVisible = true
    },
    del(item) {},
    edit(item) {
      debugger
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
        // this.deptList.unshift({name:"无",parentId:0})
        // console.log(this.deptList);
      }
    },
    formMatch(list) {
      const arr = [{ name: '无', parentId: 0 }]
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
}
</style>
