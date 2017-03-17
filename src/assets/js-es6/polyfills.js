import 'babel-polyfill';
import 'custom-event-polyfill';
import 'whatwg-fetch';
import 'document-register-element';

// hack: https://phabricator.babeljs.io/T1548
if (typeof HTMLElement !== 'function') {
  var _HTMLElement = function () {};
  _HTMLElement.prototype = HTMLElement.prototype;
  HTMLElement = _HTMLElement; // eslint-disable-line no-native-reassign
}
