import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';


@Component({
    selector: 'poke-loader',
    templateUrl: './loader.component.html',
    styleUrls: [ './loader.component.scss' ]
})
export class LoaderComponent {

    @Input()
    type: 'pokeball-large' | 'pokeball-small' | 'spinner' = 'spinner';

    @Input()
    color: ThemePalette = 'primary';

    @Input()
    size: number | string = 60;

    private _visible: boolean = false;

    private _fillSpace: boolean = false;

    @Input()
    set visible(visible: boolean | '') {
        this._visible = visible === '' || visible;
    }

    get visible(): boolean {
        return this._visible;
    }

    @Input()
    set fillSpace(fillSpace: boolean | '') {
        this._fillSpace = fillSpace === '' || fillSpace;
    }

    get fillSpace(): boolean {
        return this._fillSpace;
    }

}
