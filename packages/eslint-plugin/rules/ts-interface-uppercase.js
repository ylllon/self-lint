/*
 * @Descripttion: interface名称需要大写字母开头
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    name: 'ts-interface-uppercase',
    meta: {
        type: 'problem',
        docs: {
            description: 'interface 标题大写字母开头',
            category: 'Fill me in',
            recommended: false
        },
        fixable: null, // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create(context) {
        return {
            TSInterfaceDeclaration(node) {
                console.log('node:',node)
                if (node.id.type !== 'Identifier') {
                    return;
                }
                let interfaceName = node.id.name;
                // interface 名称没有值 则不处理
                if (typeof interfaceName !== 'string') {
                    return;
                }
                if (interfaceName[0].toUpperCase() !== interfaceName[0]) {
                    context.report({
                        node,
                        message: 'interface名称需要大写字母开头'
                    });
                }
            }
        };
    }
};