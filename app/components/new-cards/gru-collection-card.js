import Ember from 'ember';
import TaxonomyTag from 'gooru-web/models/taxonomy/taxonomy-tag';
import TaxonomyTagData from 'gooru-web/models/taxonomy/taxonomy-tag-data';

/**
 * Collection, Assessment and Rubric card
 *
 * Component responsible of showing the collection assessment or rubric information in cards, so that most useful information is summarized there.
 * @module
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['new-cards','gru-collection-card'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered to open the content player
     * @param {string} content identifier
     */
    openContentPlayer: function(content) {
      this.sendAction('onOpenContentPlayer', content);
    },
    /**
     * Action triggered to edit content
     */
    editContent: function(){
      this.sendAction('onEditContent', this.get('content'));
    }
  },
  // -------------------------------------------------------------------------
  // Events
  didRender(){
    var component = this;
    component.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Indicates if the edit functionality is enabled
   * @property {boolean}
   */
  addEnabled: true,
  /**
   * @property {Course,Collection,Assessment} content
   */
  content: null,
  /**
   * Indicates if disable share and bookmark actions
   * @property {boolean}
   */
  disabledActions:true,

  /**
   * Indicates if the edit functionality is enabled
   * @property {boolean}
   */
  editEnabled: false,

  /**
   * @property {boolean} Indicates if collection has 1 or more resources
   */
  hasResources: Ember.computed.gt('content.resourceCount', 0),

  /**
   * @property {boolean} Indicates if collection has 1 or more questions
   */
  hasCollections: Ember.computed.gt('collectionCount', 0),

  /**
   * @property {boolean} Indicates if collection has 1 or more resources
   */
  hasAssessments: Ember.computed.gt('assessmentCount', 0),

  /**
   * @property {boolean} Indicates if collection has 1 or more questions
   */
  hasQuestions: Ember.computed.gt('content.questionCount', 0),

  /**
   * @property {boolean}
   */
  isAssessment: Ember.computed.alias('content.isAssessment'),

  /**
   * @property {boolean} isCourse indicate if the card is showing a course
   */
  isCourse:false,

  /**
   * @property {string} edit action
   */
  onEditContent: null,


  /**
   * @property {string} on content player action
   */
  onOpenContentPlayer: null,

  /**
   * Indicates if the edit functionality is enabled
   * @property {boolean}
   */
  remixEnabled: Ember.computed('editEnabled', 'content', function(){
    const isEditing = this.get('editEnabled');
    if (this.get('iscontent')) {
      return !isEditing;
    }
    else {
      return !isEditing && !this.get('isExternalAssessment');
    }
  }),
  /**
   * @property {TaxonomyTag[]} List of taxonomy tags
   */
  tags: Ember.computed('content.standards.[]','isCourse','course.taxonomy.[]', function() {
    if(!this.get('isCourse')){
      var standards = this.get('content.standards');
      standards = standards.filter(function(standard) {
        // Filter out learning targets (they're too long for the card)
        return !TaxonomyTagData.isMicroStandardId(standard.get('id'));
      });
      return TaxonomyTag.getTaxonomyTags(standards);
    } else {
      return TaxonomyTag.getTaxonomyTags(this.get('content.taxonomy'));
    }
  })
});
