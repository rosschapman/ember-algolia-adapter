export default function camelizeEach(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && /(\-|\_|\.|\s)+(.)?/g.test(prop)) {
      var camelizedProp = prop.camelize();
      obj[camelizedProp] = obj[prop];
      delete obj[prop];
    }
  }
}
