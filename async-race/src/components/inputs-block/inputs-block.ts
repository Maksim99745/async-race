import { Component } from "../../utilits/base-components";
import { CarBlockController } from "../car-block/car-block-controller";
import { CreateBlock } from "./create-input";
import { UpdateBlock } from "./update-input";

export class InputsBlock {

    public _removeCarBlockFromArr: (id: number) => void;
    private _getCarBlockArr: () => CarBlockController[];

    constructor(
        removeCarBlockFromArr: (id: number) => void,
        getCarBlockArr: () => CarBlockController[]

    ) {
        this._removeCarBlockFromArr = removeCarBlockFromArr;
        this._getCarBlockArr = getCarBlockArr
    }

    draw(): Component {
        const inputBlock = new Component({
            tag: "div",
            className: "inputs-block",
        });
        const createBlock = new CreateBlock(
            this._removeCarBlockFromArr,
            this._getCarBlockArr
        ).draw();
        const updateBlock = new UpdateBlock(
            this._removeCarBlockFromArr,
            this._getCarBlockArr
        ).draw();
        inputBlock.append(createBlock);
        inputBlock.append(updateBlock);
        return inputBlock;
    }
}
