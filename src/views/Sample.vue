<template>
  <v-layout>
    <v-flex d-flex flex xs12 fill-height style="width: 99vw;">
      <!-- LEFT COLUMN -->
      <v-layout
        column
        wrap
        style="width: 50px;"
        class="full-height-flex-column flex-grow-0 flex-shrink-0 bar"
      >
        <v-flex style="padding:5px;flex:1">0.1</v-flex>
        <v-flex style="padding:5px;flex:11">0.2</v-flex>
      </v-layout>

      <!-- CENTER COLUMN -->
      <v-layout column wrap class="full-height-flex-column">
        <v-flex style="padding:5px;flex:1;border-bottom:1px solid #000"
          >A.B</v-flex
        >
        <v-flex
          style="style:padding:5px;flex:11; overflow: auto;border-right:1px solid #000"
        >
          <div style="padding:5px">{{ lorem }}</div>
        </v-flex>
        <div style="padding:5px;height:2em;" class="bar">A.D</div>
      </v-layout>

      <!-- RIGHT COLUMN -->
      <v-layout
        style="min-width:200px; max-width: 300px"
        column
        wrap
        class="flex-grow-0 flex-shrink-0 full-height-flex-column"
      >
        <v-flex
          style="padding:5px;flex:1; overflow: auto;border-bottom:1px solid #000"
        ></v-flex>
        <v-flex style="padding:5px;flex:11; overflow: auto">
          CONSOLE {{ lorem }}
        </v-flex>
        <div style="padding:5px;height:2em;" class="bar">A.D</div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Home',
  data: function() {
    return {
      lorem: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus nulla ipsum, id luctus nunc egestas eget. Aliquam ac risus eu turpis pharetra porta nec commodo nibh. Nam in urna in est consectetur dignissim in sed ante. Quisque ultricies vehicula mauris, quis hendrerit felis. Ut sit amet auctor turpis. Mauris nec lorem quis ligula elementum pellentesque. Sed fermentum elit eget magna molestie, a fermentum turpis tempus. Nam mollis turpis erat, ac semper ante hendrerit sed. Sed vehicula dui enim, quis imperdiet nisi feugiat vel. In dapibus augue non lacus hendrerit gravida. Vestibulum venenatis ac massa vitae eleifend. Suspendisse venenatis dui in dignissim tincidunt.

In eget odio eget nisi consectetur rutrum id ac tortor. Vestibulum tempor risus et nisi commodo, sed efficitur justo tincidunt. Aenean in diam enim. Quisque pharetra malesuada nibh, ac dignissim tortor. Pellentesque facilisis nunc nec ipsum sodales, sed interdum nisi lacinia. In a lobortis risus. Nunc suscipit, dolor sed lacinia condimentum, turpis turpis porttitor justo, vel consequat elit nibh at erat. Suspendisse quis dictum elit, fermentum finibus diam. Ut vulputate a mauris ac rhoncus. Duis eget iaculis massa.

Ut eget mi feugiat, aliquam eros vitae, mattis dolor. Donec non tortor placerat tellus semper maximus sed finibus nunc. Etiam eget commodo sapien. Aliquam semper venenatis quam in placerat. In varius velit sed dui porttitor, quis blandit libero gravida. Etiam rhoncus egestas sodales. Nam tincidunt, sapien non luctus iaculis, enim lectus mollis metus, sit amet accumsan odio nisl eu nisl. Fusce convallis, risus a scelerisque malesuada, libero odio eleifend ligula, et efficitur dui enim porta ipsum. Phasellus luctus, nisl sed vulputate consectetur, eros massa eleifend orci, eget eleifend mi lorem sed turpis. Donec ac velit eget felis condimentum malesuada. Aenean justo ligula, iaculis nec massa vehicula, volutpat posuere nisi. Phasellus in consectetur tellus. Nullam mauris justo, pharetra fringilla justo ut, hendrerit elementum mi. Vivamus consectetur lorem efficitur tellus rhoncus, fringilla scelerisque urna convallis. Suspendisse consectetur sapien quis egestas tincidunt.

Suspendisse interdum, urna ut maximus condimentum, urna ante ultrices massa, eu mattis turpis arcu quis risus. Nam faucibus tincidunt malesuada. In eu convallis ante. Quisque efficitur odio ex, sed finibus eros sollicitudin vel. Mauris sit amet semper velit. Nam sed eleifend lacus. Sed vel odio volutpat, hendrerit massa sit amet, faucibus urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam nec rutrum quam. Vivamus consectetur erat non leo tincidunt, non tristique ipsum tempus.

Maecenas vulputate ipsum ac iaculis mattis. Aliquam at elit enim. Nunc quis tempor ligula, quis imperdiet nisi. Quisque malesuada augue eget elementum vestibulum. Mauris a feugiat nunc. Ut eros dolor, vulputate eu dui et, vestibulum ullamcorper quam. Curabitur hendrerit vulputate scelerisque.

`,
    };
  },
  components: {},
  computed: {},
  created() {},
  methods: {},
};
</script>

<style scoped></style>
