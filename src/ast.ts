import { Node, SourceLocation } from "@babel/types";

export function findNode(parsedAST: Node, line: number, column: number): Node {
    for (const key in parsedAST) {
        if (parsedAST.hasOwnProperty(key) && key !== "errors") {
            const value: unknown = (parsedAST as any)[key];
            if (typeof value === "object" && value && "loc" in value) {
                const { loc } = value as Node;
                if (loc && isInside(line, column, loc)) {
                    return findNode(value as Node, line, column);
                }
            }
            if (Array.isArray(value)) {
                for (const element of value as unknown[]) {
                    if (
                        typeof element === "object" &&
                        element &&
                        "loc" in element
                    ) {
                        const { loc } = element as Node;
                        if (loc && isInside(line, column, loc)) {
                            return findNode(element as Node, line, column);
                        }
                    }
                }
            }
        }
    }
    return parsedAST;
}

function isInside(
    line: number,
    column: number,
    source: SourceLocation
): boolean {
    if (line < source.start.line || source.end.line < line) {
        return false;
    }
    if (line === source.start.line && column < source.start.column) {
        return false;
    }
    if (line === source.end.line && source.end.column < column) {
        return false;
    }
    return true;
}
