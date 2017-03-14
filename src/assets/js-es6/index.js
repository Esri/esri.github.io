import calcite from 'calcite-web';
import hljs from './lib/highlight.pack.js';

calcite.init();
window.calcite = calcite;

hljs.initHighlighting();
window.hljs = hljs;
