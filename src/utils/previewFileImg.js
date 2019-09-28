export default (file, setSRC) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function() {
    setSRC(reader.result);
  };
};
