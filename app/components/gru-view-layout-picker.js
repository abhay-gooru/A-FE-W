import Ember from 'ember';

/**
 * View Layout Picker
 *
 * Component responsible for letting the user change the profile visualization
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-view-layout-picker'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    /**
     * Set a new visualization as selected and update the component appearance accordingly
     * @function actions:setLayout
     * @param {string} newLayout
     */
    setLayout: function(newLayout) {
      if (newLayout.get("isActive")) {
        this.cleanup();
      } else {
        this.cleanup();
        this.selectLayout(newLayout);
      }
      this.sendAction("onViewLayoutChange", newLayout);
    }

  },
  // -------------------------------------------------------------------------
  // Properties
  /**
   * List of layouts to be displayed by the component
   *
   * @constant {Array}
   */
  viewLayouts: Ember.A([Ember.Object.create({
  'view': 'thumbnails',
  'isActive': false,
  'icon':'th-large'
  }),Ember.Object.create({
  'view': 'list',
  'isActive': false,
  'icon':'bars'
  })]),

  /**
   * Selected view layout
   *
   * @property {string}
   */
  selectedView:null,

  // -------------------------------------------------------------------------
  // Methods

  cleanup: function() {
    const component = this;
    component.get("viewLayouts").forEach(function(option){
      option.set("isActive", false);
      component.set("selectedView",null);
    });
  },

  selectLayout: function(layout) {
    layout.set('isActive', true);
    this.set("selectedView",layout.view);
  }
});
