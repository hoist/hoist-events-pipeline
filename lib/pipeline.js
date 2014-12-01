'use strict';
var EventBroker = require('broker');

function Pipeline(Context) {
  this.Context = Context || require('hoist-context');
  this.eventBroker = new EventBroker();
}

Pipeline.prototype.raise = function raise(eventName, payload) {
  return this.Context.get().bind(this).then(function (context) {
    var cid;
    if (context.event) {
      cid = context.event.correlationId;
    }
    cid = cid || require('uuid').v4();

    var ev = new EventBroker.events.ApplicationEvent({
      applicationId: context.application._id,
      eventName: eventName,
      environment: context.environment,
      correlationId: cid,
      payload: payload
    });
    return this.eventBroker.send(ev).then(function () {
      return ev;
    });
  });
};

module.exports = function (hoistContext) {
  return new Pipeline(hoistContext);
};
module.exports.Pipeline = Pipeline;
