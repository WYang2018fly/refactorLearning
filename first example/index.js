import { INVOICES as invoices, PLAYS as plays } from './data/constant.js';
import { statement, htmlStatement } from './src/statement_s2-2.js';
console.log(statement(invoices[0], plays));
console.log(htmlStatement(invoices[0], plays));