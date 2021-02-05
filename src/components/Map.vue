<template>
  <div>
    <object
      type="image/svg+xml"
      data="./maps/map.svg"
      width="960"
      height="960"
      id="svg-object"
    ></object>
  </div>
</template>

<script>
export default {};

window.addEventListener(
  "message",
  (message) => {
    if (message.data.event == "click") {
      clickCell(message.data.elementId, message.source);
    }
  },
  false
);

function clickCell(elementId, source) {
  source.postMessage({ event: "changeCellColor", elementId: elementId }, "*");
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
