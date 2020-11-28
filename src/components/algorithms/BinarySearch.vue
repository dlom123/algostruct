<template>
  <v-container class="algorithm linear-search">
    <v-row>
      <v-col>
        <h2>Binary Search</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p>Binary search requires that elements are already in sorted order. It involves looking at
           the element in the middle position and, if it is the value being searched for, returns true.
           Otherwise, if the element in the middle position is smaller than the value being searched for,
           it and all elements before it (smaller than) are eliminated and the process repeats with the
           other half of the elements (larger than), and likewise if the element in the middle position
           is larger than the value being searched for.
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-row align="center">
          <v-col cols="3">
            <h2>Interactive Example
              <v-tooltip right content-class="tooltip-instructions">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="help-circle" v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
                </template>
                <span>Click the boxes according to<br/>the steps outlined below.</span>
              </v-tooltip>
            </h2>
          </v-col>
          <v-col cols="3">
            <h2>Find the value <code style="font-size: 22pt;">{{searchValue}}</code></h2>
          </v-col>
          <v-col>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn
                  light
                  @click="randomize()"
                  class="btn-randomize"
                >Randomize</v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  light
                  @click="reset()"
                  class="btn-reset"
                >Reset</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-for="(value, index) in items.length" :key="index" align="center">
        <v-card
          light
          :class="['item py-2', {
            'item-selected': index === midIndex && !hasChosen,
            'item-not': index < low || index > high,
            'item-found': index === midIndex && found
            }
          ]"
          :ripple="index >= i"
          @click="revealItem(index)"
        >
          <template
            v-if="(index < low || index > high)
              || (index === midIndex && hasChoices && !hasChosen)
              || (index === midIndex && isDone)"
          >{{ items[index] }}</template>
          <v-icon
            v-else
            x-large
          >mdi-help</v-icon>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(item, index) in items" :key="index" align="center" class="item-index py-0">
        <code v-if="index === midIndex">{{ index }}</code>
        <span v-else>{{ index }}</span>
      </v-col>
    </v-row>

    <v-row class="mt-4 mb-2 container-current-step" align="center">
      <v-col align="center">
        <transition name="fade">
          <div :class="['current-step', {'found': isDone && found, 'not-found': isDone && !found}]">
            <div v-if="!isDone" class="main">{{ guide.steps[this.currentStep-1].main }}
              <template v-if="guide.steps[this.currentStep-1].help">
                <v-tooltip right content-class="tooltip-instructions">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small class="help-circle" v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
                  </template>
                  <span>{{guide.steps[this.currentStep-1].help}}</span>
                </v-tooltip>
              </template>
            </div>
            <div v-else class="main">
              <template v-if="found">
                <span>{{messageFound}}</span>
              </template>
              <template v-else>
                <span>{{messageNotFound}}</span>
              </template>
            </div>
            <v-row
              v-if="!hasChosen"
              class="choices mt-2"
              justify="center"
            >
              <v-col cols="2" v-for="(choice, i) in guide.steps[this.currentStep-1].choices" :key="i">
                <v-btn
                  x-large
                  :class="{'btn-no': i % 2 === 0, 'btn-yes': i % 2}"
                  @click="makeChoice(i)"
                >
                  {{ choice }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </transition>
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="6">
        <v-card class="pb-3 card-steps">
          <v-card-title class="headline pb-0">Steps</v-card-title>
          <v-spacer></v-spacer>
          <v-list-item v-if="guide.hasOwnProperty('init')">{{ guide.init }}</v-list-item>
          <v-list-item v-for="(step, i) in guide.steps" :key="i" :class="highlightStep(i+1)">
            <v-list-item-content class="py-0">
              <v-row>
                <v-col cols="1">{{ i+1 }}</v-col>
                <v-col cols="11">{{ step.main }}</v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="px-1 pb-3 card-code">
          <v-card-title class="headline pb-0">
            <v-col>
              <h2>Code</h2>
            </v-col>
            <v-col cols="auto" align="right" class="py-0">
              <SlideGroupCode :items="languages" />
            </v-col>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="1" class="line-numbers mt-0 pr-2" align="right">
                <div v-for="i in currentLanguageCode.length" :key="i">{{ i }}:</div>
              </v-col>
              <v-col cols="auto" class="code px-0">
                <div v-for="(code, i) in currentLanguageCode" :key="i" :class="highlightStep(code.step)">
                  <pre>{{ code.line }}</pre>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :timeout="snackbarTimeout"
      top
      class="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>

  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SlideGroupCode from '@/components/SlideGroupCode'

export default {
  name: 'algorithms',
  components: {
    SlideGroupCode
  },
  data () {
    return {
      code: {
        c: [
          { step: 0, line: 'int binarySearch(int items[SIZE], int value)' },
          { step: 0, line: '{' },
          { step: 0, line: '  int low = 0, high = SIZE - 1;' },
          { step: 1, line: '  while (low <= high)' },
          { step: 0, line: '  {' },
          { step: 0, line: '    int mid = (low + high) / 2;' },
          { step: 2, line: '    if (items[mid] == value)' },
          { step: 0, line: '    {' },
          { step: -1, line: '      return 1;' },
          { step: 0, line: '    }' },
          { step: 2, line: '    else if (items[mid] < value)' },
          { step: 0, line: '    {' },
          { step: 0, line: '      low = mid + 1;' },
          { step: 0, line: '    }' },
          { step: 2, line: '    else' },
          { step: 0, line: '    {' },
          { step: 0, line: '      high = mid - 1;' },
          { step: 0, line: '    }' },
          { step: 0, line: '  }' },
          { step: -2, line: '  return 0;' },
          { step: 0, line: '}' }
        ],
        python: [
          { step: 0, line: 'def binary_search(items, value):' },
          { step: 0, line: '    low = 0' },
          { step: 0, line: '    high = len(items) - 1' },
          { step: 1, line: '    while low <= high:' },
          { step: 0, line: '        mid = (low + high) // 2' },
          { step: 2, line: '        if items[mid] == value:' },
          { step: -1, line: '            return True' },
          { step: 2, line: '        elif items[mid] < value:' },
          { step: 0, line: '            low = mid + 1' },
          { step: 2, line: '        else:' },
          { step: 0, line: '            high = mid - 1' },
          { step: -2, line: '    return False' }
        ]
      },
      currentStep: 1,
      hasChosen: true,
      i: 0,
      isDone: false,
      items: [],
      found: false,
      guide: {
        init: 'Repeat until the value is found or there are no more elements to look at.',
        steps: [
          {
            main: 'Look at the middle element.',
            help: 'Click the box of the middle hidden element.'
          },
          {
            main: 'How does this value compare to the search value?',
            help: 'Is this value less than, equal to, or greater than the value you are trying to find?',
            choices: [
              'Less than',
              'Equal',
              'Greater than'
            ]
          }
        ]
      },
      high: 0,
      low: 0,
      messageFound: 'Found the value!',
      messageNotFound: 'Value not found.',
      numItems: 8,
      searchValue: null,
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: 3000
    }
  },
  computed: {
    ...mapState([
      'currentLanguage',
      'languages'
    ]),
    currentLanguageCode () {
      const code = this.code[this.currentLanguage]
      const lines = code.map(c => ({
        step: c.step,
        // preserve empty lines from the code array in the <pre> tags
        // and replace any predefined placeholders in the code
        line: !c.line.length ? '\n' : this.makeSubstitutions(c.line)
      }))
      return lines
    },
    hasChoices () {
      if (this.currentStep <= this.guide.steps.length) {
        return Object.prototype.hasOwnProperty.call(this.guide.steps[this.currentStep - 1], 'choices')
      }
      return false
    },
    midIndex () {
      return Math.floor((this.low + this.high) / 2)
    }
  },
  methods: {
    ...mapMutations([
      'setCurrentLanguage'
    ]),
    highlightStep (i) {
      const classes = []
      if (this.currentStep === i) {
        classes.push('highlight')
      }
      if (this.isDone) {
        if (this.found && i === -1) {
          classes.push('highlight-found')
        } else if (!this.found && i === -2) {
          classes.push('highlight-not-found')
        }
      }
      return classes
    },
    incrementStep () {
      if (this.isDone) {
        this.currentStep += 1
      } else {
        this.currentStep = this.currentStep + 1 <= this.guide.steps.length ? this.currentStep + 1 : 1
      }
    },
    makeChoice (choice) {
      if (choice === 0) {
        // user chose that the revealed value is less than the search value
        if (this.items[this.midIndex] < this.searchValue) {
          this.low = this.midIndex + 1
          this.midItem = (this.low + this.high) / 2
        } else {
          this.showSnackbar('Are you sure about that? Try again.')
          return
        }
      } else if (choice === 1) {
        // user chose that the revealed value is equal to the search value
        if (this.items[this.midIndex] === this.searchValue) {
          this.found = true
          this.isDone = true
        } else {
          this.showSnackbar('Value does not match. Try again.')
          return
        }
      } else if (choice === 2) {
        // user chose that the revealed value is greater than the search value
        if (this.items[this.midIndex] > this.searchValue) {
          this.high = this.midIndex - 1
          this.midItem = (this.low + this.high) / 2
        } else {
          this.showSnackbar('Are you sure about that? Try again.')
          return
        }
      }

      if (this.low > this.high) {
        this.isDone = true
      }

      this.hasChosen = true
      this.incrementStep()
    },
    makeSubstitutions (line) {
      /* Replace placeholders in code with user input values. */
      return line
        .replace('SIZE', this.items.length)
    },
    randomize () {
      if (this.currentStep === 1 && this.low === 0 && this.high === this.numItems - 1) {
        const max = this.numItems * 2
        // populate the items array
        this.items = Array.from(Array(this.numItems)).map(x => Math.floor(Math.random() * Math.floor(max)) + 1)
        this.items = this.items.sort((a, b) => a - b)
        // generate the search value
        this.searchValue = Math.floor(Math.random() * Math.floor(max)) + 1
      } else {
        this.showSnackbar('Cannot randomize mid-search. Reset and try again.')
      }
    },
    reset () {
      this.currentStep = 1
      this.found = false
      this.hasChosen = true
      this.high = this.numItems - 1
      this.i = 0
      this.isDone = false
      this.low = 0
    },
    revealItem (i) {
      // only reveal the next item if:
      //   - there is no pending choice to be made
      //   - and the selected item is the next one in the algorithm's steps
      if (!this.isDone && i === this.midIndex) {
        if (!this.hasChoices || (this.hasChoices && this.hasChosen)) {
          this.incrementStep()
        } else {
          this.hasChosen = false
        }

        // if a choice needs to be made for the next step, indicate that now
        if (this.hasChoices) {
          this.hasChosen = false
        }
      }
    },
    showSnackbar (message) {
      this.snackbarText = message
      this.snackbar = true
    }
  },
  created () {
    if (!this.currentLanguage) {
      this.setCurrentLanguage(Object.keys(this.code)[0])
    }
    this.reset()
    this.randomize()
  }
}
</script>
