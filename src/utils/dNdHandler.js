export default ({
  highlightClass = "highlight",
  onDrop = e => {
    console.log(e);
  }
}) => e => {
  e.preventDefault();
  e.stopPropagation();
  switch (e.type) {
    case "dragenter":
    case "dragover":
      e.currentTarget.classList.add(highlightClass);
      break;
    case "dragleave":
      e.currentTarget.classList.remove(highlightClass);
      break;
    case "drop":
      e.currentTarget.classList.remove(highlightClass);
      onDrop(e);
      break;
    default:
      console.log("this should not have happened!");
  }
};
