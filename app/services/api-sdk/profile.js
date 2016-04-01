import Ember from 'ember';
import ProfileSerializer from 'gooru-web/serializers/profile/profile';
import CourseSerializer from 'gooru-web/serializers/course/course';
import ProfileAdapter from 'gooru-web/adapters/profile/profile';
import ProfileCourseAdapter from 'gooru-web/adapters/profile/course';


/**
 * Service to support the Profile CRUD operations
 *
 * @typedef {Object} ProfileService
 */
export default Ember.Service.extend({

  session: Ember.inject.service(),

  store: Ember.inject.service(),

  profileSerializer: null,

  profileAdapter: null,


  init: function () {
    this._super(...arguments);
    this.set('profileSerializer', ProfileSerializer.create());
    this.set('courseSerializer', CourseSerializer.create());
    this.set('profileAdapter', ProfileAdapter.create(Ember.getOwner(this).ownerInjection()));
    this.set('profileCourseAdapter', ProfileCourseAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Creates a new user account
   *
   * @param profileData object with the profile data
   * @returns {Promise}
   */
  createProfile: function(profileData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedProfileData = service.get('profileSerializer').serializeCreateProfile(profileData);
      service.get('profileAdapter').createProfile({
        body: serializedProfileData
      }).then(function(response) {
        resolve(service.get('profileSerializer').normalizeCreateProfile(response));
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
   * Gets the current user Profile information
   *
   * @returns {Promise}
   */
  readMyProfile: function() {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileAdapter').readMyProfile()
        .then(function(response) {
          resolve(service.get('profileSerializer').normalizeReadProfile(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  /**
   * Updates the current user Profile information
   *
   * @param profile the Profile object
   * @returns {Promise}
   */
  updateMyProfile: function(profile) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedProfile = service.get('profileSerializer').serializeUpdateProfile(profile);
      service.get('profileAdapter').updateMyProfile({
        body: serializedProfile
      }).then(function() {
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
   * Gets the list of courses created by the profile and filter by subject
   *
   * @param profile the Profile object
   * @param subject the subject to filter the courses
   * @returns {Promise}
   */
  getCourses: function(profile, subject) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('profileCourseAdapter').getCourses(profile.get('id'), subject)
        .then(function(response) {
          resolve(service.get('courseSerializer').normalizeGetCourses(response));
        }, function(error) {
          reject(error);
        });
    });
  },


  //
  // TODO The following functions must be deleted once API 3.0 integration is done
  //
  findByCurrentUser: function() {
    if (!this.get('session.isAnonymous')) {
      var currentProfileId = this.get('session.userId');
      return this.findById(currentProfileId);
    }
    return null;
  },

  /**
   * Find a user profile by user id
   * @param {string} userId
   * @returns {Profile}
   */
  findByUser: function(userId) {
    //TODO implement, for now it returns the current user
    Ember.Logger.log(userId);
    return this.findByCurrentUser();
  },

  findById: function(profileId) {
    return this.get('store').findRecord('profile', profileId);
  }

});
