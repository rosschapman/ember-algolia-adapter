:hamster: + :mag:

The Ember.js framework and [Algolia](https://www.algolia.com) make a pretty slick team for powering a user-friendly search experience.

This small library demonstrates one way to splice Ember and Algolia based on my work on Science Exchange's [online marketplace](https://www.scienceexchange.com).  It's akin to Algolia's own example marketplace project for [WordPress plugins](https://wordpress.algolia.com/).  The code assumes a split interface between results and filters, which might look a little something like:

![Example of Science Exchange search interface](https://www.evernote.com/shard/s148/sh/412a8fe1-d330-4b38-87c5-6fb8bb5bf4b0/b8ce0e5403f33e70/res/94294e49-bb55-48e5-902a-866367a5ff46/skitch.png)

## Usage example 

```
export default Ember.Route.extend({
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
