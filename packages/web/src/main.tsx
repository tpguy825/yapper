import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";
import { edenTreaty } from "@elysiajs/eden";
import type { App as BackendApp } from "backend/index.ts";
import PocketBase from "pocketbase";

const isDev = import.meta.env.DEV;

export const eden = edenTreaty<BackendApp>(isDev ? "http://localhost:63273" : "https://some-domain.example.com");
export const pb = new PocketBase("http://localhost:8090");

window.pb = pb;

render(<App />, document.getElementById("app")!);
