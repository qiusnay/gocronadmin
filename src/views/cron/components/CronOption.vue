<template>
  <div style="display:inline-block;">
    <el-select v-model="value" @change="onCChange">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: []
    },
    onChildChange: {
      type: Function
    },
    initselect : {
      type : String
    }
  },
  data() {
    return {
      value: '请选择'
    }
  },
  created() {
    this.value = this.initselect
  },
  methods: {
    onCChange(e){
      this.onChildChange({
        value: this.value
      })
    }
  }
}
</script>