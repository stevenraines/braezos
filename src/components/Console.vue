<template>
  <div>
    <div class="console" ref="console" id="console">
      <div
        v-bind:id="'history_' + line.id"
        v-for="line in composedHistory"
        v-bind:key="line.id"
      >
        {{ line.text }}
      </div>
    </div>
    <div>
      <v-text-field
        filled
        dark
        dense
        color="white"
        ref="commandline"
        class=" commandline"
        type="text"
        placeholder="&gt;"
        v-model="commandText"
        @keydown.enter="CommandLineEnter"
      />
    </div>
  </div>
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
  mounted() {
    this.scrollConsoleToBottom();
  },
  methods: {
    focusCommandLine() {
      this.$refs.commandline.focus();
    },
    scrollConsoleToBottom() {
      setTimeout(
        function() {
          let history = this.$el.querySelector(`#console`);
          history.scrollTop = history.clientHeight + history.scrollTop;
        }.bind(this),
        0
      );
    },
    CommandLineEnter(key) {
      this.maxHistoryLength = 100;
      if (key.code == 'Enter') {
        if (this.history.length >= this.maxHistoryLength) this.history.shift();
        let newIndex = 0;
        if (this.history.length > 0) {
          newIndex = parseInt(this.history[this.history.length - 1].id) + 1;
        }
        this.history = this.history.concat([
          { id: newIndex, text: this.commandText },
        ]);
        this.commandText = '';

        this.scrollConsoleToBottom();
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
  padding: 2px;
  overflow: auto;
  background-color: #000;
  color: #fff;
  font-size: 1em;
  font-family: monospace;
}

.commandline {
  flex: 1;
  font-size: 1em;
  font-family: monospace;
  color: #fff;
}
</style>
