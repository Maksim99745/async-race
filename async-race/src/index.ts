import { Header } from "./components/header/header";
import "./global.css";
import { LoсalStorageManager } from "./utilits/local-storage-manager";
import { GaragePage } from "./views/garage/garage";
import { WinnersPage } from "./views/winners/winners";

const currentWinnersPage: number = 1;

const localStorageManager = new LoсalStorageManager();
localStorageManager.setInitial();
const body = document.body;
const winnersPage = new WinnersPage(body, currentWinnersPage);
const header = new Header(body, winnersPage);
header.draw();
winnersPage.draw();
const garagePage = new GaragePage(body);
garagePage.draw();
