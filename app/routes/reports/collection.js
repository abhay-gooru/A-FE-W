import Ember from 'ember';
import ReportData from 'gooru-web/models/result/report-data';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for class performance
 * from analytics to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  analyticsService: Ember.inject.service('api-sdk/analytics'),

  collectionService: Ember.inject.service('api-sdk/collection'),

  userService: Ember.inject.service("api-sdk/user"),


  // -------------------------------------------------------------------------
  // Actions

  actions: {

    navigateBack: function () {
      var route = !this.get('history.lastRoute.name') ? 'index' : this.get('history.lastRoute.url');
      this.transitionTo(route);
    }

  },


  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function () {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function (params) {
    const courseId = params.courseId;
    const classId = params.classId;
    const unitId = params.unitId;
    const lessonId = params.lessonId;
    const collectionId = params.collectionId;
    const members = this.get("userService").findMembersByClass(classId);
    const model = this;

    // Get initialization data from analytics
    return this.get('collectionService')
      .findById(collectionId)
      .then(function (collection) {
        var collectionType = collection.get('collectionType');

        return model.get('analyticsService')
          .findResourcesByCollection(classId, courseId, unitId, lessonId, collectionId, collectionType)
          .then(function (userResourcesResults) {
            return Ember.RSVP.hash({
              routeParams: Ember.Object.create({
                classId: classId,
                collectionId: collectionId
              }),
              collection: collection,
              students: members,
              userResults: userResourcesResults
            });
          });
      });
  },

  setupController: function (controller, model) {
    // Create an instance of report data to pass to the controller.
    var reportData = ReportData.create({
      students: model.students,
      resources: model.collection.get('resources')
    });

    // Merge any data from analytics into the report data.
    reportData.merge(model.userResults);

    controller.set('routeParams', model.routeParams);
    controller.set('assessment', model.collection);
    controller.set('students', model.students);
    controller.set('reportData', reportData);
  },

  resetController: function (controller) {
    // When exiting, reset the controller values
    controller.setProperties({
      routeParams: null,
      assessment: null,
      students: null,
      reportData: null
    });
  }

});
