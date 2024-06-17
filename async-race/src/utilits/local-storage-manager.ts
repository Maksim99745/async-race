import { isNotNullable } from "./common";
import { FinisherData } from "./types";

export class LoсalStorageManager {
    public setInitial() {
        localStorage.setItem(
            "AsyncRace",
            JSON.stringify({
                isRace: false,
                racersStack: [],
            })
        );
    }

    public setUpdatingCar(id: number) {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            localStorageData.currentUpdating = id;
            localStorage.setItem("AsyncRace", JSON.stringify(localStorageData));
        }
    }

    public getUpdatingCar() {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            const currentCar = localStorageData.currentUpdating;
            return currentCar;
        }
    }

    public isRace() {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            const isRace = localStorageData.isRace;
            return isRace;
        }
    }

    public startRace() {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            localStorageData.isRace = true;
            localStorage.setItem("AsyncRace", JSON.stringify(localStorageData));
        }
    }

    public endRace() {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            localStorageData.isRace = false;
            localStorage.setItem("AsyncRace", JSON.stringify(localStorageData));
        }
    }

    public removeFinishers() {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            localStorageData.racersStack = [];
            localStorage.setItem("AsyncRace", JSON.stringify(localStorageData));
        }
    }

    public addFinisher(data: FinisherData) {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            localStorageData.racersStack.push(data);
            localStorage.setItem("AsyncRace", JSON.stringify(localStorageData));
        }
    }

    public getWinnerLocalStorage() {
        const localStorageJSON = localStorage.getItem("AsyncRace");
        if (isNotNullable(localStorageJSON)) {
            const localStorageData = JSON.parse(localStorageJSON);
            const winner = localStorageData.racersStack[0];
            return winner;
        }
    }
}
