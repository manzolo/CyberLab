import { test } from "node:test";
import assert from "node:assert/strict";

import { normalizzaInputTerminale } from "../js/lab/input.js";

test("l'incolla non invia i marcatori bracketed-paste alla VM", () => {
    const comando = "sudo iptables -A EDU-GUARD -j REJECT";
    assert.equal(normalizzaInputTerminale(`\x1b[200~${comando}\x1b[201~`), comando);
});

test("un incolla multilinea non esegue righe senza un Invio esplicito", () => {
    assert.equal(normalizzaInputTerminale("\x1b[200~prima\nseconda\x1b[201~"), "prima seconda");
});

test("la digitazione normale non viene modificata", () => {
    assert.equal(normalizzaInputTerminale("echo àèìòù\r"), "echo àèìòù\r");
});
