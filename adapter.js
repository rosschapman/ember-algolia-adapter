import DS from 'ember-data';
import config from 'config/environment';

var algoliaClient = algoliasearch(
  config.algoliaAPI.appId,
  config.algoliaAPI.publishableKey
);

export default DS.RESTAdapter.extend({
  defaultSerializer: 'algolia',
  defaultParams: {
    facets: '*',
    attributesToRetrieve: '*',
  },
  query: function(modelName, options) {
    var self = this;
    var {
      query,
      page,
      facetFilters,
      visibility,
    } = options;

    var facetFiltersFormatted = this._facetFormatter(facetFilters);

    // Set model name as class property so can be easily accessed in callbacks.
    this.setProperties({
      modelName: modelName,
    });

    var queryParams = { page: page };
    var queryParamsWithFilters = {
      page: page,
      facetFilters: facetFiltersFormatted,
    };

    var indexName = this._algoliaBuildIndexName(modelName, visibility);
    var facetsParams = Ember.$.extend(queryParams, this.get('defaultParams'));
    var resultsParams = Ember.$.extend(queryParamsWithFilters, this.get('defaultParams'));

    query = query || '';

    var promises = {
      facets: algoliaClient.initIndex(indexName).search(query, facetsParams),
      results: algoliaClient.initIndex(indexName).search(query, resultsParams)
    };

    return Ember.RSVP.hash(promises).then(function(hash) {
      self.store.unloadAll(modelName);
      var model = self._handleResultsResponse(hash.results);
      var facets = self._handleFacetsResponse(hash.facets, hash.results);
      model.facets = facets;
      return model;
    }.bind(self));
  },

  _algoliaBuildIndexName: function(model, visibility) {
    if (!!modelAliases[model]) {
      model = modelAliases[model];
    }
    if (visibility) {
      return model.camelize().capitalize() + '_' + visibility.capitalize() + '_' + config.environment;
    } else {
      return model.camelize().capitalize() + '_' + config.environment;
    }
  },

  _handleResultsResponse: function(resultsPayload) {
    var self = this;
    var meta;
    var normalizedPayload;
    var modelRecordArray;
    var modelName = this.get('modelName');
    var serializer = this.store.serializerFor('algolia');

    // Serialize the raw JSON payload.
    normalizedPayload = serializer.normalizeResponse(modelName, resultsPayload);
    meta = this.store.serializerFor('algolia').extractMeta(modelName, resultsPayload);

    // Note(ross): Tried to push the whole hash with `pushPayload` but certain this behaved flaky:
    // certain record attributes would be dropped.
    normalizedPayload[modelName].forEach(function(record) {
      self.store.push(modelName, record);
    });

    // Build model object.
    modelRecordArray = this.store.peekAll(modelName);
    modelRecordArray.set('meta', meta);
    return modelRecordArray;
  },

  // Pushes facets and filters onto the global store and returns facets; if we ever need filters
  // we can reach them through facets.
  _handleFacetsResponse: function(facetsPayload) {
    var self = this;
    var modelName = this.get('modelName');
    var extractedFacets = this.store.serializerFor('algolia').extractFacets(modelName, facetsPayload);

    this.store.unloadAll('facet');
    this.store.unloadAll('filter');

    extractedFacets.facetData.forEach(function(record) {
      self.store.push('facet', record);
    });

    extractedFacets.filterData.forEach(function(record) {
      self.store.push('filter', record);
    });

    return this.store.peekAll('facet');
  },

  // Transforms a flat array and returns properly nested arrays that configure OR and AND filtering.
  _facetFormatter: function(facetFiltersArr) {
    if (!facetFiltersArr) { return; }
    var formattedFacets = [];

    // ```
    // ['status:Accepted', 'user_name:Dennis Rodman'] >>
    // ['status', 'user_name']
    // ```
    var facetNames = facetFiltersArr.map(function(facet) {
      if (typeof facet !== 'string') { return; }
      return facet.split(':')[0];
    });

    // Dedupe array of facetNames.
    facetNames.uniq();

    // Loop over each facet and build an array of OR filters across a single facet and AND filters
    // across multiple facets in the format that Algolia understands.  EG:
    // ```
    // [["status:Declined","status:Closed"],["user_name:Dennis Rodman"]]
    // ```
    facetNames.forEach(function(facetName, index){
      var facetArr = 'arr_' + index;
      facetArr = facetFiltersArr.filter(function(filter) {
        return filter.indexOf(facetName) !== -1;
      });
      formattedFacets.push(facetArr);
    });

    return formattedFacets;
  },
});
