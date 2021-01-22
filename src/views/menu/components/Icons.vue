<template>
  <div class="icons">
    <el-dialog
      :visible.sync="isShow"
      :show-close="false"
      :modal="false"
      width="50%"
    >
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="base" name="base">
          <div class="icons_box">
            <div
              v-for="(item,index) in baseIcons"
              :key="index"
              class="icons_box_item"
              :class="{isChoosed:currentIndex === index}"
              @click="choose(index)"
            >
              <svg-icon :icon-class="item" class-name="disabled" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="brand" name="brand">
          <div
            v-for="(item,index) in brandIcons"
            :key="index"
            class="icons_box_item"
            :class="{isChoosed:currentIndex === index}"
            @click="choose(index)"
          >
            <svg-icon :icon-class="item" class-name="disabled" />
          </div>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { baseIcons, brandIcons } from './svg-icons.js';
export default {
  name: 'Icons',
  props: {
    isShow: {
      type: Boolean
    }
  },
  data() {
    return {
      currentIndex: null,
      activeName: 'base',
      baseIcons,
      brandIcons
    };
  },
  mounted() {
  },
  methods: {
    tabChange() {
      this.currentIndex = null;
    },
    choose(index) {
      this.currentIndex = index;
    },
    cancel() {
      this.$emit('update:isShow', false);
    },
    sure() {
      const iconName = this.getIconName();
      this.$emit('sure', iconName);
    },
    getIconName() {
      const condition = {
        base: this.baseIcons,
        brand: this.brandIcons
      };
      return condition[this.activeName][this.currentIndex];
    }
  }
};
</script>
<style lang="scss">
.icons{
  &_box{
    overflow: hidden;
    &_item{
      cursor:pointer;
      float:left;
      width:40px;
      height:40px;
      line-height: 40px;
      text-align: center;
      border:1px solid #f1f1f1;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
  .el-dialog__header{
    display: none;
  }
  .isChoosed{
    background: #eee;
  }
}
</style>
