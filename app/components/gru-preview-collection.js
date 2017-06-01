import Ember from 'ember';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Attributes

  classNames:['gru-preview-collection'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  init() {
    var component = this;
    component._super(...arguments);
    component.set('collection',component.get('model.content'));
    component.set('isTeacher',component.get('model.isTeacher'));
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Collection} collection
   */
  collection: null,
  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('collection.standards.[]', function() {
    var standards = this.get('collection.standards');
    standards = standards.filter(function(standard) {
      // Filter out learning targets (they're too long for the card)
      return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
    });
    return TaxonomyTag.getTaxonomyTags(standards);
  }),

  /**
   * Indicates if the teacher is seeing the collection/assessment card
   * @property {boolean}
   */
  isTeacher: null,

  /**
   * @property {boolean} Indicates if collection has 1 or more resources
   */
  hasResources: Ember.computed.gt('collection.resourceCount', 0),

  /**
   * @property {boolean} Indicates if collection has 1 or more questions
   */
  hasQuestions: Ember.computed.gt('collection.questionCount', 0)

});