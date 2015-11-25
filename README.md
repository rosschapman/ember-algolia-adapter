:hamster: + :mag:

The Ember.js framework and [Algolia](https://www.algolia.com) make a pretty slick team for powering a user-friendly search experience.

This small library demonstrates one way to splice Ember and Algolia based on my work on Science Exchange's [online marketplace](https://www.scienceexchange.com).  It's akin to Algolia's own example marketplace project for [WordPress plugins](https://wordpress.algolia.com/).  The code assumes a split interface between results and filters, which might look a little something like:

![Example of Science Exchange search interface](https://www.evernote.com/shard/s148/sh/609c6ed0-b68e-42a3-b1fa-8ab97d226fa5/fcfb658e530429c8/res/9711dd03-4f32-454f-a0e7-3056415b30a5/skitch.png)

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
