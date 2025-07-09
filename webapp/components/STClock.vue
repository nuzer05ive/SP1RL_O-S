<template>
  <span>{{ time }}</span>
</template>
<script>
export default {
  data() {
    return { time: new Date().toLocaleTimeString() }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.time = new Date().toLocaleTimeString()
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
