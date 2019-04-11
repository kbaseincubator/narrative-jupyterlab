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

    // make a new content factory for App Cells?
    // use it here for the Code Cell.
    let cell = new CodeCell(options);
    console.log('LET THERE BE A CODE CELL!');

    return cell;
  }

  createAppCell(options: CodeCell.IOptions, parent: StaticNotebook): CodeCell {
    if (!options.contentFactory) {
      options.contentFactory = this;
    }

    let cell = new CodeCell(options);
    alert('LET THERE BE AN APP CELL!');
    return cell;
  }
};

export default factory;
