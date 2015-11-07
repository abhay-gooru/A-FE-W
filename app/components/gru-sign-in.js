import Ember from "ember";
import ModalMixin from '../mixins/modal';

export default Ember.Component.extend(ModalMixin, {

  // -------------------------------------------------------------------------
  // Dependencies

  /**
   * @property {Service} Session service
   */
  sessionService: Ember.inject.service("api-sdk/session"),

  // -------------------------------------------------------------------------
  // Attributes

  classNames:['gru-sign-in'],

  classNameBindings: ['component-class'],

  // -------------------------------------------------------------------------
  // Actions

  actions: {

    authenticate: function() {
      var _this = this;

      this.get("sessionService")
        .signInWithUser(this.get("credentials"))
        .then(function() {
          // Close the modal
          _this.triggerAction({
            action: 'closeModal'
          });
          // Trigger action in parent
          _this.triggerAction({
            action: 'signIn',
            target: _this.get('target')
          });
        })
        .catch((reason) => {
          _this.set("errorMessage", reason.error);
        });
    }

  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {string} authentication error message
   */
  errorMessage: null,

  /**
   * Object with credentials for signing in
   *
   * @type {Ember.Object}
   */
  credentials: Ember.Object.create({
    username: null,
    password: null
  }),

  /**
   * Class handling the actions from the component.
   * This value will be set on instantiation by gru-modal.
   *
   * @type {Ember.Component}
   * @private
   */
  target: null


});
