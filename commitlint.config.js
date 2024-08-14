module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'refactor', 'fix', 'chore']],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
