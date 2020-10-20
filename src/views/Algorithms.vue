<template>
  <v-container class="algorithms">
    <v-row align="center">
      <v-col><h1>Algorithms</h1></v-col>
      <v-spacer></v-spacer>
      <v-col align="right">
        <SlideGroup :items="algorithms" />
      </v-col>
    </v-row>

    <v-row>
      <component :is="currentContent" />
    </v-row>

  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SlideGroup from '@/components/SlideGroup'
import BinarySearch from '@/components/algorithms/BinarySearch'
import LinearSearch from '@/components/algorithms/LinearSearch'

export default {
  name: 'algorithms',
  components: {
    BinarySearch,
    LinearSearch,
    SlideGroup
  },
  data () {
    return {
      algorithms: [
        { name: 'linearSearch', text: 'Linear Search' },
        { name: 'binarySearch', text: 'Binary Search' }
      ]
    }
  },
  computed: {
    ...mapState([
      'currentContent'
    ])
  },
  methods: {
    ...mapMutations([
      'setCurrentContent'
    ])
  },
  created () {
    this.setCurrentContent(this.algorithms[0].name)
  }
}
</script>
