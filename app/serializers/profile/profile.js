import Ember from 'ember';
import ProfileModel from 'gooru-web/models/profile/profile';
import Env from 'gooru-web/config/environment';

/**
 * Serializer to support the Profile CRUD operations for API 3.0
 *
 * @typedef {Object} ProfileSerializer
 */
export default Ember.Object.extend({

  /**
   * Serialize a Profile object into a JSON representation required by the Create Profile endpoint
   * @param profileData the profile object
   * @returns {Object} returns a JSON Object
   */
  serializeCreateProfile: function(profileData) {
    return {
      firstname: profileData.get('firstName'),
      lastname: profileData.get('lastName'),
      username: profileData.get('username'),
      'email_id': profileData.get('email'),
      password: profileData.get('password'),
      'birth_date': profileData.get('dateOfBirth'),
      'user_category': profileData.get('role'),
      gender: null,
      grade: []
    };
  },

  /**
   * Serialize a Profile object into a JSON representation required by the Update Profile endpoint
   * @param profile
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateProfile: function(profile) {
    return {
      firstname: profile.get('firstName'),
      lastname: profile.get('lastName'),
      'user_category': profile.get('role'),
      grade: profile.get('grades'),
      country: profile.get('country'),
      state: profile.get('state'),
      school: profile.get('school'),
      'school_district': profile.get('schoolDistrict'),
      'about_me': profile.get('aboutMe')
    };
  },

  normalizeCreateProfile: function(payload) {
    return {
      token: Env['API-3.0']['user-token-api-2.0'],
      'token-api3': payload['access_token'],
      user: {
        username: payload.username,
        gooruUId: payload['user_id']
      },
      isAnonymous: false
    };
  },

  /**
   * Normalize the Read Profile endpoint response
   * @param payload is the endpoint response in JSON format
   * @returns {ProfileModel} a profile model object
   */
  normalizeReadProfile: function(payload) {
    return ProfileModel.create({
      id: payload.id,
      firstName: payload.firstname,
      lastName: payload.lastname,
      username: payload.username,
      email: payload['email_id'],
      gender: payload.gender,
      grades: payload.grade,
      dateOfBirth: payload['birth_date'],
      role: payload['user_category'],
      createdAt: payload['created_at'],
      lastUpdate: payload['updated_at'],
      countryId: payload['country_id'],
      country: payload.country,
      stateId: payload['state_id'],
      state: payload.state,
      schoolId: payload['school_id'],
      school: payload.school,
      schoolDistrictId: payload['school_district_id'],
      schoolDistrict: payload['school_district'],
      aboutMe: payload['about_me'],
      avatarUrl: payload['thumbnail_path'],
      rosterId: payload['roster_id'],
      followers: payload.followers,
      followings: payload.followings,
      isFollowing: !!payload.isFollowing
    });
  }

});