import { Api } from "./api";

 export const isLastCarPage = async (currentPage: number) => {
        const api = new Api();
        const carAmountArr = await api.getAllCars();
        const carAmount = carAmountArr.length;
        const maxCarsShowed = currentPage * 7;
        const carsLeft = carAmount - maxCarsShowed;
        if (carsLeft > 0) {
            return false;
        }
        return true;
    }