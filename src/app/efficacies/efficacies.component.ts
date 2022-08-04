import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    }

    addType(event: MatChipInputEvent): void {
        const value = event.value;

        if ((value || '').trim() && this.selections.length < 2) {
            this.selections.push(value.trim().toLowerCase());
        }

        this.inputValue = '';
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
    }

    get selectableTypes(): string[] {
        return this.types.filter(
            type => type.moveDamageClassId !== null && !this.selections.includes(type.name)
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
