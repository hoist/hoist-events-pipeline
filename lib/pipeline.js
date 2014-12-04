'use strict';
var EventBroker = require('broker');

function Pipeline(Context, Model) {
  this.Context = Context || require('hoist-context');
  this.Model = Model || require('hoist-model');
  EventBroker.ModelResolver.set(this.Model);
  this.eventBroker = new EventBroker();
}

Pipeline.prototype.raise = function raise(eventName, payload, overrideContext) {

  return this.Context.get().bind(this).then(function (context) {
    var cid;
    if (context.event) {
      cid = context.event.correlationId;
    }
    cid = cid || require('uuid').v4();
    var bucketId;
    if (context.bucket) {
      bucketId = context.bucket._id;
    }
    console.log('bucketId from context', bucketId);
    if (overrideContext && overrideContext.bucket) {
      console.log('overrideing bucketid');
      if (overrideContext.bucket._id) {
        bucketId = overrideContext.bucket._id;
      } else {
        bucketId = overrideContext.bucket;
      }

    }
    console.log('bucketid after override',bucketId);
    var ev = new EventBroker.events.ApplicationEvent({
      applicationId: context.application._id,
      eventName: eventName,
      environment: context.environment,
      bucketId: bucketId,
      correlationId: cid,
      payload: payload
    });
    return this.eventBroker.send(ev).then(function () {
      return ev;
    });
  });
};

module.exports = function (hoistContext, Model) {
  return new Pipeline(hoistContext, Model);
};
module.exports.Pipeline = Pipeline;
