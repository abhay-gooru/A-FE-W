import Ember from 'ember';
import { isNumeric } from './math';
import {
  EMOTION_VALUES,
  GRADING_SCALE } from 'gooru-web/config/config';

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
export function courseSectionsPrefix(index, type, i18n,longName) {
  var prefixIndex = ++index;
  var letter;
  var sectionPrefix;
  if(longName){
    const i18nKey = `common.${type}`;
    letter = i18n.t(i18nKey);
    sectionPrefix =`${letter}`+' '+`${prefixIndex}`;
  }else{
    const i18nKey = `common.${type}Initial`;
    letter = i18n.t(i18nKey);
    sectionPrefix =`${letter}${prefixIndex}`;
  }

  return sectionPrefix;
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
    html = '<span class="score answer-correct"><i class="gru-icon material-icons">done</i></span>';
  } else if (isCorrect === false) {
    html = '<span class="score answer-incorrect"><i class="gru-icon material-icons">clear</i></span>';
  } else {
    // Null or any other falsy value
    html = '<span class="score answer-undefined"></span>';
  }
  return html;
}

/**
 * Get a html of the score string.
 * @param {number} value - %value
 * @returns {String} - html string
 */
export function getScoreString(value) {

  if(typeof value === "number"){
    var gradeColor = getGradeColor(value);
    return '<span class="score" style="background-color: '+gradeColor+'">'+value+' %</span>';
  }

  return '<span class="score answer-undefined"></span>';
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
    var reaction = EMOTION_VALUES.filter(function (emotion) {
      return emotion.value === reactionValue;
    })[0];
    if (reaction && reaction.value && reaction.unicode) {
      html = '<div class="emotion emotion-' + reaction.value + '">';
      html += '  <svg class="svg-sprite">';
      html += '    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/emoji-one/emoji.svg#'+ reaction.unicode + '"></use>';
      html += ' </svg>';
      html += '</div>';
    } else {
      html = '&mdash;';
    }
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
 * Truncates a text
 * @param {string} text
 * @param {number} maxLength max allowed length for text, optional
 * @param {string} type indicates the truncate type, optional
 * @param {boolean} suffix indicates if it adds or not a suffix, default is true
 * @returns {*}
 */
export function truncate(text, maxLength, type, suffix){
  let config = { //TODO product owner will provide max lengths, this will be moved to the configuration
    "name": 15,
    "short": 10,
    "player-nav-sm": 30,
    "medium": 50,
    "large": 200
  };
  let defaultType = "short";

  if (!maxLength && !type){ //default behavior
    type = defaultType;
  }

  if (type) {
    maxLength = config[type] || config[defaultType];
  }

  let addSuffix = (suffix !== false);

  let truncated = text;
  if (text.length > maxLength) {
    truncated = text.substring(0, maxLength);
    if (addSuffix) {
      truncated = truncated + "...";
    }
  }

  return truncated;
}
