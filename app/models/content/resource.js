import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import PlayerResource from 'gooru-web/models/resource/resource';

const Validations = buildValidations({
  description: {
    validators: [
      validator('length', {
        max: 500,
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-description-length'
      })
    ]
  },
  format: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-missing-type'
      })
    ]
  },
  title: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-missing-title'
      }),
      validator('length', {
        max: 50,
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-title-length'
      })
    ]
  },
  url: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-missing-url'
      }),
      validator('format', {
        type: 'url',
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-invalid-url'
      }),
      validator('host', {
        message: '{{description}}',
        descriptionKey: 'common.errors.resource-same-host-url',
        location: window.location.hostname
      })
    ]
  }
});

/**
 * Resource model
 *
 * @typedef {Object} Resource
 */
const ResourceModel = Ember.Object.extend(Validations,{


  /**
   * @property {Number} id
   */
  id: 0,

  /**
   * @property {String} url
   */
  url: null,

  /**
   * @property {String} assetUrl
   * TODO: Remove this once API 3.0 integration is completed
   */
  assetUrl: Ember.computed.alias('url'),

  /**
   * @property {String} thumbnailUrl
   */
  thumbnailUrl: null,

  /**
   * @property {Boolean} isEditing
   */
  isEditing: false,

  /**
   * @property {string}
   */
  format: null,

  /**
   * @property {string}
   */
  title: null,

  /**
   * @property {string}
   */
  description: null,

  /**
   * @property {string} published|unpublished|requested
   */
  publishStatus: null,

  /**
   * @property { Content/User }
   */
  owner: null,

  /**
   * @property {Boolean} isPublic
   */
  isPublic: Ember.computed.equal("publishedStatus", "published"),

  /**
   * @property { { code: string, description: string }[] }
   */
  standards: null,

  /**
   * @property {JSONObject}
   */
  metadata: null,

  /**
   * @property {String} Indicates the resource type. i.e video/youtube, assessment-question, image/png
   */
  resourceType: Ember.computed('format', function() {
    let format = this.get('format');
    let resourceUrl = this.get('url');
    let youtubePattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    let vimeoPattern = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
    let resourceType = 'resource/url'; // Default type
    if (resourceUrl) {
      switch (format) {
        case 'audio':
        case 'interactive':
        case 'webpage':
          resourceType = 'resource/url'; // Default type
          break;
        case 'image':
          resourceType = 'image';
          break;
        case 'text':
          resourceType = 'handouts';
          break;
        case 'video':
          if (youtubePattern.test(resourceUrl)) {
            resourceType = 'video/youtube';
          } else if (vimeoPattern.test(resourceUrl)) {
            resourceType = 'vimeo/video';
          } else {
            resourceType = 'resource/url';
          }
          break;
        default:
          resourceType = 'resource/url'; // Default type
      }
    }
    return resourceType;
  }),

  /**
   * Return a copy of the resource
   *
   * @function
   * @return {Resourse}
   */
  copy: function() {

    var properties = [];
    var enumerableKeys = Object.keys(this);

    for (let i = 0; i < enumerableKeys.length; i++) {
      let key = enumerableKeys[i];
      let value = Ember.typeOf(this.get(key));
      if (value === 'string' || value === 'number' || value === 'boolean') {
        properties.push(key);
      }
    }

    // Copy the resource data
    properties = this.getProperties(properties);

    let standards = this.get('standards');
    let metadata = this.get('metadata');

    // Copy standards and metadata values
    properties.standards = standards.slice(0);
    properties.metadata = JSON.parse(JSON.stringify(metadata));

    return ResourceModel.create(Ember.getOwner(this).ownerInjection(), properties);
  },

  /**
   * Returns a player resource
   * @return {Resource}
   */
  toPlayerResource: function(){
    const model = this;
    return PlayerResource.create({
      id: model.get("id"),
      order: model.get("order"),
      title: model.get("title"),
      resourceType: model.get("resourceType"),
      resourceFormat: model.get("format"),
      description: model.get("description"),
      thumbnail: model.get("thumbnailUrl"),
      assetUrl: model.get("assetUrl"),
      url: model.get("url"),
      narration: model.get("narration"), //TODO missing
      options: null //TODO missing
    });
  }



});

ResourceModel.reopenClass({

  /**
   * Serializes the resource format to be API compliant
   * @param format
   * @returns {string}
   * TODO move to util
   */
  serializeResourceFormat: function (format) {
    return format ? `${format}_resource` : undefined;
  },

  /**
   * Converts several app format values to api values
   * @param {string[]} values values to format
   * TODO move to util
   */
  serializeAllResourceFormat: function(values){
    const model = this;
    return values.map(function(format){
      return model.serializeResourceFormat(format);
    });
  },


  /**
   * Normalizes the resource format to be App compliant
   * @param format
   * @returns {string}
   * TODO move to util
   */
  normalizeResourceFormat: function (format) {
    return format ? format.split("_")[0] : undefined;// i.e video_resource to video
  }
});

export default ResourceModel;
