import Ember from 'ember';
import QuestionComponent from './gru-question';

/**
 * Multiple Answer Question
 *
 * Component responsible for controlling the logic and appearance of a multiple
 * answer question inside of the {@link player/gru-question-viewer.js}
 *
 * @module
 * @see controllers/player.js
 * @see components/player/gru-question-viewer.js
 * @augments Ember/Component
 */
export default QuestionComponent.extend({

  // -------------------------------------------------------------------------
  // Dependencies


  // -------------------------------------------------------------------------
  // Attributes

  classNames:['gru-multiple-answer'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {

    /**
     * When the user changes the answer choice selection
     * @param {string} answerId
     */
    selectAnswerChoice: function(answerId){
      const component = this;
      const questionUtil = component.get("questionUtil");
      component.setUserAnswerChoice(answerId);

      let userSelection = this.get("userSelection").toArray();
      const correct = questionUtil.isCorrect(userSelection);

      component.notifyAnswerChanged(userSelection, correct);

      if (component.isAnswerCompleted()){
        component.notifyAnswerCompleted(userSelection, correct);
      }
    }
  },

  // -------------------------------------------------------------------------
  // Events

  init() {
    this._super( ...arguments );
    this.set('userSelection', Ember.A());
  },


  // -------------------------------------------------------------------------
  // Properties
  /**
   * Convenient structure to render options
   * @property {[]}
   */
  answers: Ember.computed("question.answers", "userAnswer", function(){
    let answers = this.get("question.answers");
    let userAnswer = this.get("userAnswer");
    return answers.map(function(answer){
      var answerId = answer.get("id");
      let choice = userAnswer ? userAnswer.findBy("id", answerId) : null;
      let yesNo = choice && choice.selection ? "yes" : "no";
      return {
        id: answerId,
        text: answer.get("text"),
        groupValue: choice ? `${yesNo}|${answerId}` : null
      };
    });
  }),

  // -------------------------------------------------------------------------
  // Observers


  // -------------------------------------------------------------------------
  // Methods
  /**
   * Indicates when the answer is completed
   * @return {boolean}
   */
  isAnswerCompleted: function(){
    const component = this,
      userSelection = component.get("userSelection"),
      totalAnswerChoices = component.get("question.answers.length");
    return userSelection.get("length") === totalAnswerChoices;
  },

  /**
   * Sets the user answer choice
   * @param {string} answerChoice containing the user selection yes|120202 or no|20200392
   */
  setUserAnswerChoice: function(answerChoice){
    let userSelection = this.get("userSelection");
    let values = answerChoice.split("|");
    let id = values[1];
    let selection = values[0] === "yes";
    let found = userSelection.findBy("id", id);
    if (found){
      found.selection = selection;
    }
    else{
      userSelection.addObject({
        id: id,
        selection: selection
      });
    }

  }

});
