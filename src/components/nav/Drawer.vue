<template>
  <v-navigation-drawer
    :mini-variant.sync="isMini"
    app
    permanent
    :expand-on-hover="isMini"
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="@/assets/logo.png" width="40"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>
        <h4>Dev Underground</h4>
      </v-list-item-title>

      <v-btn
        icon
        @click.stop="isNavPinned = !isNavPinned"
      >
        <v-icon v-if="isNavPinned">mdi-pin-off-outline</v-icon>
        <v-icon v-else>mdi-pin-outline</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.route"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <p>{{ item.title }}</p>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      items: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard-outline',
          route: { name: 'dashboard' }
        },
        { title: 'Daily Study', icon: 'mdi-alpha-c-box-outline' },
        { title: 'Leaderboard', icon: 'mdi-account-group-outline' },
        { title: 'Forum', icon: 'mdi-forum-outline' }
      ]
    }
  },
  computed: {
    ...mapState([
      'navPinned'
    ]),
    isMini () {
      return !this.navPinned
    },
    isNavPinned: {
      get () {
        return this.navPinned
      },
      set (value) {
        this.setNavPinned(value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'setNavPinned'
    ])
  }
}
</script>
