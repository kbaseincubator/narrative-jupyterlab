import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  IEditorServices
} from '@jupyterlab/codeeditor';

import {
  StaticNotebook, NotebookPanel
} from '@jupyterlab/notebook';

import {
  CodeCell, Cell
} from '@jupyterlab/cells';

import '../style/index.css';
import { IObservableMap } from '@jupyterlab/observables';
import { JSONValue } from '@phosphor/coreutils';
import { Widget, PanelLayout } from '@phosphor/widgets';


export class KBaseWidget extends Widget {
  readonly metadata: IObservableMap<JSONValue>;

  constructor(metadata: IObservableMap<JSONValue>) {
    super();
    this.metadata = metadata;
    this.addClass('kb-cell');
    let str = 'I am a KBase cell. BEHOLD MY GLORY!';
    let div = document.createElement('div');
    div.innerText = str;
    this.node.appendChild(div);
  }
}

function updateForKBase(cell: Cell): void {
  console.log('new KBase cell!');
  console.log(cell);
  let kbWidget = new KBaseWidget(cell.model.metadata);
  const layout = cell.layout as PanelLayout;
  layout.insertWidget(2, kbWidget);
  // (cell.inputArea.layout as BoxLayout).addWidget(kbWidget);
  cell.update();
}


const factory: JupyterLabPlugin<NotebookPanel.IContentFactory> = {
  id: '@kbase/narrative-extension:factory',
  provides: NotebookPanel.IContentFactory,
  requires: [IEditorServices],
  autoStart: true,
  activate: (app: JupyterLab, editorServices: IEditorServices) => {
    let editorFactory = editorServices.factoryService.newInlineEditor;
    return new KBaseContentFactory({ editorFactory });
  }
};

export class KBaseContentFactory extends NotebookPanel.ContentFactory {
  constructor(options?: Cell.ContentFactory.IOptions) {
    super(options);
  }

  createCodeCell(options: CodeCell.IOptions, parent: StaticNotebook): CodeCell {
    if (!options.contentFactory) {
      options.contentFactory = this;
    }
    // can respond to metadata here.

    // try this flow.
    // 1. createCodeCell should inject a Kbase DOM node in all cells.
    // 2. adding metadata and triggering a re-render should be captured here
    // or some other function should be triggerable to re-render
    // 3. Re-rendering a cell should look at metadata and do stuff with the KBase DOM node.
    // -- make it KBase-ified. Maybe also look at how ipywidgets works?


    // make a new content factory for App Cells?
    // use it here for the Code Cell.
    let cell = new CodeCell(options);
    cell.model.metadata.changed.connect(
      this._metadataChangedHandler,
      cell
    )
    if (cell.model.metadata.keys().indexOf('kbase') != -1) {
      updateForKBase(cell);
    }
    return cell;
  }

  _metadataChangedHandler(
    model: IObservableMap<JSONValue>,
    args: IObservableMap.IChangedArgs<JSONValue>
  ): void {
    switch (args.key) {
      case 'kbase':
        const cell = this as unknown as Cell;
        updateForKBase(cell);
        break;
      default:
        break;
    }
  }

};

export default factory;
