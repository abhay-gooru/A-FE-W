import Ember from 'ember';
import { cleanFilename } from 'gooru-web/utils/utils';
import CollectionModel from 'gooru-web/models/content/collection';
import ResourceSerializer from 'gooru-web/serializers/content/resource';
import QuestionSerializer from 'gooru-web/serializers/content/question';


/**
 * Serializer to support the Collection CRUD operations for API 3.0
 *
 * @typedef {Object} CollectionSerializer
 */
export default Ember.Object.extend({

  session: Ember.inject.service('session'),

  /**
   * @property {ResourceSerializer} resourceSerializer
   */
  resourceSerializer: null,

  /**
   * @property {QuestionSerializer} questionSerializer
   */
  questionSerializer: null,

  init: function () {
    this._super(...arguments);
    this.set('resourceSerializer', ResourceSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('questionSerializer', QuestionSerializer.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Serialize a Collection object into a JSON representation required by the Create Collection endpoint
   *
   * @param collectionModel The Collection model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeCreateCollection: function(collectionModel) {
    return this.serializeCollection(collectionModel);
  },

  /**
   * Serialize a Collection object into a JSON representation required by the Update Collection endpoint
   *
   * @param collectionModel The Collection model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeUpdateCollection: function(collectionModel) {
    return this.serializeCollection(collectionModel);
  },

  serializeCollection: function(collectionModel) {
    return {
      title: collectionModel.get('title'),
      learning_objective: collectionModel.get('learningObjectives'),
      visible_on_profile: collectionModel.get('isVisibleOnProfile'),
      thumbnail: cleanFilename(collectionModel.thumbnailUrl)
    };
  },

  /**
   * Normalize the Collection data into a Collection object
   * @param questionData
   * @returns {Question}
   */
  normalizeReadCollection: function(payload) {
    const serializer = this;
    const basePath = serializer.get('session.cdnUrls.content');
    const thumbnailUrl = payload.thumbnail ?
    basePath + payload.thumbnail :
      '/assets/gooru/collection-default.png'; //TODO configured in properties

    return CollectionModel.create(Ember.getOwner(this).ownerInjection(), {
      id: payload.id,
      title: payload.title,
      learningObjectives: payload['learning_objective'],
      isVisibleOnProfile: (payload['visible_on_profile'] !== undefined) ? payload['visible_on_profile'] : true,
      children: serializer.normalizeResources(payload.content),
      questionCount: payload.question_count ? payload.question_count : 0,
      resourceCount: payload.resource_count ? payload.resource_count : 0,
      sequence: payload.sequence_id,
      thumbnailUrl: thumbnailUrl
      // TODO Add more required properties here...
    });
  },

  normalizeResources: function(payload) {
    const serializer = this;
    if (Ember.isArray(payload)) {
      return payload.map(function(item) {
        if (item.content_format === 'resource') {
          return serializer.get('resourceSerializer').normalizeReadResource(item);
        } else {
          return serializer.get('questionSerializer').normalizeReadQuestion(item);
        }
      });
    }
    return [];
  }

});
