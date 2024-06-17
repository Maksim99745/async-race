export const generateColor = () => {
    const colors = [
        "#ffffff",
        "#FFAEBC",
        "#A0E7E5",
        "#B4F8C8",
        "#FBE7C6",
        "#74BDCB",
        "#E7F2F8",
        "#4EC33D",
        "#353643",
        "#F0C9B3",
    ];

    const randomColorNumber = Math.floor(Math.random() * colors.length);
    const result = `${colors[randomColorNumber]}`;
    return result;
};
