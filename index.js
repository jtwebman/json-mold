'use strict';

function parse(json) {
  console.log(`parsing json: ${json}`);
  const tokens = [];
  const charArr = Array.from(json);
  console.log(`charArr: ${JSON.stringify(charArr)}`);
  const length = charArr.length;
  let line = 1;
  let position = 0;
  let depth = 0;
  let values = [];
  for (let i = 0; i < length; i++) {
    position++;
    switch (charArr[i]) {
      case '{':
        tokens.push({
          token: 'start-object',
          at: i,
          line,
          position,
          depth
        });
        depth++;
        break;
      case '}':
        depth--;
        const currentObjectTokens = [];
        let currentObjectToken = tokens.pop();
        while (currentObjectToken.token !== 'start-object') {
          currentObjectTokens.unshift(currentObjectToken);
          currentObjectToken = tokens.pop();
        }
        const newObject = {};
        for (let j = 1; j < currentObjectTokens.length; j = j + 2) {
          newObject[currentObjectTokens[j - 1].value] = currentObjectTokens[j].value
        }
        tokens.push({
          token: 'object',
          value: newObject
        });
        break;
      case '[':
        tokens.push({
          token: 'start-array',
          at: i,
          line,
          position,
          depth
        });
        depth++;
        break;
      case ']':
        depth--;
        const currentArray = [];
        let currentArrayToken = tokens.pop();
        while (currentArrayToken.token !== 'start-array') {
          currentArray.unshift(currentArrayToken.value);
          currentArrayToken = tokens.pop();
        }
        tokens.push({
          token: 'array',
          value: currentArray
        });
        break;
      case '\r':
      case '\n':
        line++;
        position = 0;
        if (charArr[i + 1] === '\n' || charArr[i + 1] === '\r') {
          i++;
        }
        break;
      /*case ':':
        tokens.push({
          token: 'property',
          at: i,
          line,
          position,
          depth
        });
        break;*/
      /*case ',':
        tokens.push({
          token: 'comma',
          at: i,
          line,
          position,
          depth
        });
        break;*/
      case 'n':
        if (charArr.slice(i, i + 4).join('') === 'null') {
          tokens.push({
            token: 'null',
            value: null,
            length: 4,
            at: i,
            line,
            position,
            depth
          });
          i = i + 3;
          position = position + 3;
        }
        break;
      case 't':
        if (charArr.slice(i, i + 4).join('') === 'true') {
          tokens.push({
            token: 'true',
            value: true,
            length: 4,
            at: i,
            line,
            position,
            depth
          });
          i = i + 3;
          position = position + 3;
        }
        break;
      case 'f':
        if (charArr.slice(i, i + 5).join('') === 'false') {
          tokens.push({
            token: 'false',
            value: false,
            length: 5,
            at: i,
            line,
            position,
            depth
          });
          i = i + 4;
          position = position + 4;
        }
        break;
      case '-':
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const startAt = i;
        const startPosition = position;
        let length = 0;
        while (isNumberChar(charArr[i])) {
          i++;
          position++;
          length++;
        }
        tokens.push({
          token: 'number',
          value: +charArr.slice(startAt, startAt + length).join(''),
          length,
          at: startAt,
          line,
          position: startPosition,
          depth
        });
        i--;
        position--;
        break;
      case '"':
        const stringStartAt = i;
        const stringStartPosition = position;
        let stringLength = 0;
        i++;
        position++;
        while (charArr[i] !== '"' || charArr[i - 1] === '\\') {
          i++;
          position++;
          stringLength++;
        }
        tokens.push({
          token: 'string',
          value: charArr.slice(stringStartAt + 1, stringStartAt + 1 + stringLength).join(''),
          length: stringLength,
          at: stringStartAt,
          line,
          position: stringStartPosition,
          depth
        });
        break;
      default:
        break;
    }
  }

  return tokens.length >= 1 ? tokens[0].value : undefined;
}

function isNumberChar(char) {
  switch (char) {
    case '-':
    case '+':
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case 'e':
    case 'E':
    case '.':
      return true;
    default:
      return false;
  }
}

module.exports = parse;
