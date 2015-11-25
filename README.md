:hamster: + :mag:

The Ember.js framework and [Algolia](https://www.algolia.com) make a pretty slick team for powering a user-friendly search experience.

This small library demonstrates one way to splice Ember and Algolia based on my work on Science Exchange's [online marketplace](https://www.scienceexchange.com).  It's akin to Algolia's own example marketplace project for [WordPress plugins](https://wordpress.algolia.com/).  The code assumes a split interface between results and filters, which might look a little something like:

![Example of Science Exchange search interface](https://www.evernote.com/shard/s148/sh/fd32e19a-fdf1-4313-bc9c-4877c34f2e34/8e2ccf1bf15ecf65/res/cba2868e-b2d5-4918-83d7-73ebd3117a7d/skitch.png)

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
