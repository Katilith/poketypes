import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {
    PokemonType,
    PokemonTypeEfficaciesResponse,
    PokemonTypeEfficacy,
    PokemonTypesResponse
} from '../model/pokeapi';
import localforage from 'localforage';


const TYPE_DATA_STORAGE_KEY = 'poke_types';
const TYPE_EFFICACIES_DATA_STORAGE_KEY = 'poke_type_efficacies';


const TYPE_DATA_QUERY = gql`
query PokeAPITypeDataQuery {
  types: pokemon_v2_type(order_by: {id: asc}) {
    id
    name
    generationId: generation_id
    moveDamageClassId: move_damage_class_id
    efficacies: pokemon_v2_typeefficacies {
      id
      damageFactor: damage_factor
      damageTypeId: damage_type_id
      targetTypeId: target_type_id
    }
  }
}
`;


const TYPE_EFFICACY_DATA_QUERY = gql`
query PokeAPITypeEfficacyDataQuery {
  efficacies: pokemon_v2_typeefficacy {
    id
    damageFactor: damage_factor
    damageTypeId: damage_type_id
    targetTypeId: target_type_id
  }
}
`;


@Injectable({
    providedIn: 'root'
})
export class AppService {

    private _loading: boolean = true;
    private _types: PokemonType[] = [];
    private _typeEfficacies: PokemonTypeEfficacy[] = [];

    constructor(private apollo: Apollo) {
    }

    async loadTypeEfficacyData(): Promise<void> {
        this._loading = true;

        const storedData = await localforage.getItem<PokemonTypeEfficacy[]>(TYPE_EFFICACIES_DATA_STORAGE_KEY);

        if (storedData?.length) {
            this._typeEfficacies = storedData;
            this._loading = false;
        } else {
            this.apollo.watchQuery<PokemonTypeEfficaciesResponse>({
                query: TYPE_EFFICACY_DATA_QUERY,
            }).valueChanges.subscribe(result => {
                if (!result.loading) {
                    this._typeEfficacies = result.data.efficacies;
                    localforage.setItem<PokemonTypeEfficacy[]>(TYPE_EFFICACIES_DATA_STORAGE_KEY, this._typeEfficacies);
                    this._loading = false;
                }
            });
        }
    }

    async loadTypeData(): Promise<void> {
        this._loading = true;

        const storedData = await localforage.getItem<PokemonType[]>(TYPE_DATA_STORAGE_KEY);

        if (storedData?.length) {
            this._types = storedData;
            this._loading = false;
        } else {
            this.apollo.watchQuery<PokemonTypesResponse>({
                query: TYPE_DATA_QUERY,
            }).valueChanges.subscribe(result => {
                if (!result.loading) {
                    this._types = result.data.types;
                    localforage.setItem<PokemonType[]>(TYPE_DATA_STORAGE_KEY, this._types);
                    this._loading = false;
                }
            });
        }
    }

    get loading(): boolean {
        return this._loading;
    }

    get types(): PokemonType[] {
        return this._types;
    }

    get typeEfficacies(): PokemonTypeEfficacy[] {
        return this._typeEfficacies;
    }

}
