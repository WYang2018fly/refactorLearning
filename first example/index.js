import { INVOICES as invoices, PLAYS as plays } from './data/constant.js';
import statement from './src/statement_s2-2.js';
console.log(statement(invoices[0], plays));
// console.log(statement_bad(invoices[0], plays));