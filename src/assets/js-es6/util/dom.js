// returns closest element up the DOM tree matching a given class
export function closest (className, context) {
  var current;
  for (current = context; current; current = current.parentNode) {
    if (current.nodeType === 1 && current.classList.contains(className)) {
      break;
    }
  }
  return current;
}

export function template (string, data) {
  return string.replace(/\{ *([\w_\-]+) *\}/g, function (string, key) {
    var value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for variable ' + string);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
}

export function matchesSelector (domNode, selector) {
  return (
    Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector).call(domNode, selector);
}
