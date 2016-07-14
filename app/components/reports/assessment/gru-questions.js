import Ember from 'ember';

export default Ember.Component.extend({

  classNameBindings: ['isAnswerKeyHidden:key-hidden', 'showPerformance:performance-view'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Selects Performance Option or not
     * @function actions:selectPerformanceOption
     */
    selectPerformanceOption:function(showPerformance) {
      if (!this.get('isAnswerKeyHidden')) {
        this.set('showPerformance', showPerformance);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @requires service:i18n
   */
  i18n: Ember.inject.service(),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['reports', 'assessment', 'gru-questions'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {boolean} isAnswerKeyHidden - Should the answer key be hidden?
   */
  isAnswerKeyHidden: false,

  /**
   * List of questions to be displayed by the component
   *
   * @constant {Array}
   */
  results: null,

  /**
   * Indicate if the table show the performance columns
   *
   * @property {Boolean}
   */
  showPerformance: true
});
