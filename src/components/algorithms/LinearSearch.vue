<template>
  <v-container class="algorithm">
    <v-row>
      <v-col>
        <h2>Linear Search</h2>
      </v-col>
    </v-row>

    <v-row align="center">
      <!-- <v-col align="right">
        <v-btn
          light
          :color="guideBtnColor"
          @click="toggleGuide"
        >
          Turn {{ guide ? "off" : "on" }} guide
        </v-btn>
      </v-col> -->
    </v-row>

    <v-row class="mt-4">
      <v-col v-for="(value, index) in numItems" :key="index" align="center">
        <v-card
          light
          class="item py-2"
          @click="revealItem(index)"
        >
          <v-icon
            x-large
            v-if="index >= i"
          >mdi-help</v-icon>
          <template v-else>{{ items[index] }}</template>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(item, index) in items" :key="index" align="center" class="item-index py-0">
        {{ index }}
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col>
        <h3>Searching for {{ searchValue }}</h3>
      </v-col>
    </v-row> -->

    <!-- <v-row v-show="guide" class="mt-8">
      <v-col cols="7" style="border: 1px solid #ccc">
        <h3>Steps</h3>
        <ol>
          <li
            v-for="(step, i) in steps"
            :key="i"
          >
            <span :class="getHighlightClasses(i)">{{ step.main }}</span>
            <ul v-if="step.hasOwnProperty('subs')">
              <li v-for="(sub, i) in step.subs" :key="i">{{ sub }}</li>
            </ul>
          </li>
        </ol>
      </v-col>
    </v-row> -->

    <!-- <v-row>
      <v-col>
        <v-btn
          light
          color="orange"
          @click="reset()"
        >Reset</v-btn>
      </v-col>
    </v-row> -->

  </v-container>
</template>

<script>
export default {
  name: 'algorithms',
  data () {
    return {
      i: 0,
      items: [1, 2, 3, 4, 5, 6, 7, 8],
      numItems: 8,
      steps: [
        {
          main: 'If the array is empty, the item you are searching for was not found. Otherwise, check the middle item.'
        },
        {
          main: 'If it is the item you are looking for, you have found it!',
          subs: [
            'If it is smaller than the item you are looking for, use the items to the right of it and go back to step 1.',
            'If it is larger than the item you are looking for, use the items to the left of it and go back to step 1.'
          ]
        }
      ]
    }
  },
  methods: {
    revealItem (i) {
      if (i === this.i) {
        this.i++
      }
    }
  }
}
</script>
