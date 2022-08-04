export interface TypeDamageFactor {
    typeId: number;
    typeName: string;
    multiplier: number;
}


export interface TypeDamageFactorBuckets {
    [key: string]: TypeDamageFactor[];
}
