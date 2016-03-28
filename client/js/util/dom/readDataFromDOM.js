
export default function(scriptId) {
  let node = document.getElementById(scriptId);
  return node && JSON.parse(node.getAttribute('data-value'));
}