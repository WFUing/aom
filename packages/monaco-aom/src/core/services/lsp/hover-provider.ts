import { AstNode, AstNodeHoverProvider } from "langium";
import { Hover } from "vscode-languageserver-types";

export class AomHoverProvider extends AstNodeHoverProvider {
  protected getAstNodeHoverContent(node: AstNode): Hover | undefined {

    return undefined;
  }
}
