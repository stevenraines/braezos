window.addEventListener(
  "message",
  (message) => {
    console.log("message to svg", message);

    let map = document.getElementById("map");

    if (message.data.event == "changeCellColor") {
      let element = map.getElementById(message.data.elementId);
      element.setAttributeNS(null, "fill", "orange");
    }
    //
    //
  },
  false
);
