import Ember from 'ember';
import LookupSerializer from 'gooru-web/serializers/lookup/lookup';
import LookupAdapter from 'gooru-web/adapters/lookup/lookup';

/**
 * Service to support the Lookup entities
 *
 * Country, State, District
 *
 * @typedef {Object} LookupService
 */
export default Ember.Service.extend({

  lookupSerializer: null,

  lookupAdapter: null,


  init: function () {
    this._super(...arguments);
    this.set('lookupSerializer', LookupSerializer.create());
    this.set('lookupAdapter', LookupAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Gets the current user Profile information
   * @param {string} keyword optional
   *
   * @returns {Promise}
   */
  readCountries: function(keyword) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('lookupAdapter').readCountries(keyword)
        .then(function(response) {
          resolve(service.get('lookupSerializer').normalizeReadCountries(response));
        }, reject);
    });
  }

});
