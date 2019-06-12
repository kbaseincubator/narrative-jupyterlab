import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IEditorServices
} from '@jupyterlab/codeeditor';

import {
  StaticNotebook, NotebookPanel
} from '@jupyterlab/notebook';

import {
  CodeCell
} from '@jupyterlab/cells';

import '../style/index.css';
import { IObservableMap } from '@jupyterlab/observables';
import { JSONValue } from '@phosphor/coreutils';
import { Widget, PanelLayout } from '@phosphor/widgets';


export class KBaseCodeCell extends CodeCell {
  kbaseWidget: KBaseWidget;

  constructor(options: CodeCell.IOptions) {
    super(options);
    this.model.metadata.changed.connect(
      this._metadataChanged,
      this
    );
    if (this.model.metadata.keys().indexOf('kbase') != -1 && !this.kbaseWidget) {
      this.setupKBaseWidget();
    }
  }

  _metadataChanged(model: IObservableMap<JSONValue>,
    args: IObservableMap.IChangedArgs<JSONValue>): void {
      if (args.key === 'kbase' && !this.kbaseWidget) {
        this.setupKBaseWidget();
      }
  }

  setupKBaseWidget(): void {
    this.kbaseWidget = new KBaseWidget(this.model.metadata);
    const layout = this.layout as PanelLayout;
    layout.insertWidget(2, this.kbaseWidget);
  }
}

export class KBaseWidget extends Widget {
  metadata: IObservableMap<JSONValue>;
  readonly mainDiv: HTMLDivElement;

  constructor(metadata: IObservableMap<JSONValue>) {
    super();
    this.metadata = metadata;
    this.addClass('kb-cell');
    this.mainDiv = document.createElement('div');
    this.node.appendChild(this.mainDiv);

    this.metadata.changed.connect(
      this.updateKBaseModel,
      this
    );
    this.renderKBaseModel();
  }

  renderKBaseModel(): void {
    const kbMeta = this.metadata.get('kbase') as JSONValue;
    const str = 'I am a KBase cell. My metadata is: ' + JSON.stringify(kbMeta);
    this.mainDiv.innerText = str;
  }

  updateKBaseModel(model: IObservableMap<JSONValue>,
    args: IObservableMap.IChangedArgs<JSONValue>): void {
      this.metadata = model;
      this.renderKBaseModel();
    }
}

const factory: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
  id: '@kbase/narrative-extension:factory',
  provides: NotebookPanel.IContentFactory,
  requires: [IEditorServices],
  autoStart: true,
  activate: (app: JupyterFrontEnd, editorServices: IEditorServices) => {
    let editorFactory = editorServices.factoryService.newInlineEditor;
    return new KBaseContentFactory({ editorFactory });
  }
};

export class KBaseContentFactory extends NotebookPanel.ContentFactory {
  createCodeCell(options: CodeCell.IOptions, parent: StaticNotebook): CodeCell {
    if (!options.contentFactory) {
      options.contentFactory = this;
    }
    return new KBaseCodeCell(options);
  }
};

export default factory;
