module.exports = {
  extends: ['@react-native-community'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/require-default-props': [0, { ignoreFunctionalComponents: true }],
  },
};
