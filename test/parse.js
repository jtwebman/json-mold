'use strict';

const parse = require('../index');

describe('parse', () => {
  it('parse simple json to tokens', () => {
    console.log(JSON.stringify(parse(JSON.stringify({
      "test": "123",
      "test2": true,
      "test3": false,
      "test4": null,
      "test5": 123,
      "test6": [
        "string",
        1234,
        null,
        true,
        false,
        {
          "ewfew":123,
          "bignumber": -11231232132312e+214,
          "bad chars": "💩💩💩💩"
        }
      ]
    }, null, 2)), null, 2));
  });
});
