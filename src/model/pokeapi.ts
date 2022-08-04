export interface PokemonTypeEfficacy {
    id: number;
    damageFactor: number;
    damageTypeId: number;
    targetTypeId: number;
}

export interface PokemonType {
    id: number;
    name: string;
    generationId: number;
    moveDamageClassId: number;
    efficacies: PokemonTypeEfficacy[];
}

export interface PokemonTypesResponse {
    types: PokemonType[];
}

export interface PokemonTypeEfficaciesResponse {
    efficacies: PokemonTypeEfficacy[];
}
