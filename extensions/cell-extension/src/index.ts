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
import { JSONValue, JSONObject } from '@phosphor/coreutils';
import { PanelLayout } from '@phosphor/widgets';
import { KBaseAppCellWidget } from './kbaseAppCellWidget';
import { Signal, ISignal } from '@phosphor/signaling';


export class KBaseCodeCell extends CodeCell {
  kbaseWidget: KBaseAppCellWidget;
  private _updateSignal = new Signal<this, boolean>(this);

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

  get updateSignal(): ISignal<this, boolean> {
    return this._updateSignal;
  }

  _metadataChanged(model: IObservableMap<JSONValue>,
    args: IObservableMap.IChangedArgs<JSONValue>): void {
      if (args.key === 'kbase' && !this.kbaseWidget) {
        this.setupKBaseWidget();
      }
      this._updateSignal.emit(true);
  }

  setupKBaseWidget(): void {
    this.inputArea.hide();
    const kbaseMetadata = this.model.metadata.get('kbase') as JSONObject;
    const type = kbaseMetadata.type;
    switch (type) {
      case 'app':
      default:
        this.kbaseWidget = new KBaseAppCellWidget({
          updateSignal: this._updateSignal,
          kbaseMetadata: this.model.metadata
        });
    }
    const layout = this.layout as PanelLayout;
    layout.insertWidget(2, this.kbaseWidget);
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
