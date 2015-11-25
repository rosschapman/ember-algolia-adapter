import DS from 'ember-data';

export default DS.Model.extend({
  facet: DS.belongsTo('facet'),
  name: DS.attr('string'),
  count: DS.attr('number')
});
