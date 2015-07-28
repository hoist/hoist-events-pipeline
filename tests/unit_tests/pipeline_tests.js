'use strict';

import Pipeline from '../../src/pipeline';
import {
  Publisher
}
from '@hoist/broker';
import Context from '@hoist/context';
import Sinon from 'sinon';
import {
  expect
}
from 'chai';
import {
  Event
}
from '@hoist/model';
/** @test {Pipeline} */
describe('Pipeline', () => {
  describe('Pipeline#raise', () => {
    let context;
    let pipeline;
    before(() => {
      Sinon.stub(Publisher.prototype, 'publish').returns(Promise.resolve(null));
      pipeline = new Pipeline();
      context = new Context({
        event: {
          correlationId: 'correlation-id'
        },
        bucket: {
          _id: 'bucket-id'
        },
        application: {
          _id: 'application-id'
        },
        environment: 'environment'
      });

    });
    describe('without context overrid', () => {
      let result;
      before(() => {
        return pipeline.raise(context, 'my-event', {
          payloadValue: true
        }).then((res) => {
          result = res;
        });
      });
      it('raises an event', () => {
        return expect(Publisher.prototype.publish).to.have.been.calledWith(Sinon.match.instanceOf(Event));
      });
      it('raises the same data as raised', () => {
        let raisedEvent = Publisher.prototype.publish.firstCall.args[0];
        return expect(raisedEvent.toObject()).to.eql(result);
      });
      it('sets applicationid on event', () => {
        return expect(result.applicationId).to.eql('application-id');
      });
      it('sets correlation id on event', () => {
        return expect(result.correlationId).to.eql('correlation-id');
      });
      it('sets the bucketid on event', () => {
        return expect(result.bucketId).to.eql('bucket-id');
      });
      it('sets the environment on event', () => {
        return expect(result.environment).to.eql('environment');
      });
      it('sets the payload on event', () => {
        return expect(result.payload.payloadValue).to.eql(true);
      });
      it('sets the event name on event', () => {
        return expect(result.eventName).to.eql('my-event');
      });
    });
    describe('without an existing event on context', () => {
      let result;
      let ev;
      before(() => {
        ev = context.event;
        delete context.event;
        return pipeline.raise(context, 'my-event', {
          payloadValue: true
        }).then((res) => {
          result = res;
        });
      });
      after(() => {
        context.event = ev;
      });
      it('generates a new correlationId', () => {
        return expect(result.correlationId).to.exist;
      });
    });
    describe('without an existing bucket on context', () => {
      let result;
      let bucket;
      before(() => {
        bucket = context.bucket;
        delete context.bucket;
        return pipeline.raise(context, 'my-event', {
          payloadValue: true
        }).then((res) => {
          result = res;
        });
      });
      after(() => {
        context.bucket = bucket;
      });
      it('sets no bucket id', () => {
        return expect(result.bucketId).to.not.exist;
      });
    });
    describe('overriding context with a bucket object', () => {
      let result;
      before(() => {
        return pipeline.raise(context, 'my-event', {
          payloadValue: true
        }, {
          bucket: {
            _id: "overridden-bucket-id"
          }
        }).then((res) => {
          result = res;
        });
      });
      it('sets bucket id', () => {
        return expect(result.bucketId).to.eql('overridden-bucket-id');
      });
    });
    describe('overriding context with a bucket id', () => {
      let result;
      before(() => {
        return pipeline.raise(context, 'my-event', {
          payloadValue: true
        }, {
          bucket: "overridden-bucket-id"
        }).then((res) => {
          result = res;
        });
      });
      it('sets bucket id', () => {
        return expect(result.bucketId).to.eql('overridden-bucket-id');
      });
    });
  });
});
