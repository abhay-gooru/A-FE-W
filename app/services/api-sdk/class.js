import Ember from 'ember';
import ClassSerializer from 'gooru-web/serializers/content/class';
import ClassAdapter from 'gooru-web/adapters/content/class';

/**
 * @typedef {Object} ClassService
 */
export default Ember.Service.extend({

  store: Ember.inject.service(),

  session: Ember.inject.service("session"),

  classSerializer: null,

  classAdapter: null,


  init: function () {
    this._super(...arguments);
    this.set('classSerializer', ClassSerializer.create(Ember.getOwner(this).ownerInjection()));
    this.set('classAdapter', ClassAdapter.create(Ember.getOwner(this).ownerInjection()));
  },

  /**
   * Creates a new class
   *
   * @param classData object with the class data
   * @returns {Promise}
   */
  createClass: function(classData) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let serializedClassData = service.get('classSerializer').serializeCreateClass(classData);
      service.get('classAdapter').createClass({
        body: serializedClassData
      }).then(function(responseData, textStatus, request) {
        let classId = request.getResponseHeader('location');
        classData.set('id', classId);
        resolve(classData);
      }, function(error) {
        reject(error);
      });
    });
  },

  /**
   * Update existing class
   *
   * @param classModel The Class model to update
   * @returns {Promise|Content/Class} Class model updated
   */
  updateClass: function (classModel) {
    var service = this;
    var classData = service.get('classSerializer').serializeUpdateClass(classModel);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('classAdapter').updateClass({
        classId: classModel.get('id'),
        "class": classData
      }).then(function () {
        resolve(classModel);
      }, function(error) {
        //TODO: we have to remove this
        console.log(error);
        reject(error);
      });
    });
  },

  /**
   * Join class
   *
   * @param {string} code class code
   * @returns {Promise}
   */
  joinClass: function (code) {
    const service = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      service.get('classAdapter').joinClass(code)
        .then(function (responseData, textStatus, request) {
            let classId = request.getResponseHeader('location');
            resolve(classId);
        },
        function (error) { //handling server errors
          const status = error.status;
          if (status === 400) {
              reject({status: status, code: 'restricted'});
          }
          else if (status === 404) {
              reject({status: status, code: 'not-found'});
          }
          else {
            reject(error);
          }
        });
    });
  },

  /**
   * Return the list of classes related to a user
   * @property {Profile} profile the owner of classes
   * @returns {RSVP.Promise}
   */
  findMyClasses: function(profile) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('classAdapter').getMyClasses()
          .then(function(response) {
            var classesModel = service.get('classSerializer').normalizeClasses(response);
            if (profile) {
              Ember.$.each(classesModel.get("classes"), function(index, aClass){
                //when it has no owner we asume is the provided profile
                if (!aClass.get("owner")){
                  aClass.set("owner", profile);
                }
              });
            }
            resolve(classesModel);
          }, function(error) {
            reject(error);
          });
    });
  },

  /**
   * Reads class information for a specified class ID
   * @param classId the class id to read
   * @returns {Promise}
   */
  readClassInfo: function(classId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('classAdapter').readClassInfo(classId)
        .then(function(response) {
          resolve(service.get('classSerializer').normalizeReadClassInfo(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  /**
   * Gets the members, collaborators, invitees and owner for a specified class ID
   * @param classId the class id to read
   * @returns {Promise}
   */
  readClassMembers: function(classId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('classAdapter').readClassMembers(classId)
        .then(function(response) {
          resolve(service.get('classSerializer').normalizeReadClassMembers(response));
        }, function(error) {
          reject(error);
        });
    });
  },

  /**
   * Gets the class report status for an archived class
   * @param {string} classId the class id
   * @param {string} courseId the course id
   * @returns {Promise.<string>} available|queued|in-progress
   */
  readClassReportStatus: function(classId, courseId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('classAdapter').readClassReportStatus(classId, courseId)
        .then(function(response) {
          resolve(response.status);
        }, function(error) {
          reject(error);
        });
    });
  },

  /**
   * Requests a class report
   * @param {string} classId the class id
   * @param {string} courseId the course id
   * @returns {Promise.<string>} available|queued|in-progress
   */
  requestClassReport: function(classId, courseId) {
    const service = this;
    return service.readClassReportStatus(classId, courseId).then(function(response){
      service.storeClassReportStatus(classId, response);
      return response;
    }); //same end point as reading the status
  },

  /**
   * Save the request report status in storage
   * @param {string} classId the class id
   * @param {string} status status for the class
   */
  storeClassReportStatus: function(classId, status) {
    const localStorage = this.getLocalStorage();
    const userId = this.get("session.userId");
    if (localStorage) {
      const reportInfo = JSON.parse(localStorage.getItem("report-info") || "{}");
      const userInfo = reportInfo[userId] || { classes: {} };
      userInfo.classes[classId] = status;

      reportInfo[userId] = userInfo;
      localStorage.setItem("report-info", JSON.stringify(reportInfo));
    }
  },

  /**
   * Gets the class report status info from storage
   * @param userId
   * @returns { * } { 'abcd-1234' : 'available', 'adfc-1223': 'queued' }
   */
  getReportClassesStatusFromStore: function (userId) {
    const localStorage = this.getLocalStorage();
    if (localStorage) {
      const reportInfo = JSON.parse(localStorage.getItem("report-info") || "{}");
      const userInfo = reportInfo[userId] || { classes: {} };
      return userInfo.classes;
    }
    return null;
  },

  /**
   * Returns the local storage
   * @returns {Storage}
   */
  getLocalStorage: function(){
    return window.localStorage;
  },

  /**
   * Associates a Course with a Class
   *
   * @param classId the class id
   * @param courseId the course id
   * @returns {Promise}
   */
  associateCourseToClass: function(courseId, classId) {
    const service = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      service.get('classAdapter').associateCourseToClass(courseId, classId)
        .then(resolve, reject);
    });
  },

  // TODO These method will be removed once we have full integration with API 3.0

  /**
   * Returns the list of the classes the user is joined (as student).
   * @param {Object} options request options, like limit, offset, etc
   * @returns {Promise.<Class[]>}
   */
  findClassesIJoined: function (options = {}) {
    return this.get('store').queryRecord('class/class', {
      isStudent: true,
      limit: (options.limit ? options.limit : -1),
      offset: (options.offset ? options.offset : 0)
    });
  },

  /**
   * Returns the list of classes the user teach (as teacher)
   * @param {Object} options request options, like limit, offset, etc
   * @returns {Promise.<Class[]>}
   */
  findClassesITeach: function (options = {}) {
    return this.get('store').queryRecord('class/class', {
      limit: (options.limit ? options.limit : -1),
      offset: (options.offset ? options.offset : 0),
      'flt.exclude.empty.course': (options['flt.exclude.empty.course'] ? options['flt.exclude.empty.course'] : false)
    });
  },

  /**
   * Returns a class by id
   * @param {string} id
   * @returns {Promise.<Class>}
   */
  findById: function (id) {
    return this.get('store').findRecord('class/class', id);
  }

});
