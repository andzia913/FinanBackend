import { AppDataSource } from "../utils/db";

import {Type} from "../entities/Type";

export const addInitialData = async () => {
    const typeRepository = AppDataSource.getRepository(Type);

    const types = [
        { name: 'Przychód' },
        { name: 'Koszt'},
    ];

    await typeRepository.save(types);

    console.log("Initial data added successfully!");
};
