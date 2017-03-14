export function get (name) {
  if (!name) {
    return;
  }
  return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
}

export function setItem (name, value, end, path, domain, secure) {
  if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
    return;
  }

  var expires = '';

  if (end) {
    switch (end.constructor) {
    case Number:
      expires = end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + end;
      break;
    case String:
      expires = '; expires=' + end;
      break;
    case Date:
      expires = '; expires=' + end.toUTCString();
      break;
    }
  }

  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '') + (secure ? '; secure' : '');

  return true;
}

export function remove (name, path, domain) {
  if (!this.has(name)) {
    return;
  }

  document.cookie = encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');

  return true;
}

export function has (name) {
  if (!name) {
    return;
  }
  return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
}

export function keys () {
  var aKeys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:=[^;]*)?;\s*/);

  for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
    aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
  }

  return aKeys;
}
