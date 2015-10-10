import DS from 'ember-data';
import camelizeEach from 'lib/camelize-each';

export default DS.JSONSerializer.extend({
  extractArray: function(store, type, payload) {
    var payloadCache = [];
    payload.hits.forEach(function(hit) {
      payloadCache.push(hit);
    });

    // Ember Data expects the payload meta data to be set in this extractArray hook.
    store._setMetadataFor(type.modelName, payload.meta);
    return this._super(store, type, payloadCache);
  },
  normalizePayload: function(payload) {
    payload.forEach(function(obj) {
      camelizeEach(obj);
      obj['id'] = obj.objectID;
      delete obj.objectID;
    });
    return payload;
  },
  extractMeta: function(store, primaryModelClass, payload) {
    // Note: the meta data must be an object.
    var metaCache = {};
    for (var prop in payload) {
      if (prop !== 'hits') {
        metaCache[prop] = payload[prop];
      }
    }
    return payload.meta = metaCache;
  },
});
