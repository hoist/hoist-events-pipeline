'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _hoistBroker = require('@hoist/broker');

var _hoistLogger = require('@hoist/logger');

var _hoistLogger2 = _interopRequireDefault(_hoistLogger);

var _hoistModel = require('@hoist/model');

var _hoistContext = require('@hoist/context');

var _hoistContext2 = _interopRequireDefault(_hoistContext);

/**
* Hoist Pipeline class for raising events
*/

var Pipeline = (function () {
  function Pipeline() {
    _classCallCheck(this, Pipeline);

    this._publisher = new _hoistBroker.Publisher();
    this._logger = _hoistLogger2['default'].child({
      cls: this.constructor.name
    });
  }

  _createClass(Pipeline, [{
    key: 'raise',

    /**
    * raise an event with the given name and payload
    * @
    */
    value: function raise(eventName, payload, overrideContext) {
      return _hoistContext2['default'].get().bind(this).then(function (context) {
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
        var ev = new _hoistModel.Event({
          applicationId: context.application._id,
          eventName: eventName,
          environment: context.environment,
          bucketId: bucketId,
          correlationId: cid,
          payload: payload
        });

        return this.publisher.publish(ev).then(function () {
          return ev.toObject();
        });
      });
    }
  }]);

  return Pipeline;
})();

exports['default'] = Pipeline;
module.exports = exports['default'];
//# sourceMappingURL=pipeline.js.map