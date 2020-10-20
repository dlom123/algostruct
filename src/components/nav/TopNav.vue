<template>
  <v-app-bar
    app
    dark
  >
    <div class="d-flex align-center">
      <v-img
        class="mr-2"
        src="@/assets/logo.png"
        width="40"
      />
      <h1>AlgoStruct</h1>
    </div>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn exact :to="{ name: 'algorithms' }" text>
        Algorithms
      </v-btn>

      <v-btn exact :to="{ name: 'dataStructures' }" text>
        Data Structures
      </v-btn>
    </v-toolbar-items>

  </v-app-bar>
</template>

<script>
export default {
}
</script>
