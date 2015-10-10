import DS from 'ember-data';
import config from 'config/environment';

var algoliaClient = algoliasearch(
  config.algoliaAPI.appId,
  config.algoliaAPI.publishableKey
);

export default DS.RESTAdapter.extend({
  /**
    Builds index name assuming the convention of "ModelName_Environment".

    @method algoliaBuildIndexName
    @param  {String} model
    @return {String} string
  */
  algoliaBuildIndexName: function(modelName) {
    return model.capitalize() + '_' + config.environment;
  },

  /**
    Wraps Algolia API call.

    @method algoliaFind
    @param  {String} modelName
    @param  {Object} searchParams
    @return {Promise} promise
  */
  algoliaFindQuery: function(modelName, searchParams) {
    var indexName;
    var { query, params } = searchParams;
    indexName = this.algoliaBuildIndexName(modelName);
    return algoliaClient.initIndex(indexName).search(query, params);
  },

  /**
    Called by the store in order to fetch a JSON array for the records that match a particular
    query. This override of the `findQuery` method makes an Ajax (HTTP GET) request
    to Algolia.

    Your searchParams hash should be formatted like:
    ```
      searchParams = {
        query: 'why no Yehudster',
        params: {
          page: 1,
          facets: '*',
          hitsPerPage: 20,
          getRankingInfo: 1,
          maxValuesPerFacet: 10
        }
      }
    ```

    @method findQuery
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} searchParams
    @return {Promise} promise
  */
  findQuery: function(store, type, searchParams) {
    return this.algoliaFindQuery(type.modelName, searchParams);
  },
});
