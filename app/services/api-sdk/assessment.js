import Ember from 'ember';
import AssessmentSerializer from 'gooru-web/serializers/content/assessment';
import AssessmentAdapter from 'gooru-web/adapters/content/assessment';


/**
 * @typedef {Object} AssessmentService
 */
export default Ember.Service.extend({

  /**
   * @property {AssessmentSerializer} assessmentSerializer
   */
  assessmentSerializer: null,

  /**
   * @property {AssessmentAdapter} assessmentAdapter
   */
  assessmentAdapter: null,

  init: function () {
    this._super(...arguments);
    this.set('assessmentSerializer', AssessmentSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('assessmentAdapter', AssessmentAdapter.create(Ember.getOwner(this).ownerInjection()));
  },


  /**
   * Creates a new assessment
   *
   * @param assessmentData object with the assessment data
   * @returns {Promise}
   */
  createAssessment: function(assessmentData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedClassData = service.get('assessmentSerializer').serializeCreateAssessment(assessmentData);
      service.get('assessmentAdapter').createAssessment({
        body: serializedClassData
      }).then(function(responseData, textStatus, request) {
        let assessmentId = request.getResponseHeader('location');
        assessmentData.set('id', assessmentId);
        resolve(assessmentData);
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
   * Gets an Assessment by id
   * @param {string} assessmentId
   * @returns {Promise}
   */
  readAssessment: function(assessmentId){
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('assessmentAdapter').readAssessment(assessmentId)
        .then(function(responseData) {
          resolve(service.get('assessmentSerializer').normalizeReadAssessment(responseData));
        }, reject );
    });
  },

  /**
   * Updates an Assessment
   *
   * @param assessmentId the id of the Assessment to be updated
   * @param assessmentModel the Assessment model with the data
   * @returns {Promise}
   */
  updateAssessment: function(assessmentId, assessmentModel) {
    const service = this;
    let serializedData = service.get('assessmentSerializer').serializeUpdateAssessment(assessmentModel);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('assessmentAdapter').updateAssessment(assessmentId, serializedData).then(resolve, reject);
    });
  },

  /**
   * Adds a question to a specific assessment
   * @param assessmentId
   * @param questionId
   * @returns {Promise}
   */
  addQuestion: function(assessmentId, questionId){
    var service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('assessmentAdapter').addQuestion(assessmentId, questionId)
        .then(resolve, reject);
    });
  },

  /**
   * Delete assessment
   *
   * @param assessmentId The assessment id to delete
   * @returns {Ember.RSVP.Promise}
   */
  deleteAssessment: function (assessmentId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('assessmentAdapter').deleteAssessment(assessmentId)
        .then(resolve, reject);
    });
  }

});
