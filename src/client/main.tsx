import React from "react";
import ReactDOM from "react-dom/client";
import LineItems from "./lineItems";

declare global {
    interface Window { __FASTIFY_PROPS__?: any }
}

ReactDOM.hydrateRoot(
    document.getElementById("root")!,
    <LineItems {...(window.__FASTIFY_PROPS__ || {})} />
);
