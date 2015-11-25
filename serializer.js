import DS from 'ember-data';
import camelizeEach from 'lib/camelize-each';

export default DS.RESTSerializer.extend({
  normalizeResponse: function(modelName, payload) {
    var payloadCache = [];
    var newPayload = {};
    var typeClass = this.store.modelFor(modelName);

    payload.hits.forEach(function(hit) {
      payloadCache.push(hit);
    });

    payloadCache.forEach(function(obj) {
      camelizeEach(obj);
      obj['id'] = obj.objectID;
      delete obj.objectID;
      this.applyTransforms(typeClass, obj);
    }, this);

    newPayload[modelName] = payloadCache;
    return newPayload;
  },
  extractMeta: function(modelName, payload) {
    // Note: the meta data must be an object type.
    var metaCache = {};
    for (var prop in payload) {
      if (prop !== 'hits') {
        metaCache[prop] = payload[prop];
      }
    }
    payload.meta = metaCache;
    return payload.meta;
  },
  extractFacets: function(modelName, payload) {
    var facetsDataArr = [];
    var filtersDataArr = [];
    var facetSequence = 0;
    var filterSequence = 0;

    // Forma facets and filters in the way Ember Data lurvs it.
    Object.keys(payload.facets).forEach(function(facet) {
      var rawFilterObj = payload.facets[facet];
      var filtersObjArr = [];

      Object.keys(rawFilterObj).forEach(function (value) {
        var count = rawFilterObj[value];
        var formattedFilterObj = {
          id: filterSequence,
          name: value,
          count: count
        };

        filtersObjArr.push(formattedFilterObj);
        filtersDataArr.push(formattedFilterObj);
        filterSequence++;
      });

      var facetObj = {
        id: facetSequence,
        name: facet,
        filters: filtersObjArr.map(function(elem) {
          return elem.id;
        }),
      };

      facetsDataArr.push(facetObj);
      facetSequence++;
    });

    return {
      facetData: facetsDataArr,
      filterData: filtersDataArr,
    };
  },
});
