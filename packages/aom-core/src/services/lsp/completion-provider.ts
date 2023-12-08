import { CompletionAcceptor, CompletionContext, CompletionProviderOptions, DefaultCompletionProvider, MaybePromise, NextFeature } from "langium";

export class AOMCompletionProvider extends DefaultCompletionProvider {
  readonly completionOptions: CompletionProviderOptions = {
    triggerCharacters: ['"', '.', '@']
  }

  protected completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): MaybePromise<void> {
    return super.completionFor(context, next, acceptor)
  }
}