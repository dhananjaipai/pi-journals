export default date =>
  date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric"
  });
