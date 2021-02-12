<template>
  <v-card class="card">
    <div class="console">
      <ul v-on:click="focusCommandLine" id="console_history" class="history">
        <li v-for="line in composedHistory" v-bind:key="line">{{ line }}</li>
      </ul>
      <v-text-field
        ref="commandline"
        class="commandline"
        type="text"
        placeholder="&gt;"
        v-model="commandText"
        @keydown.enter="CommandLineEnter"
      />
    </div>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Console',
  data: function() {
    return {
      maxHistoryLength: 10,
      commandText: '',
      history: [],
    };
  },
  methods: {
    focusCommandLine() {
      this.$refs.commandline.focus();
    },
    CommandLineEnter(key) {
      if (key.code == 'Enter') {
        if (this.history.length >= this.maxHistoryLength)
          this.history = this.history.slice(
            this.history.length - this.maxHistoryLength
          );
        this.history = this.history.concat([this.commandText]);
        this.commandText = '';
        var container = this.$el.querySelector('#console_history');
        container.scrollTop = container.scrollHeight;
      }
    },
  },
  computed: {
    composedHistory() {
      return this.history;
    },
  },
  ...mapState({
    player: state => state.player,
    places: state => state.places,
  }),
};
</script>
<style scoped>
.console {
  display: flex;
  flex-direction: column;
  border: 1px solid #ff0ff0;
  padding: 2px;
  overflow: hidden;

  /* background-color: #000; 
  color: #fff;*/
}

.history {
  flex: 6;
  overflow: auto;
}

.commandline {
  flex: 1;
}
</style>
