// ==UserScript==
// @name         BizRaport — odblokuj dane i ukryj popup logowania
// @namespace    https://github.com/nxm
// @version      1.0.0
// @description  Zdejmuje rozmycie (Tailwind `blur-sm`) z danych i usuwa popup "Miło Cię widzieć".
// @author       jakub
// @match        https://www.bizraport.pl/*
// @match        https://bizraport.pl/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = '.blur-sm{filter:none!important;-webkit-filter:none!important}';
  (document.head || document.documentElement).appendChild(style);

  const POPUP_RE = /Mi[łl]o Ci[eę] widzie/i;

  const isPopup = (el) =>
    el.nodeType === 1 &&
    el.tagName === 'DIV' &&
    getComputedStyle(el).position === 'fixed' &&
    POPUP_RE.test(el.textContent || '');

  const killIn = (node) => {
    if (node.nodeType !== 1) return;
    if (isPopup(node)) { node.remove(); return; }
    if (node.querySelectorAll) {
      for (const el of node.querySelectorAll('div')) {
        if (isPopup(el)) el.remove();
      }
    }
  };

  const start = () => {
    killIn(document.documentElement);
    new MutationObserver((muts) => {
      for (const m of muts) for (const n of m.addedNodes) killIn(n);
    }).observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();

