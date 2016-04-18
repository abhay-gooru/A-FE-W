import Ember from 'ember';
import SearchSerializer from 'gooru-web/serializers/search/search';
import SearchAdapter from 'gooru-web/adapters/search/search';

/**
 * Service to support the Search of Collections and Resources
 *
 * @typedef {Object} SearchService
 */
export default Ember.Service.extend({

  searchSerializer: null,

  searchAdapter: null,


  init: function () {
    this._super(...arguments);
    this.set('searchSerializer', SearchSerializer.create());
    this.set('searchAdapter', SearchAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Search for collections
   *
   * @param term the term to search
   * @returns {Promise}
   */
  searchCollections: function(term) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('searchAdapter').searchCollections(term)
        .then(function(response) {
          resolve(service.get('searchSerializer').normalizeSearchCollections(response));
        }, reject);
    });
  },

  /**
   * Search for assessments
   *
   * @param term the term to search
   * @returns {Promise}
   */
  searchAssessments: function(term) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('searchAdapter').searchAssessments(term)
        .then(function(response) {
          resolve(service.get('searchSerializer').normalizeSearchAssessments(response));
        }, reject);
    });
  },

  /**
   * Search for resources
   *
   * @param term the term to search
   * @param formatValues is an array with the values to filter the search
   * @returns {Promise.<Resource[]>}
   */
  searchResources: function(term, formatValues) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('searchAdapter').searchResources(term, formatValues)
        .then(function(response) {
          resolve(service.get('searchSerializer').normalizeSearchResources(response));
        }, function(error) {
          reject(error);
      });
    });
  },

  /**
   * Search for questions
   *
   * @param term the term to search
   * @param types is an array with the values to filter the search
   * @returns {Promise.<Question[]>}
   */
  searchQuestions: function(term, types) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('searchAdapter').searchQuestions(term, types)
        .then(function(response) {
          resolve(service.get('searchSerializer').normalizeSearchQuestions(response));
        }, function(error) {
          reject(error);
      });
    });
  }

});
