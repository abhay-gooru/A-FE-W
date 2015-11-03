import Ember from "ember";

/**
 * @typedef {object} Index Controller
 */
export default Ember.Controller.extend({

  /**
   * Selected grades items
   * @property {array}
   */
  selectedGrades: null,

  /**
   * Selected subject item
   * @property {array}
   */
  selectedSubjects: null,

  /**
   * Error message displayed when click Browse Content button
   * @property {}
   */
  errorMessage:null,

  /**
   * @property {[]} subjects
   * @see setupController at routes/index.js
   */
  subjects: null,

  /**
   * @property {[]} grades
   * @see setupController at routes/index.js
   */
  grades: null,

  /**
   * @property {[]} standards
   * @see setupController at routes/index.js
   */
  standards: null,

  /**
   * Validate if selectedGrades is null or empty
   * @property
   */
  isEmptyGrades : Ember.computed.empty("selectedGrades"),
  /**
   * Validate if selectedSubject is null or empty
   * @property
   */
  isEmptySubjects : Ember.computed.empty("selectedSubjects"),

  actions: {

    /**
     * Triggered when a subject selection changes
     * @param {DropdownItem[]} items
     */
    onSubjectChange: function(items){
      this.set("selectedSubjects",items);
    },

    /**
     * Triggered when a standard selection changes
     * @param {DropdownItem} item
     */
    onStandardSelected: function(item){
      console.debug(item);

    },

    /**
     * Triggered when grade selection changes
     * @param {DropdownItem} item
     */

    onGradeSelected: function(items){
      this.set("selectedGrades",items);
    },
    /**
     * Triggered when click browseContent button
     * @param {}
     */
    onbrowseContentClick:function(){
      const controller = this;
      const i18n = this.get('i18n');

      var gradeId, subjectId;

        if(controller.get("isEmptyGrades")){
          controller.set("errorMessage", i18n.t("index.browseContent.grades_missing_message"));
        }else{
          controller.set("errorMessage",null);
          if(controller.get("isEmptySubjects")){
            controller.set("errorMessage", i18n.t("index.browseContent.subjects_missing_message"));
          }else{
            controller.set("errorMessage",null);
            gradeId = controller.get("selectedGrades").map(function (item) {
              return item.get("id");
            });
            subjectId = controller.get("selectedSubjects").map(function (item) {
              return item.get("id");
            });
            controller.transitionToRoute('/search/collections?gradeIds=' +gradeId+"&subjectsId="+subjectId);
          }}
        }
  }

});
