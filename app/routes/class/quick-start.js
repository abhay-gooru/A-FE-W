import Ember from 'ember';

export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),
  profileService: Ember.inject.service('api-sdk/profile'),
  actions: {
    setupTour: function(step, introJSComponent, currentElement){
      if(this.currentModel.tourSteps.indexOf(step)===0){
        $('.gru-class-navigation .class-info h4').addClass('active-for-tour');
      }else{
        $('.gru-class-navigation .class-info h4').removeClass('active-for-tour');
      }
    },
    closeTour: function(step, introJSComponent){
      if($('.gru-class-navigation .class-info h4').hasClass('active-for-tour')){
        $('.gru-class-navigation .class-info h4').removeClass('active-for-tour');
      }
    }
  },
  model: function () {
    const route = this;
    const currentClass = this.modelFor('class').class;
    var coursesPromise = route.get('profileService')
      .readUserProfile(route.get("session.userId"))
        .then(function(profile) {
          return route.get('profileService').getCourses(profile);
        });

    const tourSteps = Ember.A([
      {
        elementSelector:'.menu-navbar .profile.dropdown-toggle',
        title: route.get('i18n').t('gru-tour.quick-start.stepOne.title'),
        description: route.get('i18n').t('gru-tour.quick-start.stepOne.description')
      },
      {
        elementSelector: '.quick-start-options .new-assessment.btn',
        title: route.get('i18n').t('gru-tour.quick-start.stepTwo.title'),
        description: route.get('i18n').t('gru-tour.quick-start.stepTwo.description')
      }
    ]);
    return Ember.RSVP.hash({
      courses:coursesPromise,
      class:currentClass,
      tourSteps:tourSteps
    });


  },
  setupController: function (controller, model) {
    controller.get('classController').selectMenuItem('overview');
    controller.set('class', {
      class: model.class,
      isQuickstart: true
    });
    controller.set('courses', model.courses);
    controller.set('tourSteps', model.tourSteps);
  }

});
