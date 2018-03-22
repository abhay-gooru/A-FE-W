import Ember from 'ember';
import { createDataMatrix } from 'gooru-web/utils/performance-data';
import { alphabeticalStringSort, numberSort } from 'gooru-web/utils/utils';
import { DEFAULT_IMAGES } from 'gooru-web/config/config';
import _ from 'lodash';
/**
 * used to increment hbs file
 */
export function plusOne(params) {
  return parseInt(params) + 1;
}

Ember.HTMLBars.makeBoundHelper(plusOne);
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-metrics-table'],
  // -------------------------------------------------------------------------
  // Properties
  /**
   * @prop { Object } sortCriteria - Object with information on how the data should be sorted
   * - metricsIndex: {number} - Index of metrics option
   * - order: {number} - Ascending or descending order
   */
  sortCriteria: null,
  /**
   * The header titles
   * @property {Headers[]}
   */

  headers: null,
  /**
   * The header titles
   * @property {Headers[]}
   */

  tempheaders: null,
  /**
   * The header titles
   * @property {courseId}
   */

  courseId: null,
  /**
   * The header titles
   * @property {classId}
   */

  classId: null,
  /**
   * The header titles
   * @property {tempUnitId}
   */

  tempUnitId: null,
  /**
   * Action name when the user clicks at any score box
   * @property {string}
   */
  onClickReport: null,
  /**
   * @type {PerformanceService}
   */
  performanceService: Ember.inject.service('api-sdk/performance'),
  /**
   * @type {ClassService} Service to retrieve class information
   */
  classService: Ember.inject.service('api-sdk/class'),
  /**
   * The lessonperformanceDataMatrix
   * @property {lessonperformanceDataMatrix[]}
   */

  lessonperformanceDataMatrix: null,
  /**
   * The lessonperformanceDataMatrix
   * @property {lessonperformanceDataMatrix[]}
   */
  assessmentperformanceDataMatrix: null,
  /**
   * The performanceDataMatrix
   * @property {performanceDataMatrix[]}
   */

  performanceDataMatrix: null,

  /**
   * @type LessonService
   */
  lessonService: Ember.inject.service('api-sdk/lesson'),
  /**
   * @type UnitService
   */
  unitService: Ember.inject.service('api-sdk/unit'),

  /**
   * The average headers of the Data Matrix
   * @property {averageHeaders[]}
   */
  averageHeaders: Ember.computed('performanceDataMatrix.length', function() {
    const averageHeaders = this.get('performanceDataMatrix').objectAt(0);
    return averageHeaders;
  }),
  /**
   * If study time option is selected
   * @property {Boolean}
   */
  showStudyTime: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return dataPickerOptions.includes('time-spent');
  }),
  /**
   * If study time option is selected
   * @property {Boolean}
   */
  showReportTime: Ember.computed('dataPickerOptions.[]', function() {
    const dataPickerOptions = this.get('dataPickerOptions');
    return (
      dataPickerOptions.includes('time-spent') &&
      dataPickerOptions.includes('score')
    );
  }),
  /**
   * The average headers of the Data Matrix
   * @property {averageHeaders[]}
   */
  averageHeadersLesson: [],
  /**
   * The average headers of the Data Matrix
   * @property {averageHeaders[]}
   */
  averageHeadersAssessment: [],
  /**
   * The average headers of the Data Matrix
   * @property {averageHeaderstempAssessment[]}
   */
  averageHeaderstempAssessment: [],
  /**
   * The average headers of the Data Matrix
   * @property {unitPerformanceData[]}
   */
  unitPerformanceData: [],
  /**
   * The average headers of the Data Matrix
   * @property {unitArray[]}
   */
  unitArray: [],
  /**
   * The average headers of the Data Matrix
   * @property {unitArray[]}
   */
  tempUnitPerformanceArray: Ember.computed(
    'performanceDataMatrix.length',
    function() {
      const tempUnitPerformanceArray = this.get('performanceDataMatrix').slice(
        1
      );
      return tempUnitPerformanceArray;
    }
  ),
  /**
   * The average headers of the Data Matrix
   * @property {unitPerformanceData[]}
   */
  lesson1PerformanceData: [],
  /**
   * The average headers of the Data Matrix
   * @property {totalAssessments}
   */
  totalAssessments: 0,
  /**
   * The average headers of the Data Matrix
   * @property {boolFlag}
   */
  boolFlag: false,
  /**
   * The average headers of the Data Matrix
   * @property {expandedUnit}
   */
  expandedUnit: false,
  /**
   * The average headers of the Data Matrix
   * @property {unitPerformanceData[]}
   */
  assessment1PerformanceData: [],
  /**
   * The user performanceData
   * @property {performanceData[]}
   */
  performanceData: Ember.computed(
    'performanceDataMatrix.length',
    'sortCriteria',
    function() {
      const component = this;
      const performanceData1 = this.get('performanceDataMatrix').slice(1);
      const sortCriteria = this.get('sortCriteria');
      component.set('unitArray', []);
      component.get('headers').forEach(function(item) {
        if (item !== undefined) {
          var emberObject = Ember.Object.create({
            id: item.id
          });
          component.get('unitArray').pushObject(emberObject);
        }
      });
      component.get('tempUnitPerformanceArray').forEach(function(item1) {
        component.set('unitArray', []);
        component.get('headers').forEach(function(item) {
          if (item !== undefined) {
            var emberObject = Ember.Object.create({
              id: item.id
            });
            component.get('unitArray').pushObject(emberObject);
          }
        });
        item1.performanceData.forEach(function(item2, indx2) {
          if (indx2 === 0) {
            component.get('unitArray').insertAt(indx2, item2);
          }
          if (indx2 > 0) {
            if (
              item2 !== undefined &&
              item2.id !== undefined &&
              item2.collectionType !== undefined
            ) {
              var unitDetails = component
                .get('unitArray')
                .findBy('id', item2.id);
              if (unitDetails !== undefined) {
                var indxUnit = component.get('unitArray').indexOf(unitDetails);
                component.get('unitArray').removeAt(indxUnit);
                component.get('unitArray').insertAt(indxUnit, item2);
              }
            }
            if (indx2 === item1.performanceData.length - 1) {
              item1.set('performanceData', component.get('unitArray'));
            }
          }
        });
      });
      if (sortCriteria) {
        let metricsIndex = sortCriteria.metricsIndex;
        let sortedData = performanceData1;
        //alphabeticalStringSort
        if (metricsIndex === -1) {
          sortedData.sort(function(a, b) {
            return alphabeticalStringSort(a.user, b.user) * sortCriteria.order;
          });
        } else if (metricsIndex >= 0) {
          let sortByMetric = this.get('sortByMetric');
          sortedData.sort(function(a, b) {
            if (sortByMetric === 'score') {
              return (
                numberSort(
                  a.performanceData[0].score,
                  b.performanceData[0].score
                ) * sortCriteria.order
              );
            } else if (sortByMetric === 'completion') {
              return (
                numberSort(
                  a.performanceData[0].completionDone,
                  b.performanceData[0].completionDone
                ) * sortCriteria.order
              );
            } else {
              return (
                numberSort(
                  a.performanceData[0].studyTime,
                  b.performanceData[0].studyTime
                ) * sortCriteria.order
              );
            }
          });
        }
        return sortedData;
      } else {
        this.set('unitPerformanceData', performanceData1);
        return performanceData1;
      }
    }
  ),

  /**
   * The user performanceData
   * @property {performanceData[]}
   */
  lessonperformanceData: [],
  /**
   * The user performanceData
   * @property {performanceData[]}
   */
  assessmentperformanceData: [],
  /**
   * The user performanceData
   * @property {performanceData[]}
   */
  assessment1performanceData: [],
  /**
   * List of  metrics to be displayed by the sub-header component for the average
   * @sorted {Boolean}
   * @isAsc {Boolean}
   * @constant {Array}
   */
  averageMetrics: Ember.A([
    Ember.Object.create({
      value: 'student',
      sorted: false,
      isAsc: false,
      visible: true,
      index: -1
    })
  ]),

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  dataPickerOptions: Ember.A(['score']),

  /**
   * List of selected options from the data picker.
   * @property {Boolean}
   */
  isLoading: false,
  /**
   * List of selected options from the data picker.
   * @property {Boolean}
   */
  isExpanded: false,
  /**
   * Query param, filterBy selected
   * @property {String}
   */
  filterBy: 'assessment',
  /**
   * Query param, filterBy selected
   * @property {String}
   */
  nodata: '--NO DATA--',
  /**
   * Query param, filterBy selected
   * @property {String}
   */
  loaderIcon: '',

  /**
   * Indicate if the table is on collection level
   * @property {Boolean}
   */
  isCollection: Ember.computed.equal('headerType', 'collection'),

  model: Ember.A([
    Ember.Object.create({
      label: 'Students',
      valuePath: 'studentName',
      class: 'header',
      width: '150px'
    }),
    Ember.Object.create({
      label: 'Class Average',
      valuePath: 'classaverage',
      class: 'header',
      width: '150px'
    })
  ]),
  /*
   * @prop { Number } defaultSortOrder - Default sort order for values in columns (1 = ascending; -1 = descending)
   */
  defaultSortOrder: 1,
  defaultSortOrderScore: 1,
  defaultSortOrderStudent: 1,
  defaultSortOrderTime: 1,
  defaultSortOrderCompletion: 1,

  /**
   * metric sent by the sort function
   */
  sortByMetric: null,

  init() {
    this._super(...arguments);
    const component = this;
    component.set('loaderIcon', DEFAULT_IMAGES.LOADER_IMAGE);
    component.set('filterBy', component.get('filterBy'));
    component.get('performanceData').forEach(function(item1) {
      item1.performanceData.forEach(function(item9) {
        if (item9 !== undefined && item9.id !== undefined) {
          item9.set('subColumns', []);
          item9.set('subsubColumns', []);
        }
      });
    });
    component.get('headers').forEach(function(item, index) {
      var orginalTitle = item.get('title');
      if (!(orginalTitle.indexOf(':') !== -1)) {
        item.set('title', `U${index + 1}: ${orginalTitle}`);
      }
      if (!orginalTitle.startsWith('U')) {
        item.set('title', `U${index + 1}: ${orginalTitle}`);
      }
      if (item.get('lessonCount') === 0) {
        Ember.set(item, 'hideExpand', true);
      } else {
        Ember.set(item, 'hideExpand', false);
      }
      Ember.set(item, 'showSub', false);
      component.set('expandedUnit', false);
      Ember.set(item, 'showSubSub', false);
      Ember.set(item, 'subColumns', []);
      Ember.set(item, 'colspanval', 1);
    });
    if (component.get('tempUnitId') !== null) {
      var unitDetails = component
        .get('tempheaders')
        .findBy('id', component.get('tempUnitId'));
      if (unitDetails !== undefined) {
        component.removeexpandedUnit();
      }
    }
    component.set('averageHeaderstempAssessment', []);
    if (
      component.getStoredUnitIdVal() !== null &&
      component.getStoredUnitIdVal() !== 'null'
    ) {
      component.expandByUnit(component.getStoredUnitIdVal());
    }
  },
  didInsertElement() {
    'use strict';
    Ember.run.next(this, function() {
      this.$('table').addClass('table');
    });
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.set('sortCriteria', this.initSortCriteria());
    });
    Ember.$('#clscroll-content').scroll(function() {
      Ember.$('#clscroll-row-headers').scrollTop(
        Ember.$('#clscroll-content').scrollTop()
      );
      Ember.$('#clscroll-column-headers').scrollLeft(
        Ember.$('#clscroll-content').scrollLeft()
      );
    });
    Ember.$('#clscroll-column-headers').scroll(function() {
      Ember.$('#header-Table').attr('style', 'padding-right:15px;');
      if (Ember.$('#clscroll-column-headers').scrollLeft() === 0) {
        Ember.$('#header-Table').attr('style', 'padding-right:0px;');
      }
      Ember.$('#clscroll-content').scrollLeft(
        Ember.$('#clscroll-column-headers').scrollLeft()
      );
    });
    Ember.$('#clscroll-row-headers').scroll(function() {
      $('#clscroll-content').scrollTop(
        Ember.$('#clscroll-row-headers').scrollTop()
      );
    });
  },
  didRender() {
    this._super(...arguments);
    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    var width = Ember.$('#clscroll-table').width();
    var height = Ember.$(window).height() - 63;
    if (height > 300) {
      height = height - 191;
    }
    Ember.$('#clscroll-content').attr(
      'style',
      `width:${width + 15}px;max-height:${height}px;`
    );
    Ember.$('#clscroll-row-headers').attr('style', `height:${height - 2}px;`);
  },
  actions: {
    onScrolledToBottom() {
      if (this.get('canLoadMore')) {
        this.incrementProperty('page');
        this.fetchRecords();
      }
    },
    sortChange: function(metric) {
      const component = this;
      var metricsIndex = metric.get('index');

      component.set('sortByMetric', metric.get('value'));
      let sortedData = component.get('performanceData');
      //alphabeticalStringSort
      if (metricsIndex === -1) {
        if (component.get('defaultSortOrderStudent') === 1) {
          component.set('defaultSortOrderStudent', -1);
          sortedData.sort(function(a, b) {
            return alphabeticalStringSort(a.user, b.user) * 1;
          });
        } else {
          component.set('defaultSortOrderStudent', 1);
          sortedData.sort(function(a, b) {
            return alphabeticalStringSort(a.user, b.user) * -1;
          });
        }
      } else if (metricsIndex >= 0) {
        let sortByMetric = component.get('sortByMetric');
        if (sortByMetric === 'score') {
          if (component.get('defaultSortOrderScore') === 1) {
            sortedData.sort(function(a, b) {
              component.set('defaultSortOrderScore', -1);
              return (
                numberSort(
                  a.performanceData[0].score,
                  b.performanceData[0].score
                ) * 1
              );
            });
          } else if (component.get('defaultSortOrderScore') === -1) {
            sortedData.sort(function(a, b) {
              component.set('defaultSortOrderScore', 1);
              return (
                numberSort(
                  a.performanceData[0].score,
                  b.performanceData[0].score
                ) * -1
              );
            });
          }
        } else if (sortByMetric === 'completion') {
          if (component.get('defaultSortOrderCompletion') === 1) {
            sortedData.sort(function(a, b) {
              component.set('defaultSortOrderCompletion', -1);
              return (
                numberSort(
                  a.performanceData[0].completionDone,
                  b.performanceData[0].completionDone
                ) * 1
              );
            });
          } else if (component.get('defaultSortOrderCompletion') === -1) {
            sortedData.sort(function(a, b) {
              component.set('defaultSortOrderCompletion', 1);
              return (
                numberSort(
                  a.performanceData[0].completionDone,
                  b.performanceData[0].completionDone
                ) * -1
              );
            });
          }
        } else {
          if (component.get('defaultSortOrderTime') === 1) {
            sortedData.sort(function(a, b) {
              component.set('defaultSortOrderTime', -1);
              return (
                numberSort(
                  a.performanceData[0].studyTime,
                  b.performanceData[0].studyTime
                ) * 1
              );
            });
          } else if (component.get('defaultSortOrderTime') === -1) {
            sortedData.sort(function(a, b) {
              component.set('defaultSortOrderTime', 1);
              return (
                numberSort(
                  a.performanceData[0].studyTime,
                  b.performanceData[0].studyTime
                ) * -1
              );
            });
          }
        }
      }

      component.set('performanceData', []);
      component.set('performanceData', sortedData);
    },
    showassessments(index) {
      var temp = this.get('headers').objectAt(index);
      this.set('isLoading', true);
      this.expandLesson(temp.get('id'), index);
      Ember.set(temp, 'showSub', true);
      this.set('expandedUnit', true);
      Ember.set(temp, 'showSubSub', true);
      Ember.set(temp, 'showAssessments', true);
    },
    showlessons(index) {
      var temp = this.get('headers').objectAt(index);
      this.set('isLoading', true);
      this.expandUnit(temp.get('id'), index);
      Ember.set(temp, 'showSub', true);
      this.set('expandedUnit', true);
      Ember.set(temp, 'showSubSub', false);
      Ember.set(temp, 'showAssessments', false);
    },
    expand(index) {
      this.set('isLoading', true);
      var temp = this.get('headers').objectAt(index);
      if (this.get('tempUnitId') !== null) {
        var unitDetails = this.get('tempheaders').findBy(
          'id',
          this.get('tempUnitId')
        );
        if (unitDetails !== undefined) {
          this.removeexpandedUnit();
          this.set('filterBy', this.get('filterBy'));
          this.set('tempUnitId', temp.get('id'));
          this.storeClickValues(temp.get('id'));
          this.set('isExpanded', true);
          this.set('tempheaders', this.get('headers'));
          this.expandLesson(temp.get('id'), index);
          Ember.set(temp, 'showSub', true);
          this.set('expandedUnit', true);
          Ember.set(temp, 'showSubSub', true);
          Ember.set(temp, 'showAssessments', true);
        }
      } else {
        this.set('filterBy', this.get('filterBy'));
        this.set('tempUnitId', temp.get('id'));
        this.storeClickValues(temp.get('id'));
        this.set('isExpanded', true);
        this.set('tempheaders', this.get('headers'));
        this.expandLesson(temp.get('id'), index);
        Ember.set(temp, 'showSub', true);
        this.set('expandedUnit', true);
        Ember.set(temp, 'showSubSub', true);
        Ember.set(temp, 'showAssessments', true);
      }
    },
    /**
     * When the user clicks at the report
     */
    clickReport: function(performance, userPerformance) {
      if (this.get('onClickReport')) {
        this.sendAction('onClickReport', performance, userPerformance);
      }
    },
    /**
     * navigateToAssessments
     */
    navigateToCollection: function(unitId, lessonId, collectionId) {
      this.sendAction('onAssessmentClick', unitId, lessonId, collectionId);
    },
    collapse(index) {
      const component = this;
      const filterBy = component.get('filterBy');
      component.set('filterBy', component.get('filterBy'));
      var temp = component.get('headers').objectAt(index);
      Ember.set(temp, 'showSub', false);
      component.set('expandedUnit', false);
      Ember.set(temp, 'showSubSub', false);
      var inxArr = [];
      component.removeexpandedUnit();
      component.set('tempUnitId', null);
      this.storeClickValues(null);
      this.set('isExpanded', false);
      component.set('tempheaders', null);
      Ember.set(temp, 'showSub', false);
      component
        .get('averageHeaders')
        .performanceData.forEach(function(item, indx) {
          if (
            item.level !== undefined &&
            (item.level === 'lesson' || item.level === filterBy)
          ) {
            inxArr.pushObject(indx);
          }
        });
      inxArr.forEach(function(item, indx) {
        if (indx > 0) {
          component
            .get('averageHeaders')
            .performanceData.removeAt(inxArr.objectAt(indx) - indx);
        } else {
          component
            .get('averageHeaders')
            .performanceData.removeAt(inxArr.objectAt(indx));
        }
      });
    },
    onAfterResponsiveChange(matches) {
      if (matches.indexOf('jumbo') > -1) {
        this.get('table.expandedRows').setEach('expanded', false);
      }
    }
  },
  removeexpandedUnit: function() {
    const component = this;
    component.get('headers').forEach(function(item) {
      Ember.set(item, 'showSub', false);
      component.set('expandedUnit', false);
      Ember.set(item, 'showSubSub', false);
      Ember.set(item, 'subColumns', []);
      Ember.set(item, 'colspanval', 1);
    });
    component.get('performanceData').forEach(function(item1) {
      item1.performanceData.forEach(function(item9) {
        item9.set('subColumns', []);
        item9.set('subsubColumns', []);
      });
    });
    component.set('averageHeaderstempAssessment', []);
  },
  expandUnit: function(unitId, unitIndex) {
    const component = this;
    const classId = component.get('classId');
    const courseIdVal = component.get('courseId');
    const filterBy = component.get('filterBy');
    component.set('filterBy', component.get('filterBy'));
    component
      .get('classService')
      .readClassMembers(classId)
      .then(function(members) {
        component
          .get('unitService')
          .fetchById(courseIdVal, unitId)
          .then(function(unit) {
            var temp = component.get('headers').objectAt(unitIndex);
            unit.get('children').forEach(function(item, indx) {
              var orginalTitle = item.get('title');
              item.set('title', `L${indx + 1}: ${orginalTitle}`);
            });
            Ember.set(temp, 'subColumns', unit.get('children'));
            Ember.set(temp, 'colspanval', unit.get('children').length + 1);
            var lessons = unit.get('children');
            var inxArr = [];
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (
                  item.level !== undefined &&
                  (item.level === 'lesson' || item.level === filterBy)
                ) {
                  inxArr.pushObject(indx);
                }
              });
            inxArr.forEach(function(item, indx) {
              if (indx > 0) {
                component
                  .get('averageHeaders')
                  .performanceData.removeAt(inxArr.objectAt(indx) - indx);
              } else {
                component
                  .get('averageHeaders')
                  .performanceData.removeAt(inxArr.objectAt(indx));
              }
            });
            component
              .get('performanceService')
              .findClassPerformanceByUnit(
                classId,
                courseIdVal,
                unitId,
                members.get('members'),
                { collectionType: filterBy }
              )
              .then(function(classPerformanceData) {
                const performanceData2 = createDataMatrix(
                  lessons,
                  classPerformanceData,
                  'unit'
                );
                component.set('lessonperformanceDataMatrix', performanceData2);
                const lessonperformanceData = Ember.computed(
                  'lessonperformanceDataMatrix.length',
                  'sortCriteria',
                  function() {
                    const performanceData3 = this.get(
                      'lessonperformanceDataMatrix'
                    );
                    var tempInx = unitIndex + 1;
                    var lessnDataArr = component
                      .get('lessonperformanceDataMatrix')
                      .objectAt(0).performanceData;
                    component
                      .get('lessonperformanceDataMatrix')
                      .objectAt(0)
                      .set('performanceData', lessnDataArr);
                    component
                      .get('lessonperformanceDataMatrix')
                      .objectAt(0)
                      .performanceData.forEach(function(item, indx) {
                        if (indx > 0) {
                          item.set('level', 'lesson');
                          item.set('unitId', unitId);
                          component
                            .get('averageHeaders')
                            .performanceData.insertAt(tempInx + indx, item);
                        }
                      });
                    component.set('lessonperformanceData', performanceData3);
                    return performanceData3;
                  }
                );
                component.set('lessonperformanceData', lessonperformanceData);
                component.get('lessonperformanceData').forEach(function(item) {
                  var lessonUser = item.user;
                  var lessonPerformanceData = item.performanceData;
                  component.get('performanceData').forEach(function(item1) {
                    var indexLesson = 0;
                    var tempInx = unitIndex + 1;
                    if (lessonUser === item1.user) {
                      item1.performanceData.forEach(function(
                        item9,
                        lessonpIndex
                      ) {
                        if (item9 !== undefined && item9.id !== undefined) {
                          if (item9.id === unitId) {
                            item9.set('unitIdVal', unitId);
                            if (lessonpIndex === tempInx) {
                              var hdrObj = component
                                .get('averageHeaders')
                                .performanceData.objectAt(lessonpIndex);
                              hdrObj.set('unitIdVal', unitId);
                              component
                                .get('averageHeaders')
                                .performanceData.removeAt(lessonpIndex);
                              component
                                .get('averageHeaders')
                                .performanceData.insertAt(lessonpIndex, hdrObj);
                            }
                            if (lessonPerformanceData.length !== 1) {
                              lessonPerformanceData.removeAt(0);
                            }
                            item9.set('subsubColumns', []);
                            item9.set('subColumns', []);
                            var lessonsStr = '';
                            lessons.forEach(function(lessonObj) {
                              lessonsStr = `${lessonsStr + lessonObj.id},`;
                              var emberObject = Ember.Object.create({
                                id: lessonObj.id
                              });
                              item9.get('subColumns').pushObject(emberObject);
                            });
                            for (
                              var j = 0;
                              j < lessonPerformanceData.length;
                              j++
                            ) {
                              if (lessonPerformanceData[j] !== undefined) {
                                if (
                                  lessonsStr.indexOf(
                                    lessonPerformanceData[j].id
                                  ) !== -1
                                ) {
                                  var group = item9
                                    .get('subColumns')
                                    .findBy('id', lessonPerformanceData[j].id);
                                  if (group !== undefined) {
                                    var indx = item9
                                      .get('subColumns')
                                      .indexOf(group);
                                    item9.get('subColumns').removeAt(indx);
                                    item9
                                      .get('subColumns')
                                      .insertAt(indx, lessonPerformanceData[j]);
                                  }
                                }
                              }
                              if (j === lessonPerformanceData.length - 1) {
                                component.set('isLoading', false);
                              }
                            }
                          }
                        }
                        indexLesson = indexLesson + 1;
                      });
                    }
                  });
                });

                Ember.computed(
                  'lessonperformanceDataMatrix.length',
                  function() {
                    const averageHeaders = component
                      .get('lessonperformanceDataMatrix')
                      .objectAt(0);
                    component.set('averageHeadersLesson', averageHeaders);
                    return averageHeaders;
                  }
                );
              });
          });
      });
  },
  expandLesson: function(unitId, unitIndex) {
    const component = this;
    const filterBy = component.get('filterBy');
    component.set('filterBy', component.get('filterBy'));
    component.get('performanceData').forEach(function(item1) {
      item1.performanceData.forEach(function(item9) {
        item9.set('subColumns', []);
        item9.set('subsubColumns', []);
      });
    });
    var inxArr = [];
    component.set('totalAssessments', 0);
    component
      .get('averageHeaders')
      .performanceData.forEach(function(item, indx) {
        if (
          item.level !== undefined &&
          (item.level === 'lesson' || item.level === filterBy)
        ) {
          inxArr.pushObject(indx);
        }
      });
    inxArr.forEach(function(item, indx) {
      if (indx > 0) {
        component
          .get('averageHeaders')
          .performanceData.removeAt(inxArr.objectAt(indx) - indx);
      } else {
        component
          .get('averageHeaders')
          .performanceData.removeAt(inxArr.objectAt(indx));
      }
    });
    const classId = component.get('classId');
    const courseIdVal = component.get('courseId');
    component
      .get('classService')
      .readClassMembers(classId)
      .then(function(members) {
        component
          .get('unitService')
          .fetchById(courseIdVal, unitId)
          .then(function(unit) {
            var temp = component.get('headers').objectAt(unitIndex);
            unit.get('children').forEach(function(item, indx) {
              var orginalTitle = item.get('title');
              item.set('title', `L${indx + 1}: ${orginalTitle}`);
            });
            Ember.set(temp, 'subColumns', unit.get('children'));
            Ember.set(temp, 'colspanval', 1);
            var lessons = unit.get('children');
            component.set('assessment1performanceData', []);
            component.set('averageHeadersAssessment', []);
            component.set('boolFlag', false);
            if (filterBy === 'collection') {
              lessons.forEach(function(lessonObj, lessonIndex) {
                setTimeout(function() {
                  component.eachLesson(
                    courseIdVal,
                    unitId,
                    lessonObj,
                    unitIndex,
                    lessonIndex,
                    filterBy,
                    unit,
                    classId,
                    members,
                    temp,
                    unitIndex,
                    lessons.length
                  );
                }, 500 * lessonIndex);
              });
            } else {
              component
                .get('performanceService')
                .findClassPerformanceByUnitAndLesson(
                  classId,
                  courseIdVal,
                  unitId,
                  '',
                  members.get('members'),
                  { collectionType: filterBy }
                )
                .then(function(classPerformanceData) {
                  let paramslesson = {
                    courseIdVal: courseIdVal,
                    unitId: unitId,
                    lessons: lessons
                  };

                  alert('Resolving all lessons');
                  var resolvedlessons = component.getResolvedLessons(
                    paramslesson
                  );
                  resolvedlessons.then(function(resolvedlessons) {
                    //console.log("Resolved all lessons");
                    alert('Resolved all lessons');
                    resolvedlessons.forEach(function(lessonObj, lessonIndex) {
                      // setTimeout(function() {
                      component.lessonsAssessment(
                        courseIdVal,
                        unitId,
                        lessonObj,
                        unitIndex,
                        lessonIndex,
                        filterBy,
                        unit,
                        classId,
                        members,
                        temp,
                        unitIndex,
                        lessons.length,
                        classPerformanceData
                      );
                      // }, 10 * lessonIndex);
                    }); //End for
                  });
                });
            }
          });
      });
  },
  eachLesson: function(
    courseIdVal,
    unitId,
    lessonObj,
    index1,
    lessonIndex,
    filterBy,
    unit,
    classId,
    members,
    temp,
    unitIndex,
    lessonLen
  ) {
    const component = this;
    component
      .get('lessonService')
      .fetchById(courseIdVal, unitId, lessonObj.id)
      .then(function(lesson) {
        const filteredCollections = lesson
          .get('children')
          .filter(function(collection) {
            return filterBy === 'both' || collection.get('format') === filterBy;
          });
        Ember.set(lessonObj, 'subsubColumns', []);
        if (lessonIndex === 0) {
          component.set('averageHeadersAssessment', []);
        }
        var countCols = 0;
        var tempInx = index1 + 1;
        var array1 = [];
        var array2 = [];
        var arrayComplete = [];
        var timerConst = 2000;
        if (lessonLen > 3) {
          timerConst = 500 * lessonLen;
        }
        var tempVal = 0;
        if (lessonIndex === 0) {
          component.set('averageHeaderstempAssessment', []);
        }
        lesson.get('children').forEach(function(assessmentObj) {
          if (assessmentObj.format === filterBy) {
            tempVal = tempVal + 1;
            countCols = countCols + 1;
            var emberObject = Ember.Object.create({
              id: assessmentObj.id,
              lessonId: lessonObj.id,
              level: filterBy
            });
            var orginalTitle = assessmentObj.get('title');
            if (filterBy === 'assessment') {
              assessmentObj.set('title', `A${tempVal}: ${orginalTitle}`);
            } else {
              assessmentObj.set('title', `C${tempVal}: ${orginalTitle}`);
            }
            lessonObj.get('subsubColumns').pushObject(assessmentObj);
            component.get('averageHeadersAssessment').pushObject(emberObject);
          }
        });
        if (tempVal === 0) {
          countCols = countCols + 1;
          var tempassessmentObj = Ember.Object.create({
            format: filterBy,
            id: 'NoObject',
            collectionType: filterBy,
            openEndedQuestionCount: 0,
            questionCount: 0,
            resourceCount: 0,
            title: '--NO DATA--'
          });
          lessonObj.get('subsubColumns').pushObject(tempassessmentObj);
        }
        Ember.run.later(function() {
          component.set('averageHeadersAssessment', []);
          component
            .get('averageHeaderstempAssessment')
            .forEach(function(lessonItem) {
              var emberObject = Ember.Object.create({
                id: 'NoObject',
                lessonId: lessonItem.lessonId,
                collectionType: filterBy,
                unitId: unitId,
                level: filterBy
              });
              if (lessonItem.lessonData.length > 0) {
                lessonItem.lessonData.forEach(function(item23) {
                  item23.set('level', filterBy);
                  item23.set('unitId', unitId);
                  item23.set('lessonId', lessonItem.lessonId);
                  component.get('averageHeadersAssessment').pushObject(item23);
                });
              } else {
                component
                  .get('averageHeadersAssessment')
                  .pushObject(emberObject);
              }
            });
          if (
            component.get('averageHeadersAssessment').length ===
            component.get('totalAssessments')
          ) {
            component.set('isLoading', false);
          }
          if (
            component.get('averageHeadersAssessment').length === 0 &&
            component.get('totalAssessments') === 0
          ) {
            var inxArr = [];
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (
                  item.level !== undefined &&
                  (item.level === 'lesson' || item.level === filterBy)
                ) {
                  inxArr.pushObject(indx);
                }
              });
            inxArr.forEach(function(item, indx) {
              if (indx > 0) {
                component
                  .get('averageHeaders')
                  .performanceData.removeAt(inxArr.objectAt(indx) - indx);
              } else {
                component
                  .get('averageHeaders')
                  .performanceData.removeAt(inxArr.objectAt(indx));
              }
            });
          } else if (
            component.get('averageHeadersAssessment').length ===
            component.get('totalAssessments')
          ) {
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (indx < tempInx) {
                  array1.pushObject(item);
                }
              });
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (indx >= tempInx) {
                  array2.pushObject(item);
                }
              });

            if (array2.length > countCols) {
              var inxArr11 = [];
              component
                .get('averageHeaders')
                .performanceData.forEach(function(item, indx) {
                  if (
                    item.level !== undefined &&
                    (item.level === 'lesson' || item.level === filterBy)
                  ) {
                    inxArr11.pushObject(indx);
                  }
                });
              inxArr11.forEach(function(item, indx) {
                if (indx > 0) {
                  component
                    .get('averageHeaders')
                    .performanceData.removeAt(inxArr11.objectAt(indx) - indx);
                } else {
                  component
                    .get('averageHeaders')
                    .performanceData.removeAt(inxArr11.objectAt(indx));
                }
              });
              array2.forEach(function(item, indx) {
                if (
                  (item.level !== undefined && item.level === filterBy) ||
                  (item.collectionType !== undefined &&
                    item.collectionType === filterBy)
                ) {
                  array2.removeAt(indx);
                }
              });
              arrayComplete.pushObjects(array1);
              arrayComplete.pushObjects(
                component.get('averageHeadersAssessment')
              );
              array2.forEach(function(item) {
                if (
                  !(
                    (item.collectionType !== undefined &&
                      item.collectionType === filterBy) ||
                    (item.level !== undefined && item.level === filterBy)
                  )
                ) {
                  arrayComplete.pushObject(item);
                }
              });
              component
                .get('averageHeaders')
                .set('performanceData', arrayComplete);
            } else {
              array2.forEach(function(item, indx) {
                if (
                  (item.level !== undefined && item.level === filterBy) ||
                  (item.collectionType !== undefined &&
                    item.collectionType === filterBy)
                ) {
                  array2.removeAt(indx);
                }
              });
              arrayComplete.pushObjects(array1);
              arrayComplete.pushObjects(
                component.get('averageHeadersAssessment')
              );
              array2.forEach(function(item) {
                if (
                  !(
                    (item.collectionType !== undefined &&
                      item.collectionType === filterBy) ||
                    (item.level !== undefined && item.level === filterBy)
                  )
                ) {
                  arrayComplete.pushObject(item);
                }
              });
              component
                .get('averageHeaders')
                .set('performanceData', arrayComplete);
            }
          }
        }, timerConst);
        if (countCols === 0) {
          var lessonValObj = temp.get('subColumns').findBy('id', lessonObj.id);
          if (lessonValObj !== undefined) {
            var indx = temp.get('subColumns').indexOf(lessonValObj);
            temp.get('subColumns').removeAt(indx);
          }
          component.set('isLoading', false);
        }
        if (countCols > 0) {
          component.set(
            'totalAssessments',
            component.get('totalAssessments') + countCols
          );
          Ember.set(temp, 'colspanval', component.get('totalAssessments') + 1);
          component
            .get('performanceService')
            .findClassPerformanceByUnitAndLesson(
              classId,
              courseIdVal,
              unitId,
              lessonObj.id,
              members.get('members'),
              { collectionType: filterBy }
            )
            .then(function(classPerformanceData) {
              const performanceData = createDataMatrix(
                filteredCollections,
                classPerformanceData,
                'lesson'
              );
              component.set('assessmentperformanceDataMatrix', performanceData);
              const assessmentperformanceData = Ember.computed(
                'assessmentperformanceDataMatrix.length',
                'sortCriteria',
                function() {
                  const performanceData = this.get(
                    'assessmentperformanceDataMatrix'
                  ).slice(1);
                  var lessonPerformanceObj = Ember.Object.create({
                    lessonId: lessonObj.id,
                    lessonData: component
                      .get('assessmentperformanceDataMatrix')
                      .objectAt(0)
                      .performanceData.slice(1)
                  });
                  component
                    .get('averageHeaderstempAssessment')
                    .pushObject(lessonPerformanceObj);
                  return performanceData;
                }
              );

              component.set(
                'assessmentperformanceData',
                assessmentperformanceData
              );
              var indxObj = 0;
              component
                .get('assessmentperformanceData')
                .forEach(function(item) {
                  var lessonUser = item.userId;
                  var assessmentperformanceData = item.performanceData;
                  component.get('performanceData').forEach(function(item1) {
                    var indexLesson = 0;
                    var tempInx = unitIndex + 1;
                    if (lessonUser === item1.userId) {
                      item1.performanceData.forEach(function(
                        item9,
                        lessonpIndex
                      ) {
                        if (item9 !== undefined && item9.id !== undefined) {
                          if (item9.id === unitId) {
                            item9.set('unitIdVal', unitId);
                            if (lessonpIndex === tempInx) {
                              var hdrObj = component
                                .get('averageHeaders')
                                .performanceData.objectAt(lessonpIndex);
                              hdrObj.set('unitIdVal', unitId);
                              component
                                .get('averageHeaders')
                                .performanceData.removeAt(lessonpIndex);
                              component
                                .get('averageHeaders')
                                .performanceData.insertAt(lessonpIndex, hdrObj);
                            }
                            assessmentperformanceData.removeAt(0);
                            item9.set('subColumns', []);
                            if (lessonIndex === 0) {
                              item9.set('subsubColumns', []);
                            }
                            var assessmentsStr = '';
                            var colcount = 0;
                            lesson
                              .get('children')
                              .forEach(function(assessmentObj) {
                                if (assessmentObj.format === filterBy) {
                                  assessmentsStr = `${assessmentsStr +
                                    assessmentObj.id},`;
                                  var emberObject = Ember.Object.create({
                                    id: assessmentObj.id,
                                    unitId: unitId,
                                    lessonId: lessonObj.id
                                  });
                                  if (
                                    item9.get('subsubColumns') !== undefined
                                  ) {
                                    item9
                                      .get('subsubColumns')
                                      .pushObject(emberObject);
                                  } else {
                                    item9.set('subsubColumns', []);
                                    item9
                                      .get('subsubColumns')
                                      .pushObject(emberObject);
                                  }
                                  colcount = colcount + 1;
                                }
                              });
                            if (tempVal === 0) {
                              assessmentsStr = `${`${assessmentsStr}NoObject`},`;
                              var emberObject = Ember.Object.create({
                                id: 'NoObject',
                                unitId: unitId,
                                lessonId: lessonObj.id
                              });
                              if (item9.get('subsubColumns') !== undefined) {
                                item9
                                  .get('subsubColumns')
                                  .pushObject(emberObject);
                              } else {
                                item9.set('subsubColumns', []);
                                item9
                                  .get('subsubColumns')
                                  .pushObject(emberObject);
                              }
                            }
                            for (
                              var j = 0;
                              j < assessmentperformanceData.length;
                              j++
                            ) {
                              if (
                                assessmentperformanceData[j] !== undefined &&
                                tempVal !== 0
                              ) {
                                if (
                                  assessmentsStr.indexOf(
                                    assessmentperformanceData[j].id
                                  ) !== -1
                                ) {
                                  var group = item9
                                    .get('subsubColumns')
                                    .findBy(
                                      'id',
                                      assessmentperformanceData[j].id
                                    );
                                  if (group !== undefined) {
                                    indxObj = item9
                                      .get('subsubColumns')
                                      .indexOf(group);
                                    assessmentperformanceData[j].set(
                                      'unitId',
                                      unitId
                                    );
                                    assessmentperformanceData[j].set(
                                      'lessonId',
                                      lessonObj.id
                                    );
                                    var objAtLesson = item9
                                      .get('subsubColumns')
                                      .objectAt(indxObj);

                                    if (objAtLesson.lessonId === lessonObj.id) {
                                      item9
                                        .get('subsubColumns')
                                        .removeAt(indxObj);
                                      item9
                                        .get('subsubColumns')
                                        .insertAt(
                                          indxObj,
                                          assessmentperformanceData[j]
                                        );
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        indexLesson = indexLesson + 1;
                      });
                    }
                  });
                  indxObj = indxObj + 1;
                });
            });
        }
      });
    index1 = index1 + 1;
  },

  getLessonPromise: function(params) {
    const component = this;
    return new Ember.RSVP.Promise(function(resolve) {
      component
        .get('lessonService')
        .fetchById(params.courseIdVal, params.unitId, params.lessonObj.id)
        .then(function(lesson) {
          resolve(lesson);
        });
    });
  },

  getResolvedLessons: function(params) {
    const component = this;
    var lessonall = [];
    params.lessons.forEach(function(lessonObj) {
      let lessonparam = _.extend(params, { lessonObj: lessonObj });
      let lessonresolve = component.getLessonPromise(lessonparam);
      lessonall.push(lessonresolve);
    });
    return Ember.RSVP.all(lessonall);
    //     return resolvedlessons;
    // })
    // Ember.RSVP.all(lessonall).then(function(resolvedlessons) {
    //     return resolvedlessons;
    // })
  },

  lessonsAssessment: function(
    courseIdVal,
    unitId,
    lessonObj,
    index1,
    lessonIndex,
    filterBy,
    unit,
    classId,
    members,
    temp,
    unitIndex,
    lessonLen,
    classPerformanceData
  ) {
    const component = this;
    const lesson = lessonObj;
    const filteredCollections = lesson
      .get('children')
      .filter(function(collection) {
        return filterBy === 'both' || collection.get('format') === filterBy;
      });
    Ember.set(lessonObj, 'subsubColumns', []);
    if (lessonIndex === 0) {
      component.set('averageHeadersAssessment', []);
    }
    var countCols = 0;
    var tempInx = index1 + 1;
    var array1 = [];
    var array2 = [];
    var arrayComplete = [];
    var timerConst = 1000;
    var tempVal = 0;
    if (lessonIndex === 0) {
      component.set('averageHeaderstempAssessment', []);
    }
    lesson.get('children').forEach(function(assessmentObj) {
      if (assessmentObj.format === filterBy) {
        tempVal = tempVal + 1;
        countCols = countCols + 1;
        var emberObject = Ember.Object.create({
          id: assessmentObj.id,
          lessonId: lessonObj.id,
          level: filterBy
        });
        var orginalTitle = assessmentObj.get('title');
        if (filterBy === 'assessment') {
          assessmentObj.set('title', `A${tempVal}: ${orginalTitle}`);
        } else {
          assessmentObj.set('title', `C${tempVal}: ${orginalTitle}`);
        }
        lessonObj.get('subsubColumns').pushObject(assessmentObj);
        component.get('averageHeadersAssessment').pushObject(emberObject);
      }
    });
    if (tempVal === 0) {
      countCols = countCols + 1;
      var tempassessmentObj = Ember.Object.create({
        format: filterBy,
        id: 'NoObject',
        collectionType: filterBy,
        openEndedQuestionCount: 0,
        questionCount: 0,
        resourceCount: 0,
        title: '--NO DATA--'
      });
      lessonObj.get('subsubColumns').pushObject(tempassessmentObj);
    }
    Ember.run.later(function() {
      component.set('averageHeadersAssessment', []);
      component
        .get('averageHeaderstempAssessment')
        .forEach(function(lessonItem) {
          var emberObject = Ember.Object.create({
            id: 'NoObject',
            lessonId: lessonItem.lessonId,
            collectionType: filterBy,
            unitId: unitId,
            level: filterBy
          });
          if (lessonItem.lessonData.length > 0) {
            lessonItem.lessonData.forEach(function(item23) {
              item23.set('level', filterBy);
              item23.set('unitId', unitId);
              item23.set('lessonId', lessonItem.lessonId);
              component.get('averageHeadersAssessment').pushObject(item23);
            });
          } else {
            component.get('averageHeadersAssessment').pushObject(emberObject);
          }
        });
      if (
        component.get('averageHeadersAssessment').length ===
        component.get('totalAssessments')
      ) {
        component.set('isLoading', false);
      }
      if (
        component.get('averageHeadersAssessment').length === 0 &&
        component.get('totalAssessments') === 0
      ) {
        var inxArr = [];
        component
          .get('averageHeaders')
          .performanceData.forEach(function(item, indx) {
            if (
              item.level !== undefined &&
              (item.level === 'lesson' || item.level === filterBy)
            ) {
              inxArr.pushObject(indx);
            }
          });
        inxArr.forEach(function(item, indx) {
          if (indx > 0) {
            component
              .get('averageHeaders')
              .performanceData.removeAt(inxArr.objectAt(indx) - indx);
          } else {
            component
              .get('averageHeaders')
              .performanceData.removeAt(inxArr.objectAt(indx));
          }
        });
      } else if (
        component.get('averageHeadersAssessment').length ===
        component.get('totalAssessments')
      ) {
        component
          .get('averageHeaders')
          .performanceData.forEach(function(item, indx) {
            if (indx < tempInx) {
              array1.pushObject(item);
            }
          });
        component
          .get('averageHeaders')
          .performanceData.forEach(function(item, indx) {
            if (indx >= tempInx) {
              array2.pushObject(item);
            }
          });

        if (array2.length > countCols) {
          var inxArr11 = [];
          component
            .get('averageHeaders')
            .performanceData.forEach(function(item, indx) {
              if (
                item.level !== undefined &&
                (item.level === 'lesson' || item.level === filterBy)
              ) {
                inxArr11.pushObject(indx);
              }
            });
          inxArr11.forEach(function(item, indx) {
            if (indx > 0) {
              component
                .get('averageHeaders')
                .performanceData.removeAt(inxArr11.objectAt(indx) - indx);
            } else {
              component
                .get('averageHeaders')
                .performanceData.removeAt(inxArr11.objectAt(indx));
            }
          });
          array2.forEach(function(item, indx) {
            if (
              (item.level !== undefined && item.level === filterBy) ||
              (item.collectionType !== undefined &&
                item.collectionType === filterBy)
            ) {
              array2.removeAt(indx);
            }
          });
          arrayComplete.pushObjects(array1);
          arrayComplete.pushObjects(component.get('averageHeadersAssessment'));
          array2.forEach(function(item) {
            if (
              !(
                (item.collectionType !== undefined &&
                  item.collectionType === filterBy) ||
                (item.level !== undefined && item.level === filterBy)
              )
            ) {
              arrayComplete.pushObject(item);
            }
          });
          component.get('averageHeaders').set('performanceData', arrayComplete);
        } else {
          array2.forEach(function(item, indx) {
            if (
              (item.level !== undefined && item.level === filterBy) ||
              (item.collectionType !== undefined &&
                item.collectionType === filterBy)
            ) {
              array2.removeAt(indx);
            }
          });
          arrayComplete.pushObjects(array1);
          arrayComplete.pushObjects(component.get('averageHeadersAssessment'));
          array2.forEach(function(item) {
            if (
              !(
                (item.collectionType !== undefined &&
                  item.collectionType === filterBy) ||
                (item.level !== undefined && item.level === filterBy)
              )
            ) {
              arrayComplete.pushObject(item);
            }
          });
          component.get('averageHeaders').set('performanceData', arrayComplete);
        }
      }
    }, timerConst);
    if (countCols === 0) {
      var lessonValObj = temp.get('subColumns').findBy('id', lessonObj.id);
      if (lessonValObj !== undefined) {
        var indx = temp.get('subColumns').indexOf(lessonValObj);
        temp.get('subColumns').removeAt(indx);
      }
      component.set('isLoading', false);
    }
    if (countCols > 0) {
      component.set(
        'totalAssessments',
        component.get('totalAssessments') + countCols
      );
      Ember.set(temp, 'colspanval', component.get('totalAssessments') + 1);
      // component
      //   .get('performanceService')
      //   .findClassPerformanceByUnitAndLesson(
      //     classId,
      //     courseIdVal,
      //     unitId,
      //     lessonObj.id,
      //     members.get('members'),
      //     { collectionType: filterBy }
      //   )
      //   .then(function(classPerformanceData) {
      const performanceData = createDataMatrix(
        filteredCollections,
        classPerformanceData,
        'lesson'
      );
      component.set('assessmentperformanceDataMatrix', performanceData);
      const assessmentperformanceData = Ember.computed(
        'assessmentperformanceDataMatrix.length',
        'sortCriteria',
        function() {
          const performanceData = this.get(
            'assessmentperformanceDataMatrix'
          ).slice(1);
          var lessonPerformanceObj = Ember.Object.create({
            lessonId: lessonObj.id,
            lessonData: component
              .get('assessmentperformanceDataMatrix')
              .objectAt(0)
              .performanceData.slice(1)
          });
          component
            .get('averageHeaderstempAssessment')
            .pushObject(lessonPerformanceObj);
          return performanceData;
        }
      );

      component.set('assessmentperformanceData', assessmentperformanceData);
      var indxObj = 0;
      component.get('assessmentperformanceData').forEach(function(item) {
        var lessonUser = item.userId;
        var assessmentperformanceData = item.performanceData;
        component.get('performanceData').forEach(function(item1) {
          var indexLesson = 0;
          var tempInx = unitIndex + 1;
          if (lessonUser === item1.userId) {
            item1.performanceData.forEach(function(item9, lessonpIndex) {
              if (item9 !== undefined && item9.id !== undefined) {
                if (item9.id === unitId) {
                  item9.set('unitIdVal', unitId);
                  if (lessonpIndex === tempInx) {
                    var hdrObj = component
                      .get('averageHeaders')
                      .performanceData.objectAt(lessonpIndex);
                    hdrObj.set('unitIdVal', unitId);
                    component
                      .get('averageHeaders')
                      .performanceData.removeAt(lessonpIndex);
                    component
                      .get('averageHeaders')
                      .performanceData.insertAt(lessonpIndex, hdrObj);
                  }
                  assessmentperformanceData.removeAt(0);
                  item9.set('subColumns', []);
                  if (lessonIndex === 0) {
                    item9.set('subsubColumns', []);
                  }
                  var assessmentsStr = '';
                  var colcount = 0;
                  lesson.get('children').forEach(function(assessmentObj) {
                    if (assessmentObj.format === filterBy) {
                      assessmentsStr = `${assessmentsStr + assessmentObj.id},`;
                      var emberObject = Ember.Object.create({
                        id: assessmentObj.id,
                        unitId: unitId,
                        lessonId: lessonObj.id
                      });
                      if (item9.get('subsubColumns') !== undefined) {
                        item9.get('subsubColumns').pushObject(emberObject);
                      } else {
                        item9.set('subsubColumns', []);
                        item9.get('subsubColumns').pushObject(emberObject);
                      }
                      colcount = colcount + 1;
                    }
                  });
                  if (tempVal === 0) {
                    assessmentsStr = `${`${assessmentsStr}NoObject`},`;
                    var emberObject = Ember.Object.create({
                      id: 'NoObject',
                      unitId: unitId,
                      lessonId: lessonObj.id
                    });
                    if (item9.get('subsubColumns') !== undefined) {
                      item9.get('subsubColumns').pushObject(emberObject);
                    } else {
                      item9.set('subsubColumns', []);
                      item9.get('subsubColumns').pushObject(emberObject);
                    }
                  }
                  for (var j = 0; j < assessmentperformanceData.length; j++) {
                    if (
                      assessmentperformanceData[j] !== undefined &&
                      tempVal !== 0
                    ) {
                      if (
                        assessmentsStr.indexOf(
                          assessmentperformanceData[j].id
                        ) !== -1
                      ) {
                        var group = item9
                          .get('subsubColumns')
                          .findBy('id', assessmentperformanceData[j].id);
                        if (group !== undefined) {
                          indxObj = item9.get('subsubColumns').indexOf(group);
                          assessmentperformanceData[j].set('unitId', unitId);
                          assessmentperformanceData[j].set(
                            'lessonId',
                            lessonObj.id
                          );
                          var objAtLesson = item9
                            .get('subsubColumns')
                            .objectAt(indxObj);

                          if (objAtLesson.lessonId === lessonObj.id) {
                            item9.get('subsubColumns').removeAt(indxObj);
                            item9
                              .get('subsubColumns')
                              .insertAt(indxObj, assessmentperformanceData[j]);
                          }
                        }
                      }
                    }
                  }
                }
              }
              indexLesson = indexLesson + 1;
            });
          }
        });
        indxObj = indxObj + 1;
      });
      //});
    }
    //});
    index1 = index1 + 1;
  },
  eachLessonAssessment: function(
    courseIdVal,
    unitId,
    lessonObj,
    index1,
    lessonIndex,
    filterBy,
    unit,
    classId,
    members,
    temp,
    unitIndex,
    lessonLen,
    classPerformanceData
  ) {
    const component = this;
    component
      .get('lessonService')
      .fetchById(courseIdVal, unitId, lessonObj.id)
      .then(function(lesson) {
        const filteredCollections = lesson
          .get('children')
          .filter(function(collection) {
            return filterBy === 'both' || collection.get('format') === filterBy;
          });
        Ember.set(lessonObj, 'subsubColumns', []);
        if (lessonIndex === 0) {
          component.set('averageHeadersAssessment', []);
        }
        var countCols = 0;
        var tempInx = index1 + 1;
        var array1 = [];
        var array2 = [];
        var arrayComplete = [];
        var timerConst = 1000;
        var tempVal = 0;
        if (lessonIndex === 0) {
          component.set('averageHeaderstempAssessment', []);
        }
        lesson.get('children').forEach(function(assessmentObj) {
          if (assessmentObj.format === filterBy) {
            tempVal = tempVal + 1;
            countCols = countCols + 1;
            var emberObject = Ember.Object.create({
              id: assessmentObj.id,
              lessonId: lessonObj.id,
              level: filterBy
            });
            var orginalTitle = assessmentObj.get('title');
            if (filterBy === 'assessment') {
              assessmentObj.set('title', `A${tempVal}: ${orginalTitle}`);
            } else {
              assessmentObj.set('title', `C${tempVal}: ${orginalTitle}`);
            }
            lessonObj.get('subsubColumns').pushObject(assessmentObj);
            component.get('averageHeadersAssessment').pushObject(emberObject);
          }
        });
        if (tempVal === 0) {
          countCols = countCols + 1;
          var tempassessmentObj = Ember.Object.create({
            format: filterBy,
            id: 'NoObject',
            collectionType: filterBy,
            openEndedQuestionCount: 0,
            questionCount: 0,
            resourceCount: 0,
            title: '--NO DATA--'
          });
          lessonObj.get('subsubColumns').pushObject(tempassessmentObj);
        }
        Ember.run.later(function() {
          component.set('averageHeadersAssessment', []);
          component
            .get('averageHeaderstempAssessment')
            .forEach(function(lessonItem) {
              var emberObject = Ember.Object.create({
                id: 'NoObject',
                lessonId: lessonItem.lessonId,
                collectionType: filterBy,
                unitId: unitId,
                level: filterBy
              });
              if (lessonItem.lessonData.length > 0) {
                lessonItem.lessonData.forEach(function(item23) {
                  item23.set('level', filterBy);
                  item23.set('unitId', unitId);
                  item23.set('lessonId', lessonItem.lessonId);
                  component.get('averageHeadersAssessment').pushObject(item23);
                });
              } else {
                component
                  .get('averageHeadersAssessment')
                  .pushObject(emberObject);
              }
            });
          if (
            component.get('averageHeadersAssessment').length ===
            component.get('totalAssessments')
          ) {
            component.set('isLoading', false);
          }
          if (
            component.get('averageHeadersAssessment').length === 0 &&
            component.get('totalAssessments') === 0
          ) {
            var inxArr = [];
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (
                  item.level !== undefined &&
                  (item.level === 'lesson' || item.level === filterBy)
                ) {
                  inxArr.pushObject(indx);
                }
              });
            inxArr.forEach(function(item, indx) {
              if (indx > 0) {
                component
                  .get('averageHeaders')
                  .performanceData.removeAt(inxArr.objectAt(indx) - indx);
              } else {
                component
                  .get('averageHeaders')
                  .performanceData.removeAt(inxArr.objectAt(indx));
              }
            });
          } else if (
            component.get('averageHeadersAssessment').length ===
            component.get('totalAssessments')
          ) {
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (indx < tempInx) {
                  array1.pushObject(item);
                }
              });
            component
              .get('averageHeaders')
              .performanceData.forEach(function(item, indx) {
                if (indx >= tempInx) {
                  array2.pushObject(item);
                }
              });

            if (array2.length > countCols) {
              var inxArr11 = [];
              component
                .get('averageHeaders')
                .performanceData.forEach(function(item, indx) {
                  if (
                    item.level !== undefined &&
                    (item.level === 'lesson' || item.level === filterBy)
                  ) {
                    inxArr11.pushObject(indx);
                  }
                });
              inxArr11.forEach(function(item, indx) {
                if (indx > 0) {
                  component
                    .get('averageHeaders')
                    .performanceData.removeAt(inxArr11.objectAt(indx) - indx);
                } else {
                  component
                    .get('averageHeaders')
                    .performanceData.removeAt(inxArr11.objectAt(indx));
                }
              });
              array2.forEach(function(item, indx) {
                if (
                  (item.level !== undefined && item.level === filterBy) ||
                  (item.collectionType !== undefined &&
                    item.collectionType === filterBy)
                ) {
                  array2.removeAt(indx);
                }
              });
              arrayComplete.pushObjects(array1);
              arrayComplete.pushObjects(
                component.get('averageHeadersAssessment')
              );
              array2.forEach(function(item) {
                if (
                  !(
                    (item.collectionType !== undefined &&
                      item.collectionType === filterBy) ||
                    (item.level !== undefined && item.level === filterBy)
                  )
                ) {
                  arrayComplete.pushObject(item);
                }
              });
              component
                .get('averageHeaders')
                .set('performanceData', arrayComplete);
            } else {
              array2.forEach(function(item, indx) {
                if (
                  (item.level !== undefined && item.level === filterBy) ||
                  (item.collectionType !== undefined &&
                    item.collectionType === filterBy)
                ) {
                  array2.removeAt(indx);
                }
              });
              arrayComplete.pushObjects(array1);
              arrayComplete.pushObjects(
                component.get('averageHeadersAssessment')
              );
              array2.forEach(function(item) {
                if (
                  !(
                    (item.collectionType !== undefined &&
                      item.collectionType === filterBy) ||
                    (item.level !== undefined && item.level === filterBy)
                  )
                ) {
                  arrayComplete.pushObject(item);
                }
              });
              component
                .get('averageHeaders')
                .set('performanceData', arrayComplete);
            }
          }
        }, timerConst);
        if (countCols === 0) {
          var lessonValObj = temp.get('subColumns').findBy('id', lessonObj.id);
          if (lessonValObj !== undefined) {
            var indx = temp.get('subColumns').indexOf(lessonValObj);
            temp.get('subColumns').removeAt(indx);
          }
          component.set('isLoading', false);
        }
        if (countCols > 0) {
          component.set(
            'totalAssessments',
            component.get('totalAssessments') + countCols
          );
          Ember.set(temp, 'colspanval', component.get('totalAssessments') + 1);
          // component
          //   .get('performanceService')
          //   .findClassPerformanceByUnitAndLesson(
          //     classId,
          //     courseIdVal,
          //     unitId,
          //     lessonObj.id,
          //     members.get('members'),
          //     { collectionType: filterBy }
          //   )
          //   .then(function(classPerformanceData) {
          const performanceData = createDataMatrix(
            filteredCollections,
            classPerformanceData,
            'lesson'
          );
          component.set('assessmentperformanceDataMatrix', performanceData);
          const assessmentperformanceData = Ember.computed(
            'assessmentperformanceDataMatrix.length',
            'sortCriteria',
            function() {
              const performanceData = this.get(
                'assessmentperformanceDataMatrix'
              ).slice(1);
              var lessonPerformanceObj = Ember.Object.create({
                lessonId: lessonObj.id,
                lessonData: component
                  .get('assessmentperformanceDataMatrix')
                  .objectAt(0)
                  .performanceData.slice(1)
              });
              component
                .get('averageHeaderstempAssessment')
                .pushObject(lessonPerformanceObj);
              return performanceData;
            }
          );

          component.set('assessmentperformanceData', assessmentperformanceData);
          var indxObj = 0;
          component.get('assessmentperformanceData').forEach(function(item) {
            var lessonUser = item.userId;
            var assessmentperformanceData = item.performanceData;
            component.get('performanceData').forEach(function(item1) {
              var indexLesson = 0;
              var tempInx = unitIndex + 1;
              if (lessonUser === item1.userId) {
                item1.performanceData.forEach(function(item9, lessonpIndex) {
                  if (item9 !== undefined && item9.id !== undefined) {
                    if (item9.id === unitId) {
                      item9.set('unitIdVal', unitId);
                      if (lessonpIndex === tempInx) {
                        var hdrObj = component
                          .get('averageHeaders')
                          .performanceData.objectAt(lessonpIndex);
                        hdrObj.set('unitIdVal', unitId);
                        component
                          .get('averageHeaders')
                          .performanceData.removeAt(lessonpIndex);
                        component
                          .get('averageHeaders')
                          .performanceData.insertAt(lessonpIndex, hdrObj);
                      }
                      assessmentperformanceData.removeAt(0);
                      item9.set('subColumns', []);
                      if (lessonIndex === 0) {
                        item9.set('subsubColumns', []);
                      }
                      var assessmentsStr = '';
                      var colcount = 0;
                      lesson.get('children').forEach(function(assessmentObj) {
                        if (assessmentObj.format === filterBy) {
                          assessmentsStr = `${assessmentsStr +
                            assessmentObj.id},`;
                          var emberObject = Ember.Object.create({
                            id: assessmentObj.id,
                            unitId: unitId,
                            lessonId: lessonObj.id
                          });
                          if (item9.get('subsubColumns') !== undefined) {
                            item9.get('subsubColumns').pushObject(emberObject);
                          } else {
                            item9.set('subsubColumns', []);
                            item9.get('subsubColumns').pushObject(emberObject);
                          }
                          colcount = colcount + 1;
                        }
                      });
                      if (tempVal === 0) {
                        assessmentsStr = `${`${assessmentsStr}NoObject`},`;
                        var emberObject = Ember.Object.create({
                          id: 'NoObject',
                          unitId: unitId,
                          lessonId: lessonObj.id
                        });
                        if (item9.get('subsubColumns') !== undefined) {
                          item9.get('subsubColumns').pushObject(emberObject);
                        } else {
                          item9.set('subsubColumns', []);
                          item9.get('subsubColumns').pushObject(emberObject);
                        }
                      }
                      for (
                        var j = 0;
                        j < assessmentperformanceData.length;
                        j++
                      ) {
                        if (
                          assessmentperformanceData[j] !== undefined &&
                          tempVal !== 0
                        ) {
                          if (
                            assessmentsStr.indexOf(
                              assessmentperformanceData[j].id
                            ) !== -1
                          ) {
                            var group = item9
                              .get('subsubColumns')
                              .findBy('id', assessmentperformanceData[j].id);
                            if (group !== undefined) {
                              indxObj = item9
                                .get('subsubColumns')
                                .indexOf(group);
                              assessmentperformanceData[j].set(
                                'unitId',
                                unitId
                              );
                              assessmentperformanceData[j].set(
                                'lessonId',
                                lessonObj.id
                              );
                              var objAtLesson = item9
                                .get('subsubColumns')
                                .objectAt(indxObj);

                              if (objAtLesson.lessonId === lessonObj.id) {
                                item9.get('subsubColumns').removeAt(indxObj);
                                item9
                                  .get('subsubColumns')
                                  .insertAt(
                                    indxObj,
                                    assessmentperformanceData[j]
                                  );
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  indexLesson = indexLesson + 1;
                });
              }
            });
            indxObj = indxObj + 1;
          });
          //});
        }
      });
    index1 = index1 + 1;
  },
  storeClickValues: function(unitId) {
    let localStorage = window.localStorage;
    localStorage.setItem('uId', unitId);
    localStorage.setItem('cId', this.get('classId'));
  },
  getStoredUnitIdVal: function() {
    let localStorage = window.localStorage;
    if (this.get('classId') === localStorage.getItem('cId')) {
      return localStorage.getItem('uId');
    } else {
      localStorage.setItem('uId', null);
      localStorage.setItem('cId', null);
      return null;
    }
  },
  expandByUnit: function(unitId) {
    this.set('isLoading', true);
    var unitObj = this.get('headers').findBy('id', unitId);
    if (unitObj !== undefined) {
      var index = this.get('headers').indexOf(unitObj);
      var temp = this.get('headers').objectAt(index);
      if (this.get('tempUnitId') !== null) {
        var unitDetails = this.get('tempheaders').findBy(
          'id',
          this.get('tempUnitId')
        );
        if (unitDetails !== undefined) {
          this.removeexpandedUnit();
          this.set('filterBy', this.get('filterBy'));
          this.set('tempUnitId', temp.get('id'));
          this.storeClickValues(temp.get('id'));
          this.set('isExpanded', true);
          this.set('tempheaders', this.get('headers'));
          this.expandLesson(temp.get('id'), index);
          Ember.set(temp, 'showSub', true);
          this.set('expandedUnit', true);
          Ember.set(temp, 'showSubSub', true);
          Ember.set(temp, 'showAssessments', true);
        }
      } else {
        this.set('filterBy', this.get('filterBy'));
        this.set('tempUnitId', temp.get('id'));
        this.storeClickValues(temp.get('id'));
        this.set('isExpanded', true);
        this.set('tempheaders', this.get('headers'));
        this.expandLesson(temp.get('id'), index);
        Ember.set(temp, 'showSub', true);
        this.set('expandedUnit', true);
        Ember.set(temp, 'showSubSub', true);
        Ember.set(temp, 'showAssessments', true);
      }
    }
  },
  /**
   * Initialize the table's sort criteria
   * @return {Object}
   */
  initSortCriteria: function() {
    return {
      metricsIndex: -1,
      order: this.get('defaultSortOrder')
    };
  }
});
