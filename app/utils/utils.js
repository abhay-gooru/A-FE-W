import Ember from 'ember';
import { isNumeric } from './math';
import { GRADING_SCALE } from 'gooru-web/config/config';

/*
 * Function for sorting strings alphabetically in ascending order
 * @param {string} a
 * @param {string} b
 * @returns {number} - -1 if 'a' should go before 'b'; 1 if 'b' should go before 'a'; or else, 0.
 */
export function alphabeticalStringSort(a, b) {
  const lowerCaseA = a.toLowerCase();
  const lowerCaseB = b.toLowerCase();

  return (lowerCaseA < lowerCaseB) ? -1 :
    (lowerCaseA > lowerCaseB) ? 1 : 0;
}

/**
 * Check the standards that are checkable against the codes (provided by user)
 * and disable those who are not in codes arrays.
 * @param standards
 * @param checkableStandards
 * @param codes
 */
export function checkStandards(standards, checkableStandards, codes) {
  standards.forEach(function(standard) {
    if (checkableStandards.contains(standard.get("id"))) {
      standard.set("disabled", !codes.contains(standard.get("id")));
    }
  });
}

/**
 * Formats the Unit, Lesson, Assessment and Collection label
 * @param {number} index
 * @param {string} type
 * @param {service} i18n
 */
export function courseSectionsPrefix(index, type, i18n) {
  var prefixIndex = ++index;

  const i18nKey = `common.${type}Initial`;
  const letter = i18n.t(i18nKey);

  return `${letter}${prefixIndex}`;
}

/**
 * Formats a date into a string
 * @param {Date} date
 * @param {string} format
 */
export function formatDate(date, format) {
  format = format || 'dddd, MMMM Do, YYYY h:mm A';
  return moment(date).format(format);
}

/**
 * Format a certain number of milliseconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInMillis - time value in milliseconds
 * @returns {String}
 */
export function formatTime(timeInMillis) {
  var result = '';
  var secs;

  if (timeInMillis) {
    secs = timeInMillis / 1000;
    const hours = secs / 3600;
    secs = secs % 3600;
    const mins = secs / 60;
    secs = secs % 60;

    if (hours >= 1) {
      result = Math.floor(hours) + 'h ';
      if (mins >= 1) {
        result += Math.floor(mins) + 'm';
      }
    } else {
      if (mins >= 1) {
        result = Math.floor(mins) + 'm ';
      }
      if (secs >= 1) {
        result += Math.floor(secs) + 's';
      }
    }
  } else {
    result = '';
  }

  return result;
}

/**
 * Format a certain number of seconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInSeconds - time value in seconds
 * @returns {String}
 */
export function formatTimeInSeconds(timeInSeconds) {
  return formatTime(timeInSeconds * 1000);
}

/**
 * Get an icon depending on whether an answer was correct or not.
 * @param {boolean} isCorrect - was the answer correct or not?
 * @returns {String} - html string
 */
export function getAnswerResultIcon(isCorrect) {
  var html;

  if (isCorrect) {
    html = '<i class="fa fa-check-circle-o answer-correct"></i>';
  } else if (isCorrect === false) {
    html = '<i class="fa fa-times-circle-o answer-incorrect"></i>';
  } else {
    // Null or any other falsy value
    html = '';
  }
  return html;
}

/**
 * Get an icon depending on a reaction value. If the reaction value is null,
 * a dash is returned. For any other falsy value, an empty string is returned.
 * @param {Number} reactionValue
 * @returns {String} - html string
 */
export function getReactionIcon(reactionValue) {
  var html;

  if (reactionValue) {
    html = '<i class="emotion emotion-' + reactionValue + '"></i>';
  } else if (reactionValue === null) {
    html = '&mdash;';
  } else {
    html = '';
  }
  return html;
}

/**
 * Find the color corresponding to the grade bracket that a specific grade belongs to
 * @see gooru-web/config/config#GRADING_SCALE
 * @param grade
 * @returns {String} - Hex color value
 */
export function getGradeColor(grade) {
  var bracket = GRADING_SCALE.length - 1;
  var color = '#999999';  // Default color

  if (isNumeric(grade)) {

    for (; bracket >= 0; bracket--) {
      if (grade >= GRADING_SCALE[bracket].LOWER_LIMIT) {
        color = GRADING_SCALE[bracket].COLOR;
        break;
      }
    }

  } else {
    Ember.Logger.error('Grade value: ' + grade + ' is not a numeric value');
  }
  return color;
}
/**
 * Convert a number into Upper Letter
 * @param number
 * @returns {string}
 */
export function getLetter(number){
  return String.fromCharCode(65 + number);
}

/*
 * Function for sorting numbers in ascending order
 * @param {number} a
 * @param {number} b
 * @returns {number} - -1 if 'a' should go before 'b'; 1 if 'b' should go before 'a'; or else, 0.
 */
export function numberSort(a, b) {
  a = a ? a : !!a;
  b = b ? b : !!b;
  return a - b;
}

/**
 * Generates Uuid's
 */
export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c==='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

/**
 * Indicates if two arrays are equal
 * Returns true, if both the arrays are same even if the elements are in different order.
 * @return {boolean}
 */
export function arraysEqual(arr1, arr2){
  return Ember.$(arr1).not(arr2).length === 0 && Ember.$(arr2).not(arr1).length === 0;
}
