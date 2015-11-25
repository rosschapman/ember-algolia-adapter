export default function camelizeEach(obj) {
  var camelizedProp;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && /(\-|\_|\.|\s)+(.)?/g.test(prop)) {
      camelizedProp = prop.camelize();
      obj[camelizedProp] = obj[prop];
      delete obj[prop];
    }
  }
}
