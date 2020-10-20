<template>
  <v-app>
    <component :is="'HomeWrapper'">
      <v-main>
        <router-view />
      </v-main>
    </component>
  </v-app>
</template>

<script>
import HomeWrapper from '@/layouts/HomeWrapper.vue'

export default {
  name: 'App',
  components: {
    HomeWrapper
  }
}
</script>
