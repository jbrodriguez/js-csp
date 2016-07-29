"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var csp = require("./csp");
var chan = csp.chan;
var go = csp.go;
var put = csp.put;
var take = csp.take;

var mocha = require("mocha");
var it = mocha.it;

function identity_chan(x) {
  var ch = chan(1);
  go(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return put(ch, x);

          case 2:
            ch.close();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return ch;
}

function check(f, done) {
  return function () {
    try {
      f();
      done();
    } catch (e) {
      done(e);
    }
  }();
}

// it("", g(function*() {
// }));
function g(f) {
  return function (done) {
    go(f, [done]);
  };
};

function gg(f) {
  return g(_regenerator2.default.mark(function _callee2(done) {
    var ch;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            ch = go(f, []);
            _context2.next = 4;
            return take(ch);

          case 4:
            done();
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);

            done(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));
}

module.exports = {
  identity_chan: identity_chan,
  check: check,
  goAsync: g,
  go: gg,

  // f must be a generator function. For now assertions should be inside f's
  // top-level, not functions f may call (that works but a failing test
  // may break following tests).
  it: function it(desc, f) {
    return mocha.it(desc, gg(f));
  },

  beforeEach: function beforeEach(f) {
    return mocha.beforeEach(gg(f));
  },

  afterEach: function afterEach(f) {
    return mocha.afterEach(gg(f));
  },

  before: function before(f) {
    return mocha.before(gg(f));
  },

  after: function after(f) {
    return mocha.after(gg(f));
  }
};