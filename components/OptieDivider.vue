<template>
  <div class="background">
    <v-icon color="primary" class="icon">{{ icon }}</v-icon>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.background {
  display: flex;
  align-items: center;
  background-color: rgba(100, 100, 100, 0.1);
  height: 46px;
  width: 100%;
}
.icon {
  margin-left: 28px;
}
span {
  margin-left: 8px;
}
</style>
