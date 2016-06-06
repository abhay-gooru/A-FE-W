import Ember from 'ember';

export default Ember.Route.extend({

  /**
   * @property {Ember.Service} Service to do the search
   */
  searchService: Ember.inject.service('api-sdk/search'),

  model: function() {
    const term = this.paramsFor('search').term;
    var collectionResults = this.get('searchService').searchCollections(term);
    return Ember.RSVP.hash({
      collectionResults: collectionResults
    }).catch(function(err){
       if(err.status===400){
         return { msg: 'Recovered from rejected promise',error: err };
       }
    });
  },

  /**
   * Set all controller properties used in the template
   * @param controller
   * @param model
   */
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('collectionResults', model.collectionResults);
    model.error && controller.setInvalidSearchTerm(true);
  },

  deactivate: function() {
    this.get("controller").resetValues();
  }

});
