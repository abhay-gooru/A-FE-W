import Ember from 'ember';
import StoreMixin from '../../mixins/store';

export default Ember.Service.extend(StoreMixin, {

  /**
   * Creates a new empty user model
   * @returns {User}
   */
  newUser: function() {
    return this.get('store').createRecord('user/user');
  },

  /**
   * Save the user model remotely (using gooru endpoint)
   * @param userModel
   * @returns {Promise}
   */
  save: function(userModel) {
    return userModel.save();
  },

  /**
   * Checks if the username was already taken
   * @param username
   * @returns {*}
   */
  checkUsernameAvailability: function(username){
  	return this.get('store').queryRecord('user/availability', {
      keyword: username,
      isUsername: true
    });
  },

  /**
   * Checks if the email was already taken
   * @param email
   * @returns {*}
   */
  checkEmailAvailability:function(email){
    return this.get('store').queryRecord('user/availability', {
      keyword: email,
      isUsername: false
    });
  },

  /**
   * Returns a list of members enrolled in a class
   * @param classId the class Id
   * @returns {*}
   */
  findMembersByClass: function (classId) {
    return this.get('store').queryRecord('user/user', {
      isMembersByClass: true,
      classId: classId
    });
  }

});
