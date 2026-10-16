import type { NewBook } from '../types/Book';

export const listaMock: NewBook[] = [
    {
        title: "Dom Casmurro",
        author: "Machado de Assis",
        description: "Um dos romances mais conhecidos da literatura brasileira.",
        image: "https://placehold.co/300x200?text=Dom+Casmurro",
        genre: "Romance",
        status: "Não lido",
        isMock: true
    },
    {
        title: "Quarto de Despejo",
        author: "Carolina Maria de Jesus",
        description: "Relatos do cotidiano de uma mulher na favela do Canindé.",
        image: "https://placehold.co/300x200?text=Quarto+de+Despejo",
        genre: "Outro",
        status: "Lido",
        isMock: true
    },
    {
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        description: "Uma história sobre amizade, afeto e responsabilidade.",
        image: "https://placehold.co/300x200?text=O+Pequeno+Principe",
        genre: "Infantil",
        status: "Não lido",
        isMock: true
    }
];