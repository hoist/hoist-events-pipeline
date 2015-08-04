'use strict';

import {
  Publisher
}
from '@hoist/broker';
import logger from '@hoist/logger';
import uuid from 'uuid';
import {
  Event
}
from '@hoist/model';

/**
 * Hoist Pipeline class for raising events
 */
class EventsPipeline {
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
   * @param {Context} context - the current context
   * @param {String} eventName - the name of the event to raise
   * @param {Object} payload - any mata data to save
   * @returns {Promise<Object>} - the Bucket in object form
   */
  raise(context, eventName, payload, overrideContext) {
    return Promise.resolve().then(() => {
      var cid;
      if (context.event) {
        cid = context.event.correlationId;
      }
      cid = cid || uuid.v4();
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
        eventId: uuid.v4(),
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

export default EventsPipeline;

/**
 * @external {Context} https://github.com/hoist/hoist-context/blob/feature/remove_cls/src/index.js
 */
