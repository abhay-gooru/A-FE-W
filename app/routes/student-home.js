import Ember from 'ember';
import PrivateRouteMixin from "gooru-web/mixins/private-route-mixin";

/**
 * Student home route
 *
 * @module
 * @augments Ember.Route
 */
export default Ember.Route.extend(PrivateRouteMixin, {

  // -------------------------------------------------------------------------
  // Dependencies
  analyticsService: Ember.inject.service("api-sdk/analytics"),

  performanceService: Ember.inject.service("api-sdk/performance"),

  // -------------------------------------------------------------------------
  // Actions


  // -------------------------------------------------------------------------
  // Methods
  model: function () {
    let route = this;
    let activeClasses = route.controllerFor('application').get('studentActiveClasses');
    const myId = route.get("session.userId");
    const classIds = activeClasses.mapBy("id");

    return route.get("performanceService").findClassPerformanceSummaryByClassIds(myId, classIds).then(function(classPerformanceSummaryItems){
      const promises = activeClasses.map(function (aClass) {
        const classId = aClass.get("id");
        return route.get('analyticsService').getUserCurrentLocation(classId, myId, true).then(function (currentLocation) {
          aClass.set("currentLocation", currentLocation);
          aClass.set("performanceSummary", classPerformanceSummaryItems.findBy("classId", classId));
        });
      });

      return Ember.RSVP.all(promises);
    });
  }

});
