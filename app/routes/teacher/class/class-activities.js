import Ember from 'ember';

export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @requires service:api-sdk/class-activity
   */
  classActivityService: Ember.inject.service("api-sdk/class-activity"),

  // -------------------------------------------------------------------------
  // Attributes

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * Launch an assessment on-air
     *
     * @function actions:goLive
     */
    goLive: function (collectionId) {
      const currentClass = this.modelFor('teacher.class').class;
      const classId = currentClass.get("id");
      this.transitionTo('reports.collection', classId, collectionId);
    }
  },

  // -------------------------------------------------------------------------
  // Methods

  model: function () {
    const route = this;
    const currentClass = route.modelFor('teacher.class').class;

    return Ember.RSVP.hash({
      classActivities: route.get('classActivityService').findClassActivities(currentClass.get('id'))
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function (controller, model) {
    controller.get('classController').selectMenuItem('class-activities');
    controller.set("classActivities", model.classActivities);
  }
});
