<template>
  <v-sheet
    max-height="35"
    class="slide-container code"
  >
    <v-slide-group
      mandatory
      @change="showLanguage"
    >
      <v-slide-item
        v-for="(item, i) in items"
        :key="i"
        v-slot:default="{ active, toggle }"
      >
        <v-btn
          max-height="25"
          active-class="slide-button-active"
          class="mx-2"
          :input-value="active"
          depressed
          text
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
  name: 'slideGroupCode',
  props: ['items'],
  methods: {
    ...mapMutations([
      'setCurrentLanguage'
    ]),
    showLanguage (i) {
      this.setCurrentLanguage(this.items[i].name)
    }
  }
}
</script>
