<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height>
      <!-- LEFT COLUMN -->
      <div style="width:20vw"></div>
      <!-- CENTER COLUMN -->
      <v-layout xs4 column wrap class="full-height-flex-column">
        <v-flex style="flex:1"></v-flex>
        <v-flex style="flex:1; style:padding:5px; text-align:center">
          <H1>Generating</H1>
        </v-flex>
        <v-flex style="flex:2; style:padding:5px; text-align:center">
          <div></div>
        </v-flex>
        <v-flex style="flex:1"></v-flex>
      </v-layout>

      <!-- RIGHT COLUMN -->
      <div style="width:20vw"></div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Generate',
  data: function() {
    return {};
  },
  components: {},
  computed: {},
  beforeCreate() {},
  created() {
    setTimeout(
      function() {
        this.$router.push('CreateCharacter');
      }.bind(this),
      1000
    );
  },
  methods: {},
};
</script>

<style scoped></style>
