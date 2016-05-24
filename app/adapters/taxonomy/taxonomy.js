import Ember from 'ember';

/**
 * Adapter for Taxonomy endpoints
 *
 * @typedef {Object} TaxonomyAdapter
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  namespace: '/api/nucleus/v1/taxonomy',

  /**
   * Fetches the Taxonomy Subjects for the specific type
   *
   * @returns {Promise}
   */
  fetchSubjects: function(type) {
    const adapter = this;
    const namespace = adapter.get('namespace');
    const url = `${namespace}/subjects`;
    const options = {
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: adapter.defineHeaders(),
      data: {
        classification_type: type
      }
    };
    return Ember.$.ajax(url, options);
  },

  defineHeaders: function() {
    return {
      'Authorization': 'Token ' + this.get('session.token-api3')
    };
  }

});
