import { parse } from "@babel/parser";
import { assertJSXText } from "@babel/types";
import { findNode } from "./ast";

test("findNode", () => {
    const code = `const hello = (<div >world</ div>)`;
    const ast = parse(code, {
        plugins: ["jsx", "typescript"],
        errorRecovery: true,
    });

    const node = findNode(ast, 1, 22);
    assertJSXText(node);
});

test("findNode multiple lines", () => {
    const code = `import { FC } from "React";
  const example = () => {
    return (
      <section>
        <h1>
          Example Title!
        </h1>
        Hello World!
      </section>
    )
  }`;
    const ast = parse(code, {
        plugins: ["jsx", "typescript"],
        errorRecovery: true,
    });

    const node = findNode(ast, 6, 12);
    assertJSXText(node);
});
