import Ember from 'ember';

import UserResourcesResult from 'gooru-web/models/result/user-resources';
import ResourceResult from 'gooru-web/models/result/resource';
import QuestionResult from 'gooru-web/models/result/question';
import AnswerObject from 'gooru-web/utils/question/answer-object';
import LearningTarget from 'gooru-web/models/result/learning-target';
import { getQuestionUtil } from 'gooru-web/config/question';
import { toLocal } from 'gooru-web/utils/utils';

export default Ember.Object.extend({
  normalizeResponse: function(payload) {
    var realTimeModel = [];
    this.normalizeUserResults(realTimeModel, payload.content);
    return realTimeModel;
  },

  normalizeUserResults: function(model, payload) {
    const serializer = this;
    payload.forEach(function(userResult) {
      this.push(serializer.normalizeUserResult(userResult));
    }, model);
  },

  normalizeUserResult: function(payload) {
    const serializer = this;
    let usageData = payload.usageData;
    if (usageData === undefined) {
      usageData = payload.questions;
      if (usageData === undefined) {
        usageData = payload.resources;
      }
    }
    return UserResourcesResult.create({
      user: payload.userUid,
      isAttemptFinished: !!payload.isCompleteAttempt, // This value is used only by the RealTime dashboard
      resourceResults: serializer.normalizeResourceResults(usageData)
    });
  },

  normalizeResourceResults: function(payload) {
    const serializer = this;
    var resourceResults = [];
    payload.forEach(function(resourceResult) {
      this.push(serializer.normalizeResourceResult(resourceResult));
    }, resourceResults);
    return resourceResults;
  },

  normalizeResourceResult: function(payload) {
    let qtype = payload.questionType;
    if (qtype === 'unknown') {
      qtype = payload.resourceType;
    }
    let answerObjects = this.normalizeAnswerObjects(
      payload.answerObject,
      qtype
    );

    let eventTime = payload.eventTime ? toLocal(payload.eventTime) : null;
    let startedAt = payload.startTime
      ? toLocal(payload.startTime)
      : toLocal(new Date().getTime());
    let submittedAt = payload.endTime ? toLocal(payload.endTime) : startedAt;

    if (payload.resourceType === 'question') {
      let util = getQuestionUtil(qtype).create();
      let resId = payload.gooruOId;
      if (resId === undefined) {
        resId = payload.questionId;
      }
      if (resId === undefined) {
        resId = payload.resourceId;
      }
      let questionResult = QuestionResult.create({
        //Commons fields for real time and student collection performance
        resourceId: resId,
        reaction: payload.reaction,
        timeSpent: payload.timeSpent,
        answerObject: payload.answerObject,
        userAnswer: util.toUserAnswer(answerObjects),

        //fields only for real time
        correct: payload.score > 0,

        //fields only for student collection performance
        score: payload.score,
        resourceType: payload.resourceType,
        questionType: qtype,
        attempts: payload.attempts,
        sessionId: payload.sessionId,
        startedAt: startedAt,
        submittedAt: submittedAt,
        eventTime: eventTime,
        isGraded: payload.isGraded
      });
      questionResult.submittedAnswer = !!questionResult.userAnswer;
      return questionResult;
    } else {
      var resourceIdVal = payload.gooruOId;
      if (resourceIdVal === undefined) {
        resourceIdVal = payload.resourceId;
      }
      return ResourceResult.create({
        //Commons fields for real time and student collection performance
        resourceId: resourceIdVal,
        reaction: payload.reaction,
        timeSpent: payload.timeSpent,

        //fields only for student collection performance
        score: payload.score,
        resourceType: payload.resourceType,
        format: payload.format,
        attempts: payload.attempts,
        sessionId: payload.sessionId,
        startedAt: startedAt,
        submittedAt: submittedAt,
        eventTime: eventTime
      });
    }
  },

  /**
   * Answer object information
   * @see gooru-web/utils/question/*
   *
   * @param {string|[]} answerObjects
   * @returns {AnswerObject[]}
   */
  normalizeAnswerObjects: function(answerObjects, questionType) {
    answerObjects =
      !answerObjects || answerObjects === 'N/A' || answerObjects === 'NA'
        ? []
        : answerObjects;
    if (typeof answerObjects === 'string') {
      answerObjects = JSON.parse(answerObjects);
    }

    if (!Ember.$.isArray(answerObjects)) {
      answerObjects = [];
    }
    return answerObjects.map(function(answerObject) {
      if (questionType !== 'MA' && answerObject.text) {
        answerObject.answerId = window.btoa(
          encodeURIComponent(answerObject.text)
        );
      }
      return AnswerObject.create(answerObject);
    });
  },

  normalizeGetStandardsSummary: function(payload) {
    var result = [];
    const serializer = this;
    const content = payload.content;
    if (Ember.isArray(content)) {
      result = content.map(function(standard) {
        //standard score  set -1 if all questions is skipped
        let skippedQuestioncount = 0;
        standard.questions.forEach(function(questionsStatus) {
          if (questionsStatus.answerStatus === 'skipped') {
            skippedQuestioncount = skippedQuestioncount + 1;
          }
        });
        // minus one (-1) consider as not score
        if (skippedQuestioncount === standard.questions.length) {
          standard.score = -1;
        }
        return LearningTarget.create({
          id: standard.standardsId || standard.learningTargetId,
          standard: standard.displayCode,
          mastery: standard.score,
          relatedQuestions: serializer.normalizeQuestions(standard.questions)
        });
      });
    }
    return result;
  },

  normalizeQuestions: function(payload) {
    var result = [];
    if (Ember.isArray(payload)) {
      result = payload.map(function(question) {
        return question.questionId;
      });
    }
    return result;
  }
});
