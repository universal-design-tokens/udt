module.exports = {
  extends: 'airbnb-base',
  'rules': {
    'no-underscore-dangle': 0
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
