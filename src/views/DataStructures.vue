<template>
  <v-container class="data-structures">
    <v-row align="center">
      <v-col><h1>Data Structures</h1></v-col>
      <v-spacer></v-spacer>
      <v-col align="right">
        <SlideGroup :items="dataStructures" />
      </v-col>
    </v-row>

    <v-row>
      <component :is="currentContent" />
    </v-row>

  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SlideGroup from '@/components/SlideGroup.vue'
import Arrays from '@/components/dataStructures/Arrays.vue'
import Stacks from '@/components/dataStructures/Stacks.vue'
import Queues from '@/components/dataStructures/Queues.vue'
import LinkedLists from '@/components/dataStructures/LinkedLists.vue'
import HashTables from '@/components/dataStructures/HashTables.vue'
import BinarySearchTrees from '@/components/dataStructures/BinarySearchTrees.vue'
import Tries from '@/components/dataStructures/Tries.vue'

export default {
  name: 'dataStructures',
  components: {
    Arrays,
    BinarySearchTrees,
    HashTables,
    LinkedLists,
    Queues,
    Stacks,
    Tries,
    SlideGroup
  },
  data () {
    return {
      dataStructures: [
        { name: 'arrays', text: 'Arrays' },
        { name: 'stacks', text: 'Stacks' },
        { name: 'queues', text: 'Queues' },
        { name: 'linkedLists', text: 'Linked Lists' },
        { name: 'hashTables', text: 'Hash Tables' },
        { name: 'binarySearchTrees', text: 'Binary Search Trees' },
        { name: 'tries', text: 'Tries' }
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
    this.setCurrentContent(this.dataStructures[0].name)
  }
}
</script>
