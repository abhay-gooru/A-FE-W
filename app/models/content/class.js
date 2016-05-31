import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  title: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.class-title-presence'
      })
    ]
  },
  classSharing: validator('presence', true)
});

/**
 * CLass model
 * typedef {Object} Class
 */
const Class = Ember.Object.extend(Validations, {
  /**
   * @property {String} id - The profile id
   */
  id: null,

  /**
   * //TODO is this the same as owner?
   * @property {String} creatorId - The id of the creator
   */
  creatorId: null,

  /**
   * @property {String} Title of the class
   */
  title: null,

  /**
   * @property {String} Description for class
   */
  description: null,

  /**
   * @property {String} Greetings for class
   */
  greeting: null,

  /**
   * @property {Number[]} Grade for class
   */
  grade: [],

  /**
   * @property  {String} Sharing type of the class. Either “open” or “restricted”
   */
  classSharing: null,

  /**
   * @property {String} Path to the cover image of the class
   */
  coverImage: null,

  /**
   * @property {String} code - The class code
   */
  code: null,

  /**
   * @property {String} Minimum score for class.
   */
  minScore: null,

  /**
   * @property {Date} Start date of class
   */
  startDate: null,

  /**
   * @property {Date} End date of class
   */
  endDate: null,

  /**
   * @property {String} courseId - The course id of the class
   */
  courseId: null,

  /**
   * @property {String} Creator name
   */
  creatorSystem: null,

  /**
   * @property {Profile} Owner information
   */
  owner: null,

  /**
   * @property {Profile[]} Collaborators on class
   */
  collaborators: [],

  /**
   * @property {Object[]} Members on class
   */
  members: [],

  /**
   * @property {String} stateId - The class content visibility
   */
  contentVisibility: null,

  /**
   * @property {Boolean} isArchived - Is the class archived?
   */
  isArchived: false,

  /**
   * @property {Number} Computed property that counts the number of members in the class
   */
  countMembers: Ember.computed('members', function() {
    return this.get('members.length');
  }),

  /**
   * @property {Number} Computed property that counts the number of teachers in the class
   */
  countTeachers: Ember.computed('owner', 'collaborators', function() {
    return 1 /* owner */ + this.get('collaborators.length');
  }),

  teachers: Ember.computed('owner', 'collaborators', function() {
    let teachers = [];
    if (this.get('owner')) {
      teachers.push(this.get('owner'));
    }
    return teachers.pushObjects(this.get('collaborators'));
  }),

  /**
   * This property is only used by archived classes, it indicates the status of the archived class report
   * This information is not available when retrieving a class form the BE, separate calls are required to
   * load this information, @see services/api-sdk/class.js#readClassReportStatus
   *
   * @property {string} available|queued|in-progress
   */
  reportStatus: null,

  /**
   * @property {boolean}
   */
  isReportAvailable: Ember.computed.equal("reportStatus", "available"),

  /**
   * @property {boolean}
   */
  isReportNotAvailable: Ember.computed.not("courseId"),

  /**
   * @property {boolean}
   */
  isReportRequested: Ember.computed.equal("reportStatus", "queued"),

  /**
   * @property {boolean}
   */
  isReportInProgress: Ember.computed("reportStatus", function(){
    return this.get("isReportRequested") || this.get("reportStatus") === "in-progress";
  }),

  /**
   * @property {boolean}
   */
  canRequestReport: Ember.computed("reportStatus", function(){
    const couldBeAvailable = !this.get("isReportNotAvailable");
    return couldBeAvailable && !this.get("isReportInProgress") && !this.get("isReportAvailable");
  }),

  // -------------------
  // Methods
  /**
   * Verifies if the passed id corresponds to a student in the class
   * @param studentId the student id to search
   * @returns {Boolean} returns true if is a student, otherwise undefined
   */
  isStudent: function(studentId) {
    return !this.isTeacher(studentId);
  },

  /**
   * Verifies if the passed id corresponds to a teacher in the class
   * @param teacherId the teacher id to search
   * @returns {Boolean} returns true if is a teacher, otherwise undefined
   */
  isTeacher: function(teacherId) {
    return (this.get('owner.id') === teacherId || this.get('collaborators').findBy('id', teacherId));
  },

  /**
   * Return a copy of the class
   *
   * @function
   * @return {Class}
   */
  copy: function () {

    var properties = [];
    var enumerableKeys = Object.keys(this);

    for (let i = 0; i < enumerableKeys.length; i++) {
      let key = enumerableKeys[i];
      let value = Ember.typeOf(this.get(key));
      if (value === 'string' || value === 'number' || value === 'boolean') {
        properties.push(key);
      }
    }

    properties = this.getProperties(properties);

    return this.get('constructor').create(Ember.getOwner(this).ownerInjection(), properties);
  },

  /**
   * Copy a list of property values from another model to override the current ones
   *
   * @function
   * @param {Class} model
   * @param {String[]} propertyList
   * @return {null}
   */
  merge: function(model, propertyList = []) {
    var properties = model.getProperties(propertyList);
    this.setProperties(properties);
  }

});

export default Class;
