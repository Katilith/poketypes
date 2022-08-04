import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { PokemonType, PokemonTypeEfficacy } from '../../../model/pokeapi';
import { TitleCasePipe } from '@angular/common';
import { TypeDamageFactor, TypeDamageFactorBuckets } from '../../../model/type-damage-factor';
import { typeColors as colors, typeContrastColors as contrasts } from '../../../model/type-colors';


@Component({
    selector: 'poke-weaknesses',
    templateUrl: './weaknesses.component.html',
    styleUrls: [ './weaknesses.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeaknessesComponent implements OnInit, OnChanges {

    readonly typeColors = colors;
    readonly typeContrastColors = contrasts;

    @Input()
    types: PokemonType[] = [];

    @Input()
    efficacies: PokemonTypeEfficacy[] = [];

    @Input()
    type1: string | undefined;

    @Input()
    type2: string | undefined;

    damageMultipliers: string[] = [];
    damageFactors: TypeDamageFactorBuckets = {};

    constructor(private changeDetector: ChangeDetectorRef,
                private titlecasePipe: TitleCasePipe) {
    }

    ngOnInit(): void {
        this.calculateWeaknesses(this.types, this.type1, this.type2);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes?.['type1'] && !changes['type1'].firstChange) || (changes?.['type2'] && !changes['type2'].firstChange)) {
            this.calculateWeaknesses(
                this.types,
                changes?.['type1']?.currentValue || this.type1,
                changes?.['type2']?.currentValue || this.type2
            );
        }
    }

    calculateWeaknesses(types: PokemonType[], type1: string, type2?: string | undefined): void {
        if (!type1) {
            return;
        }

        const selectedTypes = types.filter(t => t.name === type1 || t.name === type2);

        const selection1Multipliers: TypeDamageFactor[] = this.efficacies.filter(e => e.targetTypeId === selectedTypes[0].id).map(e => ({
            typeId: e.damageTypeId,
            typeName: this.types.find(t => t.id === e.damageTypeId).name,
            multiplier: e.damageFactor / 100,
        }));

        const selection2Multipliers: TypeDamageFactor[] = (selectedTypes.length === 2 ? this.efficacies.filter(e => e.targetTypeId === selectedTypes[1].id) : []).map(e => ({
            typeId: e.damageTypeId,
            typeName: this.types.find(t => t.id === e.damageTypeId).name,
            multiplier: e.damageFactor / 100,
        }));

        const damageFactors = types.filter(type => !!type.moveDamageClassId)
            .map(type => ({
                typeId: type.id,
                typeName: type.name,
                multiplier: selection1Multipliers.find(e => e.typeId === type.id).multiplier *
                    (selection2Multipliers?.find(e => e.typeId === type.id)?.multiplier || 1)
            }))
            .filter(type => type.multiplier !== 1)
            .sort((a, b) => a.multiplier > b.multiplier ? -1 : 1);

        this.damageMultipliers = [];
        this.damageFactors = {};

        damageFactors.forEach(factor => {
            const multiplierString = String(factor.multiplier);

            if (!this.damageFactors[multiplierString]) {
                this.damageMultipliers.push(multiplierString);
                this.damageFactors[multiplierString] = [];
            }

            this.damageFactors[multiplierString].push(factor);
        });
    }

    get combinedTypeName(): string {
        if (!this.type1) {
            return '';
        }

        return this.titlecasePipe.transform(this.type1) +
            (this.type2 ? `/${this.titlecasePipe.transform(this.type2)}` : '');
    }

}
