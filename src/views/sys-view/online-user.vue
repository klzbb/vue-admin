<template>
  <div class="online_user">
    <div class="left">
      <div class="item">left</div>
    </div>
    <div class="right">
      <div class="item">right</div>
      <div class="item">right</div>
      <div class="item">right</div>
      <div class="item">right</div>
    </div>
  </div>
</template>
<style lang="scss">
.online_user{
  display:flex;
  width: 400px;
  border:1px solid #000;
  .left{
    display:flex;
    flex-direction: column;
    .item{
      flex:1;
      border: 1px solid #000;
    }
  }
  .right{
    display:flex;
    flex-direction: column;
    .item{
      flex:1;
      border: 1px solid #000;
    }
  }
}
</style>

