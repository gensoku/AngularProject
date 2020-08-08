export enum Genres {
    Comedy = 'Comedy',
    Drame = 'Drame',
    Action = 'Action'
}

export class Movie {
    _id: string;
    actors: string[];
    country: string;
    director: string;
    genre: string;
    img: string;
    language: string;
    plot: string;
    rating: string;
    released: string;
    runtime: number;
    title: string;
    type: string;
    writer:string;
    year:number;
}

export interface Votes {
    up: Number;
    down: Number;
}

export class MovieComment {
    content: string;
    username: string;
    anonymous: boolean;
    votes?: Votes;
    createdAt?: string;
    updatedAt?: string;  
}