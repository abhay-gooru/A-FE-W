import Ember from 'ember';
import { SUGGESTION_TYPE } from 'gooru-web/config/config';
import PlayerController from 'gooru-web/controllers/player';


/**
 * Study Player Controller
 *
 * @module
 * @augments ember/PlayerController
 */
export default PlayerController.extend({

  actions: {
    /**
     * Action triggered when the performance information panel is expanded/collapsed
     */
    toggleHeader: function (toggleState) {
      this.set('toggleState', toggleState);
    },
    /**
     * If the user want to continue playing the collection
     */
    playActualCollection:function(){
      this.set('isLesson', false);
      this.set('courseStarted', true);
      this.set('showConfirmation', !this.get('isLesson') && !(this.get('collection.isCollection') || this.get('isAnonymous') || this.get('isTeacher')));
      this.set('showSuggestion',false);
    }
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * Shows the performance information
   * @property {Boolean} toggleState
   */
  toggleState: true,

  /**
   * Indicate if show pre test suggestion
   * @property {Boolean} showSuggestion
   */
  showSuggestion:Ember.computed('isLesson','courseStarted', function(){
    return this.get('isLesson') || !this.get('courseStarted') ;
  }),
  /**
   * Pre test suggestion
   * @property {String} typeSuggestion
   */
  typeSuggestion: SUGGESTION_TYPE.pre_T,

  /**
   * Shows the breadcrumbs info of the collection
   * @property {Array[]}
   */
  breadcrumbs: Ember.computed('collection', 'lesson', 'unit', function() {
    let unit = this.get('unit');
    let lesson = this.get('lesson');
    let collection = this.get('collection');
    let titles = Ember.A([]);

    if (unit) {
      titles.push(unit.get('title'));
    }
    if (lesson) {
      titles.push(lesson.get('title'));
    }
    if (collection) {
      titles.push(collection.get('title'));
    }
    return titles;
  })
});
