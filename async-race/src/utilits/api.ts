import { isNotNullable } from "./common";
import {
    CarData,
    OrderTypes,
    SortTypes,
    StartStop,
    UpdatingWinnerData,
    WinnerData,
} from "./types";

export class Api {
    public async getCars(page: number = 1) {
        try {
            const response = await fetch(
                `http://localhost:3000/garage?_page=${page}&_limit=7`
            );
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllCars() {
        try {
            const response = await fetch(`http://localhost:3000/garage`);
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    public async getCar<T extends CarData>(id: number): Promise<T> {
        try {
            const response = await fetch(`http://localhost:3000/garage/${id}`);
            const carJSON = await response.json();
            return carJSON;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async createCar(name: string, color: string) {
        const newCar = {
            name,
            color,
        };
        if (isNotNullable(newCar)) {
            try {
                const response = await fetch(`http://localhost:3000/garage/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCar),
                });
                return response;
            } catch (error) {
                console.log(error);
            }
        }
    }

    public async deleteCar(id: number) {
        try {
            const response = await fetch(`http://localhost:3000/garage/${id}`, {
                method: "DELETE",
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async updateCar(parametrs: CarData) {
        const newData = {
            name: parametrs.name,
            color: parametrs.color,
        };
        try {
            if (isNotNullable(newData)) {
                const response = await fetch(
                    `http://localhost:3000/garage/${parametrs.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newData),
                    }
                );
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async startStopEngine(queries: StartStop) {
        if (isNotNullable(queries)) {
            try {
                const response = await fetch(
                    `http://localhost:3000/engine?id=${queries.id}&status=${queries.status}`,
                    {
                        method: "PATCH",
                    }
                );
                const responseJSON = await response.json();
                return responseJSON;
            } catch (error) {
                console.error(error);
            }
        }
    }

    public async drive(id: number) {
        if (isNotNullable(id)) {
            try {
                const response = await fetch(
                    `http://localhost:3000/engine?id=${id}&status=drive`,
                    {
                        method: "PATCH",
                    }
                );
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const responseJSON = await response.json();
                return responseJSON;
            } catch (error) {
                throw new Error("API Error: " + error);
            }
        }
    }

    public async getWinners(
        page: number = 1,
        sortType: SortTypes = "id",
        order: OrderTypes = "ASC"
    ) {
        try {
            const response = await fetch(
                `http://localhost:3000/winners?_page=${page}&_limit=10&_sort=${sortType}&_order=${order}`
            );
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    public async getAllWinners() {
        try {
            const response = await fetch(`http://localhost:3000/winners`);
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    public async getWinner<T extends WinnerData>(id: number): Promise<T> {
        try {
            const response = await fetch(`http://localhost:3000/winners/${id}`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const responseJSON = await response.json();
            return responseJSON;
        } catch (error) {
            console.log("404 - This car won first time and haven't found in winners on server") 
            throw new Error("API Error: " + error);
        }
    }

    public async createWinner(winnerData: WinnerData) {
        if (isNotNullable(winnerData)) {
            try {
                const response = await fetch(`http://localhost:3000/winners`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(winnerData),
                });
                return response;
            } catch (error) {
                console.log(error);
            }
        }
    }

    public async deleteWinner(id: number) {
        try {
            const response = await fetch(
                `http://localhost:3000/winners/${id}`,
                {
                    method: "DELETE",
                }
            );
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    public async updateWinner(parametrs: UpdatingWinnerData, id: number) {
        const newData = {
            wins: parametrs.wins,
            time: parametrs.time,
        };
        try {
            if (isNotNullable(newData)) {
                await fetch(`http://localhost:3000/winners/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData),
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}