import Ember from 'ember';
import NetworkModel from 'gooru-web/models/network/network';

/**
 * Serializer to support the Network CRUD operations for API 3.0
 *
 * @typedef {Object} ProfileSerializer
 */
export default Ember.Object.extend({

  /**
   * Normalize the Read Network endpoint response
   * @param payload is the endpoint response in JSON format
   * @returns {ProfileModel} a network model object
   */
  normalizeReadNetwork: function(payload) {
    return NetworkModel.create({
      followerCount: Ember.isArray(payload.followers) ? payload.followers.length : 0,
      followingCount: Ember.isArray(payload.followings) ? payload.followings.length : 0
    });
  }

});
