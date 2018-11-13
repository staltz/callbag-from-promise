const test = require('tape');
const fromPromise = require('.');

test('it converts a resolved promise and observes it', t => {
  t.plan(8);
  const source = fromPromise(Promise.resolve(42));

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [2, 'undefined'],
  ];
  const downwardsExpected = [42];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 400);
});

test('it can be aborted (ignored) it after start', t => {
  t.plan(3);
  const source = fromPromise(Promise.resolve(42));

  const downwardsExpectedTypes = [[0, 'function']];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      talkback(2);
      return;
    }
    if (type === 1) {
      t.fail('should not get data');
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 400);
});

test('it converts a resolved promise and iterates it', t => {
  t.plan(8);
  const source = fromPromise(Promise.resolve(42));

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
    [2, 'undefined'],
  ];
  const downwardsExpected = [42];

  let talkback;
  source(0, function iterate(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      const e = downwardsExpected.shift();
      t.deepEquals(data, e, 'downwards data is expected: ' + e);
      talkback(1);
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 400);
});

test('it converts a rejected promise and observes it', t => {
  t.plan(6);
  const source = fromPromise(Promise.reject(new Error('sad')));

  const downwardsExpectedTypes = [[0, 'function'], [2, 'object']];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 2) {
      t.equals(data.message, 'sad', 'downwards data is expected: sad error');
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 400);
});

test('it doesn\'t emit completion after being unsubscribed in response to resolved value', t => {
  t.plan(5);
  const source = fromPromise(Promise.resolve(42));

  const downwardsExpectedTypes = [
    [0, 'function'],
    [1, 'number'],
  ];

  let talkback;
  source(0, function observe(type, data) {
    const et = downwardsExpectedTypes.shift();
    if (!et) {
      t.fail('should not get anything after sink unsubscribes');
    }
    t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
    t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);

    if (type === 0) {
      talkback = data;
      return;
    }
    if (type === 1) {
      talkback(2);
    }
  });

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 400);
});
