<template>
  <v-text-field
  solo
  dense
  clearable
  :hide-details="!message"
  append-icon="mdi-magnify"
  :placeholder=placeholder
  :disabled=disabled
  :messages="message"
  @change="onChange"
  ></v-text-field>
</template>

<script>
export default {
  name: 'searchInput',
  props: ['disabled', 'placeholder'],
  computed: {
    message () {
      return this.disabled ? 'Reset to change' : null
    }
  },
  methods: {
    onChange (value) {
      this.$emit('changed', value)
    }
  }
}
</script>
