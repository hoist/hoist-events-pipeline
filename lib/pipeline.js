'use strict';
var ApplicationEvent = require('broker/lib/event_types/application_event');
var EventBroker = require('broker/lib/event_broker');

function Pipeline(Context) {
  this.Context = Context || require('hoist-context');
}

Pipeline.prototype.raise = function raise(eventName, payload) {
  return this.Context.get().then(function (context) {
    var ev = new ApplicationEvent({
      applicationId: context.application._id,
      eventName: eventName,
      environment: context.environment,
      correlationId: require('uuid').v4(),
      payload: payload
    });
    return EventBroker.publish(ev).then(function () {
      return ev;
    });
  });
};

module.exports = function (hoistContext) {
  return new Pipeline(hoistContext);
};
module.exports.Pipeline = Pipeline;
