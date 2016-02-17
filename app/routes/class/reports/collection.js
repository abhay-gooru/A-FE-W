import Ember from 'ember';
import ReportData from 'gooru-web/models/result/report-data';

/**
 * Route for collection/assessment report
 *
 * Gathers and passes initialization data for class performance
 * from analytics to the controller
 *
 * @module
 * @augments ember/Route
 */
export default Ember.Route.extend({

  // -------------------------------------------------------------------------
  // Dependencies

  session: Ember.inject.service('session'),

  performanceService: Ember.inject.service('api-sdk/performance'),


  // -------------------------------------------------------------------------
  // Methods

  beforeModel: function () {
    // TODO: authenticate session with ember-simple-auth, if not send to log in
  },

  model: function (params) {
    const classId = this.paramsFor('class').classId;
    const collectionId = params.collectionId;

    // 9 resources are hard code so we can represent all question types
    let resources = Ember.A([
      Ember.Object.create({ //Multiple Choice
        "id": "569906aa20b7dfae1bcd5262",
        questionType: 'MC',
        text: 'Sample Question MC',
        answers: Ember.A([
          Ember.Object.create({id: 1, isCorrect: false, text: "Answer 1"}),
          Ember.Object.create({id: 2, isCorrect: false, text: "Answer 2"}),
          Ember.Object.create({id: 3, isCorrect: true, text: "Answer 3"})
        ]),
        order: 1,
        "resourceFormat": "question",
        "narration": "Id eu mollit sunt Lorem voluptate ut officia ut. Non non nulla exercitation eu duis laboris Lorem id deserunt ullamco laborum aliqua nostrud. Dolor consequat dolor consequat labore officia cillum ad nulla proident. Veniam consequat sint Lorem nulla reprehenderit occaecat dolore excepteur eiusmod.",
        "hints": [
          {
            "hintId": "98cdadb3-5ef4-4fad-92c5-3c09403ce5e6",
            "hintText": "<p>Deserunt voluptate labore est sit nostrud ex et quis aliqua veniam deserunt ullamco.</p>",
            "sequence": 1
          },
          {
            "hintId": "21e07610-a788-4549-a57c-b79ab32b8909",
            "hintText": "<p>Pariatur est excepteur est cupidatat.</p>",
            "sequence": 2
          }
        ],
        "explanation": "<p>Culpa laborum deserunt cillum sunt laboris voluptate ut ea elit ex adipisicing officia. Ad laboris tempor officia non ut sit consequat quis esse et cupidatat officia.</p>",
        "hasAnswers": true,
        "hasNarration": true
      }),
      Ember.Object.create({ //true false
        "id": "569906aa3ec3bb39969acbe6",
        questionType: 'T/F',
        text: 'True False Question',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([
          Ember.Object.create({id: "1", isCorrect: true, text: "True"}),
          Ember.Object.create({id: "2", isCorrect: false, text: "False"}),
        ]),
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 2,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aadfa0072204f7c7c7",
        questionType: 'HT_RO',
        text: 'Reorder Question',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([ // ["crc", "bra", "pan", "chi"]
          Ember.Object.create({id: "crc", text: "Costa Rica", order: 1}),
          Ember.Object.create({id: "bra", text: "Brasil", order: 2}),
          Ember.Object.create({id: "pan", text: "Panamá", order: 3}),
          Ember.Object.create({id: "chi", text: "Chile", order: 4})
        ]),
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 3,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aacea8416665209d53",
        questionType: 'FIB',
        text: 'The sun is _______ and the moon _______',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([
          Ember.Object.create({id: 1, text: 'yellow'}),
          Ember.Object.create({id: 2, text: 'white'})
        ]),
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 4,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aa77bebed003fa6eb1",
        questionType: 'MA',
        text: 'Sample Question MA',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([ // [{id: "1", selection: false}, {id: "2", selection: true}, {id: "3", selection: true}]
          Ember.Object.create({id: "1", isCorrect: false, text: "Answer 1"}),
          Ember.Object.create({id: "2", isCorrect: true, text: "Answer 2"}),
          Ember.Object.create({id: "3", isCorrect: true, text: "Answer 3"})
        ]),
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 5,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aa68f276ae7ea03c30",
        questionType: 'HT_HL',
        text: '<p>Seleccione las palabras escritas incorrectamente</p>',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([ // ["le", "colo", "teco"]
          Ember.Object.create({id: "1", text: "<p>[Le] casa es de [colo] rojo pero pero el [teco] es azul ajax</p>"})
        ]),
        isHotTextHighlightWord: true,
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 6,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aa04f742731bd4e896",
        questionType: 'HS_IMG',
        text: 'Sample Question HS_IMG',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([ // ["1", "3"]
          Ember.Object.create({
            id: "1",
            isCorrect: true,
            image: "http://qacdn.gooru.org/qalive/f000/2441/3272/4a12b833-9106-48ef-95b5-ac3ff73575ae.png"
          }),
          Ember.Object.create({id: "2", isCorrect: false, image: ""}),
          Ember.Object.create({id: "3", isCorrect: true, image: ""})
        ]),
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "narration": "Deserunt occaecat ullamco cillum in incididunt anim sit consequat consequat sit. Ipsum duis irure do quis amet cupidatat tempor qui nulla commodo nisi veniam. Culpa Lorem consequat ad officia. Consectetur minim pariatur id laborum tempor voluptate dolor quis laboris et quis commodo.",
        "order": 7,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aabfcfc4cfc1b29b62",
        questionType: 'HS_TXT',
        text: 'Sample Question HS_TXT',
        hints: [],
        explanation: 'Sample explanation text',
        answers: Ember.A([ // ["1", "3"]
          Ember.Object.create({id: "1", isCorrect: true, text: "Answer 1"}),
          Ember.Object.create({id: "2", isCorrect: false, text: "Answer 2"}),
          Ember.Object.create({id: "3", isCorrect: true, text: "Answer 3"})
        ]),
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 8,
        "hasAnswers": true
      }),
      Ember.Object.create({
        "id": "569906aa7fe0695bfd409731",
        questionType: 'OE',
        text: 'Sample Question OE',
        hints: [],
        explanation: 'Sample explanation text',
        answers: [],
        "resourceType": "assessment-question",
        "resourceFormat": "question",
        "order": 9
      })
    ]);

    for (let i = 0; i < 16; i++) { //extra resources to control how many questions to display
      let extraResource = Ember.Object.create({
        "id": "569906aa20b7dfae1bcd5" + i,
        questionType: 'MC',
        text: 'Sample Question MC',
        answers: Ember.A([
          Ember.Object.create({id: 1, isCorrect: false, text: "Answer 1"}),
          Ember.Object.create({id: 2, isCorrect: false, text: "Answer 2"}),
          Ember.Object.create({id: 3, isCorrect: true, text: "Answer 3"})
        ]),
        "order": 10 + i,
        "hasAnswers": true,
        "hasNarration": true
      });

      resources.addObject(extraResource);
    }

    // TODO: Get this object by calling the corresponding service
    const assessment = Ember.Object.create({

      collectionType: 'assessment',
      title: 'Sample Assessment Name',

      // Will this value be the same as questionCount
      // if there are only questions in the collection?
      resourceCount: resources.length,
      questionCount: resources.length,
      visibility: true,
      resources: resources,
      hasResources: true,
      isAssessment: true
    });

    // TODO: Get this object by calling the corresponding service
    const students = Ember.A([
      Ember.Object.create({
        "id": "56983a9060a68052c1ed934c",
        "fullName": "Rocha, Perez",
        "code": 'd934c'
      }),
      Ember.Object.create({
        "id": "56983a90fb01fecc328e2388",
        "fullName": "Snyder, Mason",
        "code": 'e2388'
      }),
      Ember.Object.create({
        "id": "56983a906596902edadedc7c",
        "fullName": "Robles, Guadalupe",
        "code": 'edc7c'
      }),
      Ember.Object.create({
        "id": "56983a901bc3d60c88ac2fe2",
        "fullName": "George, Mariana",
        "code": 'ac2fe2'
      }),
      Ember.Object.create({
        "id": "56983a9082f705e65f2fe607",
        "fullName": "Hutchinson, Blake",
        "code": '2fe607'
      }),
      Ember.Object.create({
        "id": "56983a905ed41a7863401287",
        "fullName": "Maddox, Vincent",
        "code": '01287'
      }),
      Ember.Object.create({
        "id": "56983a90297d42fd4ed7c1de",
        "fullName": "Chase, Brandie",
        "code": '7c1de'
      }),
      Ember.Object.create({
        "id": "56983a900f77bf820df2cb9c",
        "fullName": "Higgins, Nellie",
        "code": '2cb9c'
      }),
      Ember.Object.create({
        "id": "56983a90231a29de51a368d4",
        "fullName": "Pope, Adele",
        "code": '368d4'
      }),
      Ember.Object.create({
        "id": "56983a901ad65da6dac5b384",
        "fullName": "Steele, Nadine",
        "code": '5b384'
      })
    ]);

    // Get initialization data from analytics
    const userResults = this.get('performanceService').findClassPerformanceByCollection(classId, collectionId);

    return Ember.RSVP.hash({
      routeParams: Ember.Object.create({
        classId: classId,
        collectionId: collectionId
      }),
      assessment: assessment,
      students: students,
      userResults: userResults
    });
  },

  setupController: function (controller, model) {

    // Create an instance of report data to pass to the controller.
    var reportData = ReportData.create({
      students: model.students,
      resources: model.assessment.get('resources')
    });

    // Merge any data from analytics into the report data.
    reportData.merge(model.userResults);

    controller.set('routeParams', model.routeParams);
    controller.set('assessment', model.assessment);
    controller.set('students', model.students);
    controller.set('reportData', reportData);
  },

  resetController: function (controller) {
    // When exiting, reset the controller values
    controller.setProperties({
      routeParams: null,
      assessment: null,
      students: null,
      reportData: null
    });
  }

});