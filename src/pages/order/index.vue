<template>
  <div class="entryIndex">
    <input type="text"
           class="textInput"
           v-model="msg">
    <p>{{ msg }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'order'
    }
  }
}
</script>

<style lang="less" scoped>
.entryIndex {
  .textInput {
    border: 1px solid lightgray;
  }
}
</style>
