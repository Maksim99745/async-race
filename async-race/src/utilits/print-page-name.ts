import { Component } from "./base-components";

export const printPageName = (name: string) => {
    const pageName = new Component({
        tag: "div",
        className: "page-name",
        text: name,
    });
    return pageName;
};
