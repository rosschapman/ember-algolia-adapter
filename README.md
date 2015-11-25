:hamster: + :mag:

The Ember.js framework and [Algolia](https://www.algolia.com) make a pretty slick team for powering a user-friendly search experience.

This small library demonstrates one way to splice Ember and Algolia based on my work on Science Exchange's [online marketplace](https://www.scienceexchange.com).  It's akin to Algolia's own example marketplace project for [WordPress plugins](https://wordpress.algolia.com/).  The code assumes a split interface between results and filters, which might look a little something like:

![Example of Science Exchange search interface](https://www.evernote.com/shard/s148/sh/c9426bd7-b924-4cf8-9ce2-2fb3a0c4e7e6/bc4a9a5b7dd80598/res/c78d4850-f975-421d-bae6-27d1f33daa56/skitch.png)

## Usage example 

```
export default Ember.Route.extend(PaginationRouteMixin, LiveSearchable, {
  model: function(params) {
    var {
      q,
      page
    } = params;
    var options = {
      query: q,
      page: page,
      facetFilters: params.facetFilters,
    };
    return this.store.adapterFor('algolia').query('model-name', options);
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      facets: model.facets,
    });
  },
});
```
