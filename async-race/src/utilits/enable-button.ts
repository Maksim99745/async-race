import { isInstanceOf } from "./common";

export const enableButton = (buttonNode: unknown): buttonNode is HTMLElement => {
    if (isInstanceOf(HTMLButtonElement, buttonNode)) {
        buttonNode.disabled = false;
    }
    return true;
};
