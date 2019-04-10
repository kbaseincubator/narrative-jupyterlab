import {
    VDomModel,
    VDomRenderer
} from '@jupyterlab/apputils';
import { IDisposable, DisposableDelegate } from '@phosphor/disposable';
import { CommandRegistry } from '@phosphor/commands';
import { Widget } from '@phosphor/widgets';
import { IIterator, ArrayIterator, ArrayExt } from '@phosphor/algorithm';
import * as React from 'react';

const APP_PANEL_CLASS = 'kb-appPanel';

export interface IAppPanel {
    add(options: IAppPanel.IItemOptions): IDisposable;
}

export namespace IAppPanel {
    export interface IOptions {
        cwd: string;
        commands: CommandRegistry;
        callback: (widget: Widget) => void;
    }
    export interface IItemOptions {
        command: string;
        category?: string;
        rank?: number;
        icon?: string;
    }
}

export class AppPanelModel extends VDomModel implements IAppPanel {
    private _items: IAppPanel.IItemOptions[] = [];

    add(options: IAppPanel.IItemOptions): IDisposable {
        let item = Private.createItem(options);

        this._items.push(item);
        this.stateChanged.emit(void 0);

        return new DisposableDelegate(() => {
            ArrayExt.removeFirstOf(this._items, item);
            this.stateChanged.emit(void 0);
        })
    }

    items(): IIterator<IAppPanel.IItemOptions> {
        return new ArrayIterator(this._items);
    }
}

export class AppPanel extends VDomRenderer<AppPanelModel> {
    private _commands: CommandRegistry;
    private _callback: (widget: Widget) => void;
    private _cwd = '';

    constructor(options: IAppPanel.IOptions) {
        super();
        this._cwd = options.cwd;
        this._callback = options.callback;
        this._commands = options.commands;
        this.addClass(APP_PANEL_CLASS);
    }

    get cwd(): string {
        return this._cwd;
    }
    set cwd(value: string) {
        this._cwd = value;
        this.update();
    }

    protected render(): React.ReactElement<any> {
        if (!this.model) {
            return null;
        }
        console.log(this._commands);
        console.log(this._callback);

        return (
            <div>I am a React element</div>
        );
    }
}

namespace Private {
    export function createItem(options: IAppPanel.IItemOptions): IAppPanel.IItemOptions {
        return {
            ...options,
            category: options.category || '',
            rank: options.rank !== undefined ? options.rank : Infinity
        }
    }
}
