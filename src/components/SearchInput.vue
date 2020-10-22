<template>
  <v-text-field
  solo
  dense
  hide-details
  clearable
  append-icon="mdi-magnify"
  :placeholder=placeholder
  class="search-input"
  ></v-text-field>
</template>

<script>
export default {
  name: 'searchInput',
  props: ['placeholder']
}
</script>
