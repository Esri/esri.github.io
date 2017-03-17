export default function serialize (object) {
  return Object.keys(object).reduce((query, key) => {
    return query + ((query.length) ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
  }, '');
}
