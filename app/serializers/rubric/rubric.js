import Ember from 'ember';
import ConfigurationMixin from 'gooru-web/mixins/configuration';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';
import { cleanFilename, nullIfEmpty } from 'gooru-web/utils/utils';
import Rubric from 'gooru-web/models/rubric/rubric';
import RubricCategory from 'gooru-web/models/rubric/rubric-category';
import GradeQuestion from 'gooru-web/models/rubric/grade-question';
import GradeQuestionItem from 'gooru-web/models/rubric/grade-question-item';
import GradeQuestionStudents from 'gooru-web/models/rubric/grade-question-students';
import GradeQuestionAnswer from 'gooru-web/models/rubric/grade-question-answer';
import { DEFAULT_IMAGES } from 'gooru-web/config/config';

/**
 * Serializer to support the Rubric CRUD operations
 *
 * @typedef {Object} RubricSerializer
 */
export default Ember.Object.extend(ConfigurationMixin, {
  session: Ember.inject.service('session'),

  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Serializes a Rubric/Rubric object into a JSON representation required by the Create rubric endpoint
   *
   * @param {Rubric} model - The rubric model to be serialized
   * @returns {Object} JSON Object representation of the rubric model
   */
  serializeCreateRubric: function(model) {
    const serializer = this;
    return {
      title: model.get('title'),
      description: model.get('description'),
      type: model.get('type'),
      is_rubric: true,
      thumbnail: cleanFilename(
        model.get('thumbnail'),
        this.get('session.cdnUrls')
      ),
      metadata: model.get('hasAudience')
        ? { audience: model.get('audience') }
        : null,
      taxonomy: serializer
        .get('taxonomySerializer')
        .serializeTaxonomy(model.get('standards'))
    };
  },

  /**
   * Serialize a Rubric Off object into a JSON representation required by the Create Rubric Off endpoint
   *
   * @param rubricOffModel The Rubric Off model to be serialized
   * @returns {Object} returns a JSON Object
   */
  serializeCreateRubricOff: function(rubricOffModel) {
    return this.serializeRubricOff(rubricOffModel);
  },

  serializeRubricOff: function(rubricOffModel) {
    let serializedRubricOff = {
      is_rubric: false,
      overall_feedback_required: rubricOffModel.get('requiresFeedback'),
      feedback_guidance: rubricOffModel.get('feedback'),
      scoring: rubricOffModel.get('scoring'),
      max_score: rubricOffModel.get('maxScore'),
      increment: rubricOffModel.get('increment'),
      grader: rubricOffModel.get('grader')
        ? rubricOffModel.get('grader')
        : 'Teacher'
    };
    return serializedRubricOff;
  },

  /**
   * Serializes a Rubric/Rubric object into a JSON representation required by the update rubric endpoint
   *
   * @param {Rubric} model - The rubric model to be serialized
   * @returns {Object} JSON Object representation of the rubric model
   *
   */
  serializeUpdateRubric: function(model) {
    const serializer = this;
    if (model.get('rubricOn')) {
      const url = model.get('uploaded')
        ? cleanFilename(model.get('url'), this.get('session.cdnUrls'))
        : model.get('url');
      return {
        title: nullIfEmpty(model.get('title')),
        description: nullIfEmpty(model.get('description')),
        thumbnail: cleanFilename(
          model.get('thumbnail'),
          this.get('session.cdnUrls')
        ),
        metadata: model.get('hasAudience')
          ? { audience: model.get('audience') }
          : null,
        taxonomy: serializer
          .get('taxonomySerializer')
          .serializeTaxonomy(model.get('standards')),
        url: nullIfEmpty(url),
        is_remote: !!model.get('uploaded'),
        feedback_guidance: nullIfEmpty(model.get('feedback')),
        overall_feedback_required: !!model.get('requiresFeedback'),
        categories: model.get('categories').length
          ? model.get('categories').map(function(category) {
            return serializer.serializedUpdateRubricCategory(category);
          })
          : null
      };
    } else {
      return {
        feedback_guidance: nullIfEmpty(model.get('feedback')),
        overall_feedback_required: !!model.get('requiresFeedback'),
        scoring: model.get('scoring'),
        max_score: model.get('maxScore'),
        increment: model.get('increment')
      };
    }
  },

  /**
   * Serializes a rubric category
   * @param {RubricCategory} model
   * @returns {*} serialized category
   */
  serializedUpdateRubricCategory: function(model) {
    let levels = model.get('levels').filter(level => level.name || level.score);

    return {
      category_title: nullIfEmpty(model.get('title')),
      feedback_guidance: nullIfEmpty(model.get('feedbackGuidance')),
      required_feedback: model.get('requiresFeedback') === true,
      level: model.get('allowsLevels') === true,
      scoring: model.get('allowsScoring') === true,
      levels: levels.map(level => ({
        level_name: level.name,
        level_score: level.score
      }))
    };
  },

  /**
   * Serializes a RubricGrade/RubricGrade object into a JSON representation required by the endpoint
   *
   * @param {RubricGrade} model - The rubric grade model to be serialized
   * @returns {Object} JSON Object representation of the rubric grade model
   *
   */
  serializeStudentRubricGrades: function(model) {
    const serializer = this;
    return {
      event_name: model.get('eventName'),
      rubric_id: model.get('id'),
      title: nullIfEmpty(model.get('title')),
      description: nullIfEmpty(model.get('description')),
      student_id: nullIfEmpty(model.get('studentId')),
      class_id: nullIfEmpty(model.get('classId')),
      course_id: nullIfEmpty(model.get('courseId')),
      unit_id: nullIfEmpty(model.get('unitId')),
      lesson_id: nullIfEmpty(model.get('lessonId')),
      collection_id: nullIfEmpty(model.get('collectionId')),
      session_id: nullIfEmpty(model.get('sessionId')),
      resource_id: nullIfEmpty(model.get('resourceId')),
      learner_score: model.get('learnerScore'),
      max_score: model.get('maxScore'),
      overall_comment: model.get('comment'),
      category_score: model.get('categoriesScore').length
        ? model.get('categoriesScore').map(function(category) {
          return serializer.serializedStudentGradeCategoryScore(category);
        })
        : null
    };
  },

  /**
   * Serializes a student grade category score
   * @param {GradeCategoryScore} model
   * @returns {*} serialized category score
   */
  serializedStudentGradeCategoryScore: function(model) {
    return {
      category_title: nullIfEmpty(model.get('title')),
      level_obtained: nullIfEmpty(model.get('levelObtained')),
      level_score: model.get('levelScore'),
      level_max_score: model.get('levelMaxScore'),
      level_comment: nullIfEmpty(model.get('levelComment'))
    };
  },

  /**
   * Normalizes an array of rubrics
   *
   * @param payload endpoint response format in JSON format
   * @returns {Rubric[]}
   */
  normalizeGetRubrics: function(payload) {
    const serializer = this;
    if (payload && Ember.isArray(payload.rubrics)) {
      return payload.rubrics.map(function(rubric) {
        return serializer.normalizeRubric(rubric);
      });
    } else {
      return [];
    }
  },

  /**
   * Normalizes a rubric
   * @param {*} data
   * @return {Rubric}
   */
  normalizeRubric: function(data, owners) {
    if (data) {
      const serializer = this;
      const metadata = data.metadata || {};
      const ownerId = data.creator_id;
      const filteredOwners = Ember.A(owners).filterBy('id', ownerId);
      const categories = data.categories;
      const basePath = serializer.get('session.cdnUrls.content');
      const appRootPath = this.get('appRootPath'); //configuration appRootPath
      const thumbnailUrl = data.thumbnail
        ? basePath + data.thumbnail
        : appRootPath + DEFAULT_IMAGES.RUBRIC;
      const url =
        data.url && data.is_remote ? basePath + data.url : data.url || null;

      return Rubric.create(Ember.getOwner(this).ownerInjection(), {
        id: data.id,
        title: data.title,
        description: data.description,
        thumbnail: thumbnailUrl,
        standards: serializer
          .get('taxonomySerializer')
          .normalizeTaxonomyObject(data.taxonomy),
        audience: metadata.audience,
        url: url,
        isPublished: data.publishStatus === 'published',
        publishDate: data.publish_date,
        rubricOn: data.is_rubric,
        uploaded: data.is_remote,
        feedback: data.feedback_guidance,
        requiresFeedback: data.overall_feedback_required,
        maxScore: data.max_score,
        increment: data.increment,
        scoring: data.scoring,
        categories: categories
          ? categories.map(category =>
            serializer.normalizeRubricCategory(category)
          )
          : Ember.A(),
        owner: filteredOwners.get('length')
          ? filteredOwners.get('firstObject')
          : ownerId,
        createdDate: data.created_at,
        updatedDate: data.updated_at,
        tenant: data.tenant
      });
    }
  },

  /**
   * Normalizes a rubric category
   * @param {*} data
   * @return {RubricCategory}
   *
   */
  normalizeRubricCategory(data) {
    const levels = data.levels || [];
    return RubricCategory.create(Ember.getOwner(this).ownerInjection(), {
      title: data.category_title,
      feedbackGuidance: data.feedback_guidance,
      requiresFeedback: data.required_feedback,
      allowsLevels: data.level === true,
      allowsScoring: data.scoring === true,
      levels: levels.map(function(level) {
        return { name: level.level_name, score: level.level_score };
      })
    });
  },

  /**
   * Normalizes Questions To Grade
   * @param {*} data
   * @return {GradeQuestion}
   */
  normalizeQuestionsToGrade: function(data) {
    const serializer = this;
    const gradeItems = data.gradeItems;

    return GradeQuestion.create(Ember.getOwner(this).ownerInjection(), {
      classId: data.classId,
      courseId: data.courseId,
      userId: data.userId,
      gradeItems: gradeItems
        ? gradeItems.map(item => serializer.normalizeGradeQuestion(item))
        : null
    });
  },

  /**
   * Normalizes a grade question
   * @param {*} data
   * @return {GradeQuestionItem}
   *
   */
  normalizeGradeQuestion(data) {
    return GradeQuestionItem.create(Ember.getOwner(this).ownerInjection(), {
      unitId: data.unitId,
      lessonId: data.lessonId,
      collectionId: data.collectionId,
      resourceId: data.resourceId,
      studentCount: data.studentCount
    });
  },

  /**
   * Normalizes Students for a Question to be graded
   * @param {*} data
   * @return {GradeQuestionStudents}
   */
  normalizeStudentsForQuestion: function(data) {
    const students = data.students;

    return GradeQuestionStudents.create(Ember.getOwner(this).ownerInjection(), {
      students: students ? students : null
    });
  },

  /**
   * Normalizes Answer for Rubric Grading
   * @param {*} payload
   * @return {GradeQuestionAnswer}
   */
  normalizeAnswerToGrade: function(payload) {
    return GradeQuestionAnswer.create(Ember.getOwner(this).ownerInjection(), {
      courseId: payload.courseId,
      unitId: payload.unitId,
      lessonId: payload.lessonId,
      collectionId: payload.collectionId,
      questionId: payload.questionId,
      sessionId: payload.sessionId,
      questionText: payload.questionText,
      answerText: payload.answerText,
      submittedAt: payload.submittedAt,
      timeSpent: payload.timeSpent,
      userId: payload.userId
    });
  }
});
