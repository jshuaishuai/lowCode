module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        indent: ['error', 4, { SwitchCase: 1 }], // SwitchCase冲突 闪烁问题
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-console': 'warn',
        'no-return-assign': 'off',
        'no-param-reassign': 'off',
    },
};
