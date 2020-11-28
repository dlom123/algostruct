<template>
  <v-container class="algorithm linear-search">
    <v-row>
      <v-col>
        <h2>Linear Search</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p>Linear search involves looking at each element, one at a time, from the first element through the last one.
           If the value being searched for is found at any point, return true and stop looking.
           If all elements have been looked at and the value was not found, return false.</p>
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
            'item-selected': index === i && !hasChosen,
            'item-not': index < i,
            'item-found': index === i && found
            }
          ]"
          :ripple="index >= i"
          @click="revealItem(index)"
        >
          <template
            v-if="index < i
              || (index === i && hasChoices && !hasChosen)
              || (index === i && isDone)"
          >{{ items[index] }}</template>
          <v-icon
            x-large
            v-else
          >mdi-help</v-icon>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(item, index) in items" :key="index" align="center" class="item-index py-0">
        <code v-if="index === i">{{ index }}</code>
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
                  :class="{'btn-yes': i % 2 === 0, 'btn-no': i % 2}"
                  @click="makeChoice(i % 2 === 0 ? true : false)"
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
          { step: 0, line: 'int linearSearch(int items[SIZE], int value)' },
          { step: 0, line: '{' },
          { step: 1, line: '  for (int i = 0; i < SIZE; i++)' },
          { step: 0, line: '  {' },
          { step: 2, line: '    if (items[i] == value)' },
          { step: 0, line: '    {' },
          { step: -1, line: '      return 1;' },
          { step: 0, line: '    }' },
          { step: 0, line: '  }' },
          { step: -2, line: '  return 0;' },
          { step: 0, line: '}' }
        ],
        python: [
          { step: 0, line: 'def linear_search(items, value):' },
          { step: 1, line: '    for item in items:' },
          { step: 2, line: '        if item == value:' },
          { step: -1, line: '            return True' },
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
        init: 'Starting with the first element, repeat until the value is found or there are no more elements to look at.',
        steps: [
          {
            main: 'Look at the next element.',
            help: 'Click the box of the next hidden element.'
          },
          {
            main: 'Is this the value you are looking for?',
            help: 'Does the value in the box match the value you are trying to find?',
            choices: [
              'Yes',
              'No'
            ]
          }
        ]
      },
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
      if (choice) {
        if (this.items[this.i] === this.searchValue) {
          // found the value we were looking for
          this.found = true
          this.isDone = true
        } else {
          // false positive
          this.showSnackbar('Value does not match. Try again.')
          return
        }
      } else {
        if (this.items[this.i] === this.searchValue) {
          // false negative
          this.showSnackbar('Are you sure about that?. Try again.')
          return
        } else {
          // this is not the value we were looking for
          this.i++
          if (this.i === this.items.length) {
            this.isDone = true
          }
        }
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
      if (this.i === 0 && this.currentStep === 1) {
        const max = this.numItems * 2
        // populate the items array
        this.items = Array.from(Array(this.numItems)).map(x => Math.floor(Math.random() * Math.floor(max)) + 1)
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
      this.i = 0
      this.isDone = false
    },
    revealItem (i) {
      // only reveal the next item if:
      //   - there is no pending choice to be made
      //   - and the selected item is the next one in the algorithm's steps
      if (!this.isDone && i === this.i) {
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
    this.randomize()
  }
}
</script>
