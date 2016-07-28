import Ember from 'ember';
import Env from 'gooru-web/config/environment';
import EndPointsConfig from 'gooru-web/utils/endpoint-config';

export default {
  name: 'ajax',

  initialize: function(/* app */) {
    Ember.$.ajaxSetup({
      cache: false,
      crossDomain: true,
      beforeSend: function(jqXHR, settings) {
        const url = settings.url;
        if (url.startsWith('/')) {
          if (url.startsWith(EndPointsConfig.getRealTimeWebServiceUri()) || url.startsWith(EndPointsConfig.getRealTimeWebSocketUri())) {
            const realTimeUrl = EndPointsConfig.getRealTimeWebServiceUrl();
            settings.url = `${realTimeUrl}${url}`;
          } else {
            const endpointUrl = EndPointsConfig.getEndpointUrl();
            settings.url = `${endpointUrl}${url}`;
          }
        }
      }
    });
  }
};
