import { buildWorkerDefinition } from "monaco-editor-workers";
import { MonacoEditorLanguageClientWrapper, UserConfig } from "monaco-editor-wrapper/bundle";
import { addMonacoStyles } from 'monaco-editor-wrapper/styles';

export type WorkerUrl = string;

/**
 * Generalized configuration used with 'getMonacoEditorReactConfig' to generate a working configuration for monaco-editor-react
 */
export interface ClassicConfig {
    code: string,
    languageId: string,
    worker: WorkerUrl | Worker,
    monarchGrammar: any;
}

/**
 * Generates a UserConfig for a given Langium example, which is then passed to the monaco-editor-react component
 * 
 * @param config A VSCode API or classic editor config to generate a UserConfig from
 * @returns A completed UserConfig
 */
export function createUserConfig(config: ClassicConfig): UserConfig {
    // setup urls for config & grammar
    const id = config.languageId;

    // generate langium config
    return {
        id: id,
        wrapperConfig: {
            editorAppConfig: {
                $type: 'classic',
                languageId: id,
                useDiffEditor: false,
                overrideAutomaticLayout: true,
                code: config.code,
                theme: 'vs-dark',
                languageDef: config.monarchGrammar
            },
            serviceConfig: {
                userServices: {
                    enableModelService: true,
                    configureConfigurationService: {
                        defaultWorkspaceUri: '/tmp/'
                    },
                    enableLanguagesService: true
                },
                debugLogging: false
            }
        },
        languageClientConfig: {
            options: {
                $type: 'WorkerDirect',
                worker: config.worker as Worker,
                name: `${id}-server-worker`
            }
        }
    };
}

/**
 * Prepare to setup the wrapper, building the worker def & setting up styles
 */
function setup() {
    buildWorkerDefinition(
        './monaco-editor-workers/workers',
        new URL('', window.location.href).href,
        false
    );
    addMonacoStyles('monaco-editor-styles');
}

/**
 * Returns a Monarch grammar definition for MiniLogo
 */
function getMonarchGrammar() {
    return {
        keywords: [
            'AppDef', 'CompDef', 'Component', 'Policy', 'SecretDef', 'Workflow'
        ],
        operators: [
            ',', '.', '='
        ],
        symbols: /,|\.|=|\[|\]|\{|\}/,

        tokenizer: {
            initial: [
                { regex: /-?[0-9]+\.[0-9]*/, action: { "token": "number" } },
                { regex: /-?[0-9]+/, action: { "token": "number" } },
                { regex: /(true|false)/, action: { "token": "boolean" } },
                { regex: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/, action: { "token": "string" } },
                { regex: /[_a-zA-Z][\w-_]*/, action: { cases: { '@keywords': { "token": "keyword" }, '@default': { "token": "ID" } } } },
                { include: '@whitespace' },
                { regex: /@symbols/, action: { cases: { '@operators': { "token": "operator" }, '@default': { "token": "" } } } },
            ],
            whitespace: [
                { regex: /\s+/, action: { "token": "white" } },
                { regex: /\/\*/, action: { "token": "comment", "next": "@comment" } },
                { regex: /\/\/[^\n\r]*/, action: { "token": "comment" } },
            ],
            comment: [
                { regex: /[^/\*]+/, action: { "token": "comment" } },
                { regex: /\*\//, action: { "token": "comment", "next": "@pop" } },
                { regex: /[/\*]/, action: { "token": "comment" } },
            ],
        }
    };
}

/**
 * Retrieves the program code to display, either a default or from local storage
 */
function getMainCode() {
    let mainCode = `
AppDef first-vela-app {

    apiVersion = "core.oam.dev/v1beta1"

    Component express-server {
        type = "webservice"
        properties = {
            image = "oamdev/hello-world"
            ports = [
                {
                    port = 8000
                    expose = true
                }
            ]
        }
        traits = [
            {
                type = "scaler"
                properties = {
                    replicas = 1
                }
            }
        ]
    }
}
    `;

    // seek to restore any previous code from our last session
    if (window.localStorage) {
        const storedCode = window.localStorage.getItem('mainCode');
        if (storedCode !== null) {
            mainCode = storedCode;
        }
    }

    return mainCode;
}

/**
 * Creates & returns a fresh worker using the AOM language server
 */
function getWorker() {
    const workerURL = new URL('aom-server-worker.js', window.location.href);
    return new Worker(workerURL.href, {
        type: 'module',
        name: 'AOMLS'
    });
}

/**
 * Set a status message to display below the update button
 * @param msg Status message to display
 */
function setStatus(msg: string) {
    const elm = document?.getElementById('status-msg');
    if (elm) {
        elm.innerHTML = msg;
    }
}

async function main() {
    // setup worker def & styles
    setup();

    // setup a new wrapper
    // keep a reference to a promise for when the editor is finished starting, we'll use this to setup the canvas on load
    const wrapper = new MonacoEditorLanguageClientWrapper();
    await wrapper.initAndStart(createUserConfig({
        languageId: 'aom',
        code: getMainCode(),
        worker: getWorker(),
        monarchGrammar: getMonarchGrammar()
    }), document.getElementById("monaco-editor-root")!);

    const client = wrapper.getLanguageClient();
    if (!client) {
        throw new Error('Unable to obtain language client for the Minilogo!');
    }

    let running = false;
    let timeout: NodeJS.Timeout | null = null;
    client.onNotification('browser/DocumentChange', (resp) => {

        // always store this new program in local storage
        const value = wrapper.getModel()?.getValue();
        if (window.localStorage && value) {
            window.localStorage.setItem('mainCode', value);
        }

        // block until we're finished with a given run
        if (running) {
            return;
        }

        // clear previous timeouts
        if (timeout) {
            clearTimeout(timeout);
        }

        // set a timeout to run the current code
        timeout = setTimeout(async () => {
            running = true;
            setStatus('');
            console.info('generating & running current code...');
            window.localStorage.getItem('mainCode')
        }, 200);
    });
}

main();
