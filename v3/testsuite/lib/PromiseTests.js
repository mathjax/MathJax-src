function PromiseTests(t,data,cleanup) {
  if (data.length) {
    let [test, ok, fail] = data.shift();
    test().then(ok).catch((err) => fail(err))
      .then(() => PromiseTests(t,data))
      .catch((err) => {
        t.fail('Error in promise: '+err.message);
        PromiseTests(t,data);
      });
  } else {
    t.end();
    if (cleanup) cleanup();
  }
}

exports.PromiseTests = PromiseTests;
