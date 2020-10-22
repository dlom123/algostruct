<template>
  <v-sheet
      max-width="700"
      class="slide-container main"
    >
    <v-slide-group
        mandatory
        show-arrows
        center-active
        @change="showContent"
      >
        <v-slide-item
          v-for="(item, i) in items"
          :key="i"
          v-slot:default="{ active, toggle }"
        >
          <v-btn
            class="mx-2"
            :input-value="active"
            active-class="slide-button-active"
            depressed
            @click="toggle"
          >
            {{ item.text }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>
  </v-sheet>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'slideGroupMain',
  props: ['items'],
  methods: {
    ...mapMutations([
      'setCurrentContent'
    ]),
    showContent (i) {
      this.setCurrentContent(this.items[i].name)
    }
  }
}
</script>
