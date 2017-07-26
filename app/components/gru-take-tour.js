import Ember from "ember";
import ConfigurationMixin from 'gooru-web/mixins/configuration';
/**
 * Take a tour
 *
 * Component responsible for taking a tour
 */

var introJS = window.introJs;
const INTRO_JS_OPTIONS = Ember.A([
  "nextLabel",
  "prevLabel",
  "skipLabel",
  "doneLabel",
  "tooltipPosition",
  "tooltipClass",
  "highlightClass",
  "exitOnEsc",
  "exitOnOverlayClick",
  "showStepNumbers",
  "showStepNumbers",
  "keyboardNavigation",
  "showButtons",
  "showBullets",
  "showProgress",
  "scrollToElement",
  "overlayOpacity",
  "disableInteraction"
]);

export default Ember.Component.extend(ConfigurationMixin, {

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @dependency service:i18n
   */
  i18n: Ember.inject.service(),


  // -------------------------------------------------------------------------
  // Attributes
  tagName: ['span'],

  classNames:['gru-take-tour','hidden-xs','hidden-sm'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    /**
     * Action triggered when the start tour button is clicked
     */
    startTour: function(){
      let component = this;
      let intro = component.get('introJS');
      let options = component.get('introJSOptions');

      intro.setOptions(options);
      component.registerCallbacksWithIntroJS();
      component._setCurrentStep(0);
      $('.application').addClass('no-vertical-scroll');
      intro.start();
      $('.introjs-skipbutton').hide();
      $('.introjs-prevbutton').hide();
    }
  },

  // -------------------------------------------------------------------------
  // Events
  init() {
    this._super(...arguments);
    this.set("introJS",introJS());
  },

  // -------------------------------------------------------------------------
  // Properties

  introJSOptions: Ember.computed(
    "nextLabel",
    "prevLabel",
    "skipLabel",
    "doneLabel",
    "tooltipPosition",
    "tooltipClass",
    "highlightClass",
    "exitOnEsc",
    "exitOnOverlayClick",
    "showStepNumbers",
    "showStepNumbers",
    "keyboardNavigation",
    "showButtons",
    "showBullets",
    "showProgress",
    "scrollToElement",
    "overlayOpacity",
    "disableInteraction",
    'steps',

    function(){
      let component = this;
      let options = {};
      INTRO_JS_OPTIONS.map(function(option){
        let value = this.get(`${option}`);
        if (value !== null && value !== undefined) {
          options[option] = value;
        }
      },component);

      let array = Ember.A([]);
      component.get('steps').forEach(function(step, index){
        index += 1;
        array.push(Ember.Object.create({
          element:document.querySelector(step.elementSelector),
          intro:component.get('constructModal')(
            step.title,
            step.description,
            step.image,
            `${component.get('containerClass')} step-${index}`)
        }));
      });
      options.steps = array;
      return options;
    }
  ),

  /**
   * @property {string} Defines the tooltip position
   */
  tooltipPosition: 'auto',

  positionPrecedence:  ['right', 'bottom', 'left', 'top'],

  /**
   * @property {boolean} Indicates if the bullets should be displayed
   */
  showBullets: false,

  /**
   * @property {boolean} Indicates if the progress should be displayed
   */
  showProgress: false,

  /**
   * @property {boolean} Indicates if the step number should be displayed
   */
  showStepNumbers: false,

  disableInteraction: true,

  /**
   * @property {boolean} Indicates if the page should scroll to the respective element
   */
  scrollToElement: true,

  /**
   * @property {boolean} Indicates if the user can exit from the tour by pressing Exc
   */
  exitOnEsc: true,

  prevLabel:Ember.computed('i18n', function(){
    return this.get('i18n').t('common.back').string;
  }),

  nextLabel:Ember.computed('i18n', function(){
    return this.get('i18n').t('common.next').string;
  }),

  // -------------------------------------------------------------------------
  // Methods
  constructModal: function(title, description, image, containerClass){
    let template =
      `<div class="tour-header ${containerClass}">
        <h2>${title}</h2>
        <i class="material-icons exit-button">clear</i>
      </div>
      <div class="tour-description-${containerClass}">`;
    if (image !==undefined) {
      template +=
        `<img class=${image}>`;
    }
    template +=
      `<p>${description}</p>
      </div>`;
    return template;
  },

  registerCallbacksWithIntroJS: function(){
    let component = this;
    let intro = component.get('introJS');

    intro.onbeforechange(Ember.run.bind(component, function(elementOfNewStep){

      var prevStep = component.get('currentStep');
      component._setCurrentStep(component.get('introJS._currentStep'));
      var nextStep = component.get('currentStep');
      component.sendAction('on-before-change', prevStep, nextStep, component, elementOfNewStep);

    }));

    intro.onchange(Ember.run.bind(component, function(targetElement){
      component.sendAction('on-change', component.get('currentStep'), component, targetElement);
    }));

    intro.onafterchange(Ember.run.bind(component, component._onAfterChange));

    intro.oncomplete(Ember.run.bind(component, function(){
      component.sendAction('on-complete', component.get('currentStep'));
    }));

    intro.onexit(Ember.run.bind(component, component._onExit));
  },

  _setIntroJS: function(introJS){
    this.set('introJS', introJS);
  },

  _onAfterChange: function(targetElement){
    let component = this;
    let intro = component.get('introJS');
    let currentStepIndex = component.get('steps').indexOf(component.get('currentStep'));
    currentStepIndex += 1;
    let nextElement = $('.introjs-nextbutton');
    let skipElement = $('.introjs-skipbutton');
    let prevElement = $('.introjs-prevbutton');

    //This is for a specific step on the library page tour
    if(component.get('containerClass') === 'library' && currentStepIndex === 2){
      $('body').scrollTop(0);
    }

    if(currentStepIndex === 1){
      prevElement.hide();
    }else{
      prevElement.show();
    }

    if(currentStepIndex === component.get('steps').length){
      nextElement.hide();
      skipElement.show();
      prevElement.show();
    } else if(currentStepIndex === component.get('steps').length-1){
      skipElement.hide();
      nextElement.show();
    }
    $(`.introjs-tooltip`).on('click','.exit-button, .introjs-skipbutton', function(){
      component._onExit();
      intro.exit();
    });
    component.sendAction('on-after-change', component.get('currentStep'), component, targetElement);
  },

  _onExit: function(){
    this.sendAction('on-exit', this.get('currentStep'), this);
    $(`.application`).removeClass('no-vertical-scroll');
  },

  exitIntroJS: Ember.on('willDestroyElement', function(){
    var intro = this.get('introJS');
    if (intro) {
      intro.exit();
    }
  }),

  _setCurrentStep: function(step){
    var stepObject = Ember.A(this.get('steps')).objectAt(step);
    this.set('currentStep', stepObject);
  },

  _getStepIndex: function(step){
    return this.get('steps').indexOf(step);
  }.bind(this)

});
