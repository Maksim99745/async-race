export const generateName = () => {
    const mark = [
        "Tesla",
        "Ford",
        "Seat",
        "Fiat",
        "BMW",
        "Chery",
        "Lada",
        "Dacia",
        "KIA",
        "Toyota",
    ];
    const model = [
        "Compact",
        "S",
        "Comfort",
        "Speed",
        "Family",
        "Off-road",
        "4X4",
        "Nitro",
        "Basic",
        "Gold",
    ];

    const randomMarkNumber = Math.floor(Math.random() * mark.length);
    const randomModelNumber = Math.floor(Math.random() * model.length);

    const result = `${mark[randomMarkNumber]} ${model[randomModelNumber]}`;
    return result;
};

generateName();
