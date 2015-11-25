import DS from 'ember-data';

export default DS.Model.extend({
  filters: DS.hasMany('filter'),
  name: DS.attr('string'),
});
