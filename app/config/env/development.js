/*
 Development Environment configuration properties
 */
export default {
  "appRootPath": "/", //default is root
  "endpoint" : {
    "url": "http://nile-dev.gooru.org",
    "secureUrl": "https://nile-dev.gooru.org",
    "tenantUrl": "http://s3-us-west-1.amazonaws.com/nile-tenants/dev"
  },

  "realTime": {
    "webServiceUrl": "http://nile-dev.gooru.org",
    "webServiceUri": "/nucleus/realtime",
    "webSocketUrl": "https://rt.nile-dev.gooru.org",
    "webSocketUri": "/ws/realtime"
  },

  "teams": {
    "url": "http://teams-qa.gooru.org"
  },

  "player": {
    "resources":{
      "pdf": {
        "googleDriveEnable": false,
        "googleDriveUrl":"https://docs.google.com/gview?url="
      }
    }
  },

  "themes": {
    "bergen": {
      "player": {
        "narration": {
          "highlightColor": "#C1E7D9"
        }
      }
    }
  },

  "quizzes-addon": {
    "endpoint" : {
      "url": "https://qa.api.quizzes.edify.cr",
      "secureUrl": "https://qa.api.quizzes.edify.cr",
      "providerUrl": "https://nile-qa.gooru.org"
    },

    "realTime": {
      "webServiceUrl": "https://qa.api.quizzes.edify.cr",
      "webServiceUri": "/",
      "webSocketUrl": "https://qa.api.quizzes.edify.cr",
      "webSocketUri": "/ws/quizzes-realtime"
    }
  }
};
