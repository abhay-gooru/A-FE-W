import Ember from 'ember';
import {DEFAULT_PAGE_SIZE} from 'gooru-web/config/config';

/**
 * Collection search controller
 *
 * Controller responsible for filtering and searching collections/assessments
 *
 * @module
 * @see controllers/player.js
 * @augments ember/Controller
 */
export default Ember.Controller.extend({

  // -------------------------------------------------------------------------
  // Dependencies
  searchController: Ember.inject.controller('search'),

  appController: Ember.inject.controller('application'),

  /**
   * @property {Ember.Service} Service to do the search
   */
  searchService: Ember.inject.service('api-sdk/search'),
  // -------------------------------------------------------------------------
  // Attributes


  // -------------------------------------------------------------------------
  // Actions
  actions: {
    showMoreResults: function(){
      this.showMoreResults();
    },

    /**
     * Remove a tag from the selected tag list
     * the browse selector.
     * @function actions:removeTag
     * @param {TaxonomyTag} taxonomyTag
     */
    removeTag: function (taxonomyTag) {

      var selectedTags = this.get('selectedTags');

      selectedTags.removeObject(taxonomyTag);

      var taxonomyMap =  selectedTags.map(function(taxonomyTagData) {
        return taxonomyTagData.get("data.id");
      });

      this.set('taxonomies', taxonomyMap);
    }

  },


  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Services

  // -------------------------------------------------------------------------
  // Properties
  /**
   * These are the collection search results
   * @property {CollectionResult[]}
   */
  collectionResults: null,

  /**
   * @property {string} term filter
   */
  term: Ember.computed.alias("searchController.term"),

  /**
   * @property {*}
   */
  pagination: {
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE
  },

  /**
   * @property {boolean}
   */
  showMoreResultsButton: Ember.computed("collectionResults.[]", function(){
    return this.get("collectionResults.length") &&
      (this.get("collectionResults.length") % this.get("pagination.pageSize") === 0);
  }),

  /**
   * @property {selectedTags[]} selected tags
   */
  selectedTags: Ember.computed.alias("searchController.selectedTags"),

  /**
   * @property {string[]} standards
   */
  taxonomies: Ember.computed.alias("searchController.taxonomies"),

  // -------------------------------------------------------------------------
  // Methods

  showMoreResults: function(){
    const controller = this;
    const pagination = this.get("pagination");
    pagination.page = pagination.page + 1;

    const params = controller.getSearchParams();
    controller.get('searchService').searchCollections(controller.get("term"), params)
      .then(function(collections){
        controller.get("collectionResults").pushObjects(collections.toArray());
      });
  },

  getSearchParams: function(){
    const controller = this;
    const pagination = controller.get("pagination");
    return {
      types: controller.get("selectedOptionTypes"),
      page: pagination.page,
      pageSize: pagination.pageSize,
      taxonomies: controller.get("taxonomies")
    };
  },

  resetValues: function(){
    this.resetPagination();
  },

  /**
   * Resets the pagination values
   */
  resetPagination: function () {
    this.set("pagination", {
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE
    });
  },
  setInvalidSearchTerm : function(value){
    this.get('appController').setInvalidSearchTerm(value);
  }
});
