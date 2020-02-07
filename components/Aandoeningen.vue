<template>
  <div>
    <v-checkbox
      v-model="aandoeningen.astma"
      label="astma"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.bedwateren"
      label="bedwateren"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.epilepsie"
      label="epilepsie"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.hartkwaal"
      label="hartkwaal"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.hooikoorts"
      label="hooikoorts"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.huidaandoening"
      label="huidaandoening"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.reuma"
      label="reuma"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.slaapwandelen"
      label="slaapwandelen"
      hide-details
    ></v-checkbox>
    <v-checkbox
      v-model="aandoeningen.suikerziekte"
      label="suikerziekte"
      hide-details
    ></v-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    lidAandoeningen: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    aandoeningen() {
      return this.lidAandoeningen
    }
  }
}
</script>

<style></style>
