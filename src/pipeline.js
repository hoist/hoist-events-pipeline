'use strict';

import {
  Publisher
}
from '@hoist/broker';
import logger from '@hoist/logger';
import {
  Event
}
from '@hoist/model';
import Context from '@hoist/context';

/**
 * Hoist Pipeline class for raising events
 */
class Pipeline {
  /**
   * create a new pipeline object
   */
  constructor() {
    this._publisher = new Publisher();
    this._logger = logger.child({
      cls: this.constructor.name
    });
  }

  /**
   * raise an event with the given name and payload
   * @
   */
  raise(eventName, payload, overrideContext) {
    return Context.get().then((context) => {
      var cid;
      if (context.event) {
        cid = context.event.correlationId;
      }
      cid = cid || require('uuid').v4();
      var bucketId;
      if (context.bucket) {
        bucketId = context.bucket._id;
      }
      this._logger.info('bucketId from context', bucketId);
      if (overrideContext && overrideContext.bucket) {
        this._logger.info('overrideing bucketid');
        if (overrideContext.bucket._id) {
          bucketId = overrideContext.bucket._id;
        } else {
          bucketId = overrideContext.bucket;
        }

      }
      this._logger.info('bucketid after override', bucketId);
      var ev = new Event({
        applicationId: context.application._id,
        eventName: eventName,
        environment: context.environment,
        bucketId: bucketId,
        correlationId: cid,
        payload: payload
      });

      return this._publisher.publish(ev).then(function () {
        return ev.toObject();
      });
    });
  }
}

export default Pipeline;
