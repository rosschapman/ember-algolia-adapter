export default function camelizeEach(obj) {
  var regex = /(\-|\_|\.|\s)+(.)?/g;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && regex.test(prop)) {
      var camelizedProp = prop.camelize();
      obj[camelizedProp] = obj[prop];
      delete obj[prop];
    }
  }
}
