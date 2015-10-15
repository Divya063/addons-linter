import * as messages from 'messages';
import { VALIDATION_ERROR } from 'const';
import CSSScanner from 'validators/css';


describe('CSSScanner', () => {

  it('should add CSS_SYNTAX_ERROR with invalid css', () => {
    var code = '#something {';
    var cssScanner = new CSSScanner(code, 'fakeFile.css');

    return cssScanner.scan()
      .then((validationMessages) => {
        assert.equal(validationMessages.length, 1);
        assert.equal(validationMessages[0].code,
                     messages.CSS_SYNTAX_ERROR.code);
        assert.equal(validationMessages[0].type, VALIDATION_ERROR);
        assert.include(validationMessages[0].message, 'missing');
        assert.equal(validationMessages[0].line, 1);
        assert.equal(validationMessages[0].column, 13);
        assert.equal(validationMessages[0].file, 'fakeFile.css');
      });

  });

  it('should reject if parser throws non-error', () => {
    var code = '/* whatever code */';
    var cssScanner = new CSSScanner(code, 'fakeFile.css');

    var fakeCSSParser = {
      parse: () => {
        throw new TypeError('Awooga');
      },
    };

    return cssScanner.scan(fakeCSSParser)
      .then(() => {
        assert.fail(null, null, 'unexpected success');
      })
      .catch((err) => {
        assert.instanceOf(err, TypeError);
        assert.equal(err.message, 'Awooga');
      });

  });

});