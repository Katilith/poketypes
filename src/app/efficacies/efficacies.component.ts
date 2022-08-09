import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AppService } from '../app.service';
import { PokemonType, PokemonTypeEfficacy } from '../../model/pokeapi';
import { typeColors as colors, typeContrastColors as contrasts } from '../../model/type-colors';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
    selector: 'poke-efficacies',
    templateUrl: './efficacies.component.html',
    styleUrls: [ './efficacies.component.scss' ]
})
export class EfficaciesComponent implements OnInit {

    readonly typeColors = colors;
    readonly typeContrastColors = contrasts;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    @ViewChild('searchField', { static: true })
    searchField: ElementRef<HTMLInputElement>;

    selections: [ string?, string? ] = [];
    inputValue: string = '';

    constructor(private changeDetector: ChangeDetectorRef,
                private appService: AppService) {
    }

    ngOnInit(): void {
        this.appService.loadTypeData().then(() => this.changeDetector.detectChanges());
        this.appService.loadTypeEfficacyData().then(() => this.changeDetector.detectChanges());
    }

    clearTypes(): void {
        this.selections = [];
        this.inputValue = '';
        this.searchField.nativeElement.value = '';
    }

    addType(event: MatChipInputEvent): void {
        const value = event.value;

        if ((value || '').trim() && this.selections.length < 2) {
            this.selections.push(value.trim().toLowerCase());
        }

        this.inputValue = '';
        this.searchField.nativeElement.value = '';
    }

    removeType(type: string) {
        const idx = this.selections.indexOf(type);
        if (idx !== -1) {
            this.selections.splice(idx, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (this.selections.length < 2) {
            this.selections.push(event.option.value.toLowerCase());
        }
        this.inputValue = '';
        this.searchField.nativeElement.value = '';
    }

    get selectableTypes(): string[] {
        return this.types.filter(
            type => type.id < 10000 && !this.selections.includes(type.name) &&
                (!this.inputValue || type.name.toLowerCase().includes(this.inputValue.trim().toLowerCase()))
        ).map(type => type.name);
    }

    get types(): PokemonType[] {
        return this.appService.types;
    }

    get typeEfficacies(): PokemonTypeEfficacy[] {
        return this.appService.typeEfficacies;
    }

    get loading(): boolean {
        return this.appService.loading;
    }

}
