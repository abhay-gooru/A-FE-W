import Ember from 'ember';

export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  i18n: Ember.inject.service(),

  profileService: Ember.inject.service('api-sdk/profile'),
  /**
   * @requires service:api-sdk/analytics
   */
  analyticsService: Ember.inject.service('api-sdk/analytics'),

  // -------------------------------------------------------------------------
  // Attributes


  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Open the player with the specific collection/assessment
     *
     * @function actions:playItem
     * @param {string} unitId - Identifier for a unit
     * @param {string} lessonId - Identifier for lesson
     * @param {string} collection - collection or assessment
     */
    playResource: function (unitId, lessonId, collection) {
      if (collection.get('isExternalAssessment')){
        window.open(collection.get('url'));
      }
      else{
        const currentClass = this.modelFor('student.class').class;
        const classId = currentClass.get('id');
        const courseId = currentClass.get('courseId');
        const role = 'student';
        this.transitionTo('context-player', classId, courseId, unitId,
          lessonId, collection.get('id'), { queryParams: { role: role, type: collection.get('collectionType') }});
      }
    },
    /**
     * Open the player with the specific collection/assessment
     *
     * @function actions:playItem
     * @param {string} unitId - Identifier for a unit
     * @param {string} lessonId - Identifier for lesson
     * @param {string} collection - collection or assessment
     */
    studyPlayer: function (type,unitId,lessonId, collection) {
      if (type === 'lesson'){
        const currentClass = this.modelFor('student.class').class;
        const classId = currentClass.get('id');
        const courseId = currentClass.get('courseId');
        const role = 'student';
        this.transitionTo('study-player', classId, courseId, unitId,
          lessonId, collection.get('id'), { queryParams: { role: role, type: collection.get('collectionType'),isLesson:true }});
      }
      else {
        const currentClass = this.modelFor('student.class').class;
        const classId = currentClass.get('id');
        const courseId = currentClass.get('courseId');
        const role = 'student';
        const courseStarted = this.get('controller.userLocation').length > 0;

        this.transitionTo('study-player', classId, courseId, unitId,
          lessonId, collection.get('id'), { queryParams: { role: role, type: collection.get('collectionType'),isLesson:false, courseStarted }});
      }
    }

  },

  // -------------------------------------------------------------------------
  // Methods
  model: function() {
    const route = this;
    const currentClass = route.modelFor('student.class').class;
    const course = route.modelFor('student.class').course;
    const units = route.modelFor('student.class').units;
    const userId = route.get('session.userId');
    const classMembers = currentClass.get('members');
    const userLocation = route.get('analyticsService').getUserCurrentLocation(currentClass.get('id'), userId);

    return Ember.RSVP.hash({
      userLocation: userLocation,
      course: course,
      units: units,
      currentClass: currentClass,
      classMembers: classMembers
    });
  },

  /**
   * Set all controller properties from the model
   * @param controller
   * @param model
   */
  setupController: function (controller, model) {
    let userLocation = '';
    if(model.userLocation) {
      let unitId = model.userLocation.get('unitId');
      let lessonId = model.userLocation.get('lessonId');
      let collectionId = model.userLocation.get('collectionId');
      userLocation = `${unitId}+${lessonId}+${collectionId}`;
    }

    controller.set('userLocation', userLocation);
    controller.set('units', model.units);
    controller.set('course', model.course);
    controller.set('classMembers', model.classMembers);
    controller.get('studentClassController').selectMenuItem('course-map');
  }
});
