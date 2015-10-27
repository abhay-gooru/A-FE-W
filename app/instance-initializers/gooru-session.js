import Ember from 'ember';

export function initialize(application) {
  const sessionService = application.lookup('service:session');
  const internalSession = application.lookup('session:main');

  internalSession.reopen({
    /**
     * Restores the session, if the session does not exist then creates a new session for an anonymous user
     * @returns {Ember.RSVP.Promise}
     */
    restore: function() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        this._super().then(function() {
          resolve();
        }, function () {
          sessionService.authenticateAsAnonymous().then(function() {
            resolve();
          }, function() {
            reject();
          });
        });
      });
    }
  });
}

export default {
  name: 'gooru-session',
  after: 'gooru-session-service',
  initialize: initialize
};
