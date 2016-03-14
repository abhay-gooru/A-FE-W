import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies


  // -------------------------------------------------------------------------
  // Attributes

  classNames:['gru-resource-options'],

  // -------------------------------------------------------------------------
  // Actions

  actions:{

    /**
     * selectOption selects menu option
     */
    selectOption: function(option){
      this.sendAction("onSelectedOption", option);
    }
  },

  // -------------------------------------------------------------------------
  // Events


  // -------------------------------------------------------------------------
  // Properties

  /**
   * Types of question selected
   *  @property {array} selectedOptionTypes
   *
   */
  selectedOptionTypes: Ember.A([]),

  /**
   * True if video option is selected
   *  @property {boolean} videoSelected
   *
   */

  videoSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.contains("video");
  }),

  /**
   * True if web-page option is selected
   *  @property {boolean} webPageSelected
   *
   */

  webPageSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.contains("web-page");
  }),

  /**
   * True if interactive option is selected
   *  @property {boolean} interactiveSelected
   *
   */

  interactiveSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.contains("interactive");
  }),

  /**
   * True if image option is selected
   *  @property {boolean} fibSelected
   *
   */

  imageSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.contains("image");
  }),

  /**
   * True if text option is selected
   *  @property {boolean} textSelected
   *
   */

  textSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get('selectedOptionTypes');
    return selectedOptions.contains("text");
  }),

  /**
   * True if audio option is selected
   *  @property {boolean} audioSelected
   *
   */

  audioSelected: Ember.computed('selectedOptionTypes.[]', function() {
    const selectedOptions = this.get("selectedOptionTypes");
    return selectedOptions.contains('audio');
  })
  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods

});
