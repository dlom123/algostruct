<template>
  <div>
    <TopNav />
    <!-- <Drawer /> -->
    <slot />
  </div>
</template>

<script>
// import Drawer from '@/components/nav/Drawer.vue'
import TopNav from '@/components/nav/TopNav.vue'

export default {
  components: {
    // Drawer,
    TopNav
  }
}
</script>
