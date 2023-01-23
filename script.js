//trying to figure out how to create html objects using javascript
function CloneNode() {
  //var orginal = document.getElementById("Canvas");
  //var clone = orginal.cloneNode(true);
  //clone.removeAttribute("id");
  //document.getElementById("ID").appendChild(clone);

  // You can use document.createElement(type) to create HTML objects
  // Ex.
  var text = document.createElement("h1");
  text.innerHTML = "this is some texttt"
  
  document.getElementById("Canvas").appendChild(text)
}