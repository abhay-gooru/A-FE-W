//import DS from "ember-data";
import Ember from "ember";

/**
 * Model for the status of a resource after it has been viewed by a user.
 *
 * @typedef {Object} ResourceResult
 *
 */
export default Ember.Object.extend({

  /**
   * @property {number} reaction - Value of the reaction the user had towards the question
   */
  reaction: 0,

  /**
   * @property {number} timeSpent - Time in seconds that it took the user to answer the question
   */
  timeSpent: 0,

  /**
   * @property {Resource} resource
   */
  resource: null,

  /**
   * Sometimes the resource is not resolved and only the id is provided
   * This is used mostly by the real time
   * TODO once the SDK is integrated we could analyze if is possible to use only 'resource'
   * @property {number} resourceId - ID of the resource
   */
  resourceId: null,

  /**
   * Indicates when the result was submitted
   * @property {Date}
   */
  submittedAt: null,

  /**
   * A result is started when it has time spent
   * @property {boolean} indicates when it has been started
   */
  started: Ember.computed.bool("timeSpent")


});
