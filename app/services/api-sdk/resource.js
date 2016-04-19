import Ember from 'ember';
import ResourceSerializer from 'gooru-web/serializers/content/resource';
import ResourceAdapter from 'gooru-web/adapters/content/resource';


/**
 * @typedef {Object} ResourceService
 */
export default Ember.Service.extend({

  /**
   * @property {ResourceSerializer} resourceSerializer
   */
  resourceSerializer: null,

  /**
   * @property {ResourceAdapter} resourceAdapter
   */
  resourceAdapter: null,

  init: function () {
    this._super(...arguments);
    this.set('resourceSerializer', ResourceSerializer.create());
    this.set('resourceAdapter', ResourceAdapter.create(Ember.getOwner(this).ownerInjection()));
  },


  /**
   * Creates a new resource
   *
   * @param resourceData object with the resource data
   * @returns {Promise}
   */
  createResource: function(resourceData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedClassData = service.get('resourceSerializer').serializeCreateResource(resourceData);
      service.get('resourceAdapter').createResource({
        body: serializedClassData
      }).then(function(responseData, textStatus, request) {
        let resourceId = request.getResponseHeader('location');
        resourceData.set('id', resourceId);
        resolve(resourceData);
      }, function(error) {
        if (error.status === 400){ //when the resource already exists
          let data = JSON.parse(error.responseText);
          let alreadyExists = data && data.duplicate_ids && data.duplicate_ids.length;
          if (alreadyExists){
            reject({ status: 400, resourceId: data.duplicate_ids[0] });
          }
        }
        else{
          reject(error);
        }
      });
    });
  },

  /**
   * Finds an resources by id
   * @param {string} resourceId
   * @returns {Ember.RSVP.Promise}
   */
  readResource: function(resourceId){
    const service = this;
    const serializer = service.get('resourceSerializer');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('resourceAdapter').readResource(resourceId)
        .then(function(responseData /*, textStatus, request */) {
        resolve(serializer.normalizeReadResource(responseData));
      }, reject );
    });
  }
});