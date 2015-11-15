import Ember from 'ember';

export default Ember.Component.extend({

  /**
   * @property {array} Collection results for the search
   */
  collectionResults: null,

  /**
   * @property {array} Term used to search
   */
  term: '',

  /**
   * @property {string} on content player action
   */
  onOpenContentPlayer: "onOpenContentPlayer",


  /**
   * DidInsertElement ember event
   */
  didInsertElement: function() {
      var component = this;
      component.$('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
  },
  actions:{

    /**
     * Action triggered to open the content player
     * @param {string} gooruOid collection identifier
     */
    openContentPlayer: function(gooruOid) {
      this.sendAction("onOpenContentPlayer", gooruOid);
    }
  }
});
