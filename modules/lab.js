const joi = require('joi');

class Checker {
  constructor(joi) {
    this._joi = joi;
    this._map = {
      'string': this._joi.string().required(),
      'number': this._joi.number().required(),
      'boolean': this._joi.boolean().required(),
      'string[]': this._joi.array().items(this._joi.string().required()).required(),
      'number[]': this._joi.array().items(this._joi.number().required()).required()
    }
    this.check = this.check.bind(this);
    this._buildSchema = this._buildSchema.bind(this);
  }

  check(data, schema, callback) {
    try {
      this._validate(data, this._buildSchema(schema));
      callback(data);
    } catch (e) {
      throw e;
    }
  }

  _buildSchema(schema) {
    this._checkSchemaDeclaration(schema);
    return this._joi.compile(
      Object.keys(schema).reduce((build, key) => {
        if (typeof schema[key] === 'string') build[key] = this._map[schema[key]];
        else build[key] = this._joi.object(
          Object.keys(schema[key]).reduce((sche, k) => {
            this._checkSchemaDeclaration(schema[key])
            sche[k] = this._map[schema[key][k]];
            return sche;
          }, {})
        );
        return build;
      }, {})
    );
  }

  _checkSchemaDeclaration(schema) {
    if (!Object.values(schema).every(key => {
      if (typeof key !== 'string') return true;
      return Object.keys(this._map).includes(key)
    })) {
      throw Error('Invalide schema declaration');
    }
    return true;
  }

  _validate(data, schema) {
    const result = this._joi.validate(data, schema);
    if (result.error) {
      const err = new Error(result.error.details[0].message);
      throw err;
    }
    return result.value;
  }
}

class Test extends Checker {
  constructor(joi) {
    super(joi);
    this.handler = this.handler.bind(this);
  }

  handler(data) {
    console.log(data)
  }
}

const test = new Test(joi);
try {
  const data = { log: 'test', bar: [2] };
  test.check(data, { log: 'string', bar: 'string[]'}, test.handler);
  //database op
} catch (e) {
  console.error(e);
}