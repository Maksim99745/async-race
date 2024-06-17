import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";

export class Pagination {
    public drawCounter(className: string) {
        const counter = new Component({
            tag: "div",
            className: className,
        });
        const counterNode = counter.getNode();
        counterNode.textContent = `Page #1`;
        return counter;
    }

    public drawPaginationButtonsBlock(
        parent: Component,
        buttons: Array<Component>
    ) {
        const block = new Component({
            tag: "div",
            className: "pagination-buttons",
        });
        block.appendChildren(buttons);
        parent.append(block);
    }

    public drawPrevButton() {
        const prevButton = new Component({
            tag: "button",
            className: "pagination-button",
            text: "prev",
        });
        prevButton.setAttribute("disabled", "");
        return prevButton;
    }

    public async drawNextButton(maxItemPerPage: number) {
        const nextButton = new Component({
            tag: "button",
            className: "pagination-button",
            text: "next",
        });
        //prevent disable after reload
        const api = new Api();
        const carAmountArr = await api.getAllCars();
        if (carAmountArr.length <= maxItemPerPage) {
            nextButton.setAttribute("disabled", "");
        }
        return nextButton;
    }
}
