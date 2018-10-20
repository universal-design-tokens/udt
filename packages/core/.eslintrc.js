module.exports = {
  extends: 'airbnb-base',
  'rules': {
    'no-underscore-dangle': 0,
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ]
  },

  overrides: [
    {
      files: [ '**/*.test.js'],
      env: {
        jest: true
      }
    }
  ]
};
