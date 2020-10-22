<template>
  <v-container class="algorithm linear-search">
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
          <v-col cols="2">
            <SearchInput placeholder="value" />
          </v-col>
          <v-col align="right">
            <v-btn
              light
              @click="reset()"
              class="btn-reset"
            >Reset</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-for="(value, index) in numItems" :key="index" align="center">
        <v-card
          light
          class="item py-2"
          :ripple="index >= i"
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

    <v-row class="mt-4 mb-2">
      <v-col align="center">
        <transition name="fade">
          <div v-show="showCurrentStep" class="current-step">
            <div class="main">{{ this.guide.steps[this.currentStep-1].main }}</div>
            <v-row
              v-if="!hasChosen"
              class="choices mt-2"
              justify="center"
            >
              <v-col cols="2" v-for="(choice, i) in this.guide.steps[this.currentStep-1].choices" :key="i">
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

  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SlideGroupCode from '@/components/SlideGroupCode'
import SearchInput from '@/components/SearchInput'

export default {
  name: 'algorithms',
  components: {
    SearchInput,
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
          { step: 0, line: '  {' },
          { step: 0, line: '      return 1;' },
          { step: 0, line: '    }' },
          { step: 0, line: '  }' },
          { step: 0, line: '  return 0;' },
          { step: 0, line: '}' }
        ],
        python: [
          { step: 0, line: 'def linear_search(items, value):' },
          { step: 1, line: '    for i in items:' },
          { step: 2, line: '        if i == value:' },
          { step: 0, line: '            return True' },
          { step: 0, line: '    return False' }
        ]
      },
      currentStep: 1,
      hasChosen: true,
      i: 0,
      items: [1, 2, 3, 4, 5, 6, 7, 8],
      numItems: 8,
      guide: {
        init: 'Start at the beginning.',
        steps: [
          {
            main: 'Look at the next element.'
          },
          {
            main: 'Is this the value you are looking for?',
            choices: [
              'Yes',
              'No'
            ]
          }
        ]
      },
      showCurrentStep: true
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
      return classes
    },
    incrementStep () {
      this.currentStep = this.currentStep + 1 <= this.guide.steps.length ? this.currentStep + 1 : 1
    },
    makeChoice (choice) {
      // TODO: if choice is true, or choice is false with no more items to look at, signal the end of the algorithm

      this.hasChosen = true
      this.incrementStep()
    },
    makeSubstitutions (line) {
      /* Replace placeholders in code with user input values. */
      return line
        .replace('SIZE', this.numItems)
    },
    reset () {
      this.currentStep = 1
    },
    revealItem (i) {
      // only reveal the next item if there is no pending choice to be made
      // and the selected item is the next one in the algorithm's steps
      if (this.hasChosen && i === this.i) {
        this.i++
        // currentStep should always be at least 1
        this.incrementStep()

        // if a choice will need to be made for the new current step, toggle it now
        if (Object.prototype.hasOwnProperty.call(this.guide.steps[this.currentStep - 1], 'choices')) {
          this.hasChosen = false
        }
      }
    }
  },
  created () {
    if (!this.currentLanguage) {
      this.setCurrentLanguage(Object.keys(this.code)[0])
    }
  }
}
</script>
