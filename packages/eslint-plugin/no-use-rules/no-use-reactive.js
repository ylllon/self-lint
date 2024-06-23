
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "禁止变量名、常量名、函数名、class名为 reactive、Reactive",
    },
    schema: [], // 没有提供选项
  },
  create(context) {
    const reportMsg = (node) => {
      context.report({
        node,
        message: "禁止变量名、常量名、函数名、class名为 reactive、Reactive",
      });
    };

    return {
      Identifier: (node) => {
        let isDanger = false;

        if (node.parent.type !== "MemberExpression") {
          if (node.name === "reactive" || node.name === "Reactive") {
            isDanger = true;
          }
        }

        if (isDanger === true) {
          reportMsg(node);
        }
      },

    };

  },

};
