<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Binary Search</h2>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col><h1>Binary Search</h1></v-col>
      <v-spacer></v-spacer>
      <v-col align="right">
        <v-btn
          light
          :color="guideBtnColor"
          @click="toggleGuide"
        >
          Turn {{ guide ? "off" : "on" }} guide
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <template v-if="items.length">
        <v-col v-for="(item, i) in items" :key="i" align="center">
          <v-card
            light
            class="g-block py-2"
            :color="getCardColor(item)"
            @click="cardAction(i)"
            :disabled="isFound"
          >
            {{ item }}
          </v-card>
        </v-col>
      </template>
      <template v-else>
        <v-col align="center">
          <v-icon size="100">mdi-emoticon-frown-outline</v-icon>
        </v-col>
      </template>
    </v-row>

    <v-row>
      <v-col v-for="(item, i) in items" :key="i" align="center" class="item-index py-0">
        {{ i }}
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h3>Searching for {{ searchValue }}</h3>
      </v-col>
    </v-row>

    <v-row v-show="guide" class="mt-8">
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
    </v-row>

    <v-row>
      <v-col>
        <v-btn
          light
          color="orange"
          @click="reset()"
        >Reset</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: 'algorithms',
  data () {
    return {
      currentStep: 1,
      found: null,
      guide: true,
      halves: [],
      isFound: false,
      items: [2, 5, 7, 8, 11, 15, 22, 30, 31],
      midItem: null,
      searchValue: 9, // TODO: make this dynamic -- either randomly pulled from the list of items, or as input from the user
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
  computed: {
    guideBtnColor () {
      return this.guide ? 'grey' : 'orange'
    },
    numCardCols () {
      return 2
    }
  },
  methods: {
    cardAction (i) {
      switch (this.currentStep) {
        case 1:
          // see if the clicked item is the middle index
          if (this.isMiddle(i, this.items)) {
            this.midItem = this.items[i]
            // see if the clicked item is the item being searched for
            if (this.isMatch(i, this.items)) {
              // found the item!
              this.found = this.midItem
              this.isFound = true
              this.currentStep++
              break
            } else {
              // this is not the item being searched for
              if (this.items.length === 1) {
                // the last lone item was clicked
                this.items = []
                this.currentStep = 1
                break
              } else {
                // split the items into halves based on the middle index
                this.halves[0] = this.items.slice(0, i)
                this.halves[1] = this.items.slice(i + 1, this.items.length)
              }
            }
            this.currentStep++
          }
          break
        case 2:
          // see if both the clicked item and the item being searched for are on
          // the same side of the previously clicked middle item
          var correctHalf = null
          if (this.items[i] < this.midItem && this.searchValue < this.midItem) {
            correctHalf = this.halves[0]
          } else if (this.items[i] > this.midItem && this.searchValue > this.midItem) {
            correctHalf = this.halves[1]
          }

          if (correctHalf) {
            // reset items to this half and start back at step 1!
            this.items = correctHalf
            this.halves = []
            this.currentStep = 1
            // exit the case
            break
          }

          // the clicked item is not in the same half as the item being searched for
          // TODO: provide feedback to the user that their choice was incorrect
          break
        case 50:
          // TODO: replace empty items array with a frowny face icon
          //       - could also state "Thank you {username}! but our item is in another array!" (Mario reference)
      }
    },
    getCardColor (i) {
      if (i === this.found) {
        // the searched for item that was found
        return 'green'
      } else if (this.isItemInHalf(i)) {
        // an item in one of the divided up halves
        return 'purple'
      }

      // nothing special about this card
      return ''
    },
    getHighlightClasses (i) {
      const classes = []

      if (this.currentStep === i + 1) {
        classes.push('highlight')

        if (this.isFound) {
          classes.push('highlight-found')
        } else if (!this.items.length) {
          classes.push('highlight-not-found')
        }
      }

      return classes
    },
    isItemInHalf (i) {
      return (this.halves.length && (this.halves[0].includes(i) || this.halves[1].includes(i)))
    },
    isMatch (i, items) {
      return items[i] === this.searchValue
    },
    isMiddle (i, items) {
      return i === Math.floor(items.length / 2)
    },
    reset () {
      this.currentStep = 1
      this.found = null
      this.halves = []
      this.isFound = false
      this.items = [2, 5, 7, 8, 11, 15, 22, 30, 31]
      this.midItem = null
    },
    toggleGuide () {
      this.guide = !this.guide
    }
  }
}
</script>

<style lang="sass" scoped>
h1
  color: gold
.item-index
  color: darken(white, 25%)
.g-block
  font-size: 36pt
.highlight
  padding: 3px
  color: black
  background-color: orange
.highlight-found
  background-color: green
.highlight-not-found
  background-color: red
</style>
