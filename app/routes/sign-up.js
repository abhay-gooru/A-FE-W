import Ember from 'ember';

export default Ember.Route.extend({
  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Service} Session service
   */
  session: Ember.inject.service('session'),

  /**
   * @requires service:authentication
   */
  authenticationService: Ember.inject.service('api-sdk/authentication'),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Verfiy the domain have any directions before model get execute.
   */
  beforeModel: function() {
    if (!this.get('session.isAnonymous')) {
      this.transitionTo('index');
    }
    let domain = window.location.hostname;
    this.get('authenticationService')
      .domainBasedRedirection(domain)
      .then(function(data) {
        if (data) {
          if (data.statusCode === 303) {
            window.location.href = data.redirectUrl;
          }
        }
      });
  },

  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller) {
    controller.resetProperties();
  },

  // -------------------------------------------------------------------------
  // Actions

  actions: {
    /**
     * Action triggered when submitting the sign up form
     * @see application.hbs
     * @see gru-header.hbs
     */
    signUp: function() {
      this.transitionTo('sign-up-finish');
    },

    /**
     * Action triggered when close sign up form from childLayout
     */
    closeSignUp: function() {
      this.transitionTo('index');
    }
  }
});
