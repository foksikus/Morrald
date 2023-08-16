export interface Store {
    name:string;
    position:number[];
    items:Item[];
}

export interface Item {
    id:number;
    name:string;
    count:number;
    price:number;
    refiningLevel:number;
    type:number;
    cards:CardInfo[];
    perks:PerkInfo[];
}

export interface CardInfo {
    id:number;
    name:string;
}

export interface PerkInfo {
    id:number;
    name:string;
    value:number;
}