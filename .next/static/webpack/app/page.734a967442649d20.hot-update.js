/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./components/ui/common/BottomSheet.tsx":
/*!**********************************************!*\
  !*** ./components/ui/common/BottomSheet.tsx ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./components/ui/transactions/TransactionContainer.tsx":
/*!*************************************************************!*\
  !*** ./components/ui/transactions/TransactionContainer.tsx ***!
  \*************************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _common_BottomSheet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/BottomSheet */ \"(app-pages-browser)/./components/ui/common/BottomSheet.tsx\");\n/* harmony import */ var _common_BottomSheet__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_common_BottomSheet__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _TransactionList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TransactionList */ \"(app-pages-browser)/./components/ui/transactions/TransactionList.tsx\");\n// components/ui/transactions/TransactionContainer.tsx\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\nconst TransactionContainer = (param)=>{\n    let { transactionGroups } = param;\n    _s();\n    const [currentSnap, setCurrentSnap] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1); // Start at middle snap point\n    // Define snap points (small, medium, large)\n    // We can either use absolute pixel values or percentages (0-1)\n    const snapPoints = [\n        150,\n        350,\n        0.75\n    ]; // The last one is 75% of viewport height\n    const toggleExpanded = ()=>{\n        setCurrentSnap(currentSnap === 2 ? 1 : 2);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_common_BottomSheet__WEBPACK_IMPORTED_MODULE_2___default()), {\n        snapPoints: snapPoints,\n        initialSnap: 1,\n        onSnap: setCurrentSnap,\n        bottomOffset: 80,\n        className: \"bg-[#212121]\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex justify-between items-center px-6 py-2\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                        className: \"text-white text-xl font-medium\",\n                        children: \"Transactions\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\_websites\\\\banking\\\\components\\\\ui\\\\transactions\\\\TransactionContainer.tsx\",\n                        lineNumber: 34,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        className: \"text-gray-400 text-sm hover:text-white transition-colors\",\n                        onClick: toggleExpanded,\n                        children: currentSnap === 2 ? \"Collapse\" : \"Full records\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\_websites\\\\banking\\\\components\\\\ui\\\\transactions\\\\TransactionContainer.tsx\",\n                        lineNumber: 35,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\_websites\\\\banking\\\\components\\\\ui\\\\transactions\\\\TransactionContainer.tsx\",\n                lineNumber: 33,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"px-4 pb-20\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_TransactionList__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                    transactionGroups: transactionGroups\n                }, void 0, false, {\n                    fileName: \"C:\\\\_websites\\\\banking\\\\components\\\\ui\\\\transactions\\\\TransactionContainer.tsx\",\n                    lineNumber: 45,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\_websites\\\\banking\\\\components\\\\ui\\\\transactions\\\\TransactionContainer.tsx\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\_websites\\\\banking\\\\components\\\\ui\\\\transactions\\\\TransactionContainer.tsx\",\n        lineNumber: 25,\n        columnNumber: 5\n    }, undefined);\n};\n_s(TransactionContainer, \"PWZXqKB9hj/CedIGp+SytHlcklw=\");\n_c = TransactionContainer;\n/* harmony default export */ __webpack_exports__[\"default\"] = (TransactionContainer);\nvar _c;\n$RefreshReg$(_c, \"TransactionContainer\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvdWkvdHJhbnNhY3Rpb25zL1RyYW5zYWN0aW9uQ29udGFpbmVyLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsc0RBQXNEOzs7QUFHZDtBQUNRO0FBQ0E7QUFPaEQsTUFBTUksdUJBQTREO1FBQUMsRUFBRUMsaUJBQWlCLEVBQUU7O0lBQ3RGLE1BQU0sQ0FBQ0MsYUFBYUMsZUFBZSxHQUFHTiwrQ0FBUUEsQ0FBQyxJQUFJLDZCQUE2QjtJQUVoRiw0Q0FBNEM7SUFDNUMsK0RBQStEO0lBQy9ELE1BQU1PLGFBQWE7UUFBQztRQUFLO1FBQUs7S0FBSyxFQUFFLHlDQUF5QztJQUU5RSxNQUFNQyxpQkFBaUI7UUFDckJGLGVBQWVELGdCQUFnQixJQUFJLElBQUk7SUFDekM7SUFFQSxxQkFDRSw4REFBQ0osNERBQVdBO1FBQ1ZNLFlBQVlBO1FBQ1pFLGFBQWE7UUFDYkMsUUFBUUo7UUFDUkssY0FBYztRQUNkQyxXQUFVOzswQkFHViw4REFBQ0M7Z0JBQUlELFdBQVU7O2tDQUNiLDhEQUFDRTt3QkFBR0YsV0FBVTtrQ0FBaUM7Ozs7OztrQ0FDL0MsOERBQUNHO3dCQUNDSCxXQUFVO3dCQUNWSSxTQUFTUjtrQ0FFUkgsZ0JBQWdCLElBQUksYUFBYTs7Ozs7Ozs7Ozs7OzBCQUt0Qyw4REFBQ1E7Z0JBQUlELFdBQVU7MEJBQ2IsNEVBQUNWLHdEQUFlQTtvQkFBQ0UsbUJBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJNUM7R0FwQ01EO0tBQUFBO0FBc0NOLCtEQUFlQSxvQkFBb0JBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy91aS90cmFuc2FjdGlvbnMvVHJhbnNhY3Rpb25Db250YWluZXIudHN4Pzc1M2UiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gY29tcG9uZW50cy91aS90cmFuc2FjdGlvbnMvVHJhbnNhY3Rpb25Db250YWluZXIudHN4XG4ndXNlIGNsaWVudCc7XG5cbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBCb3R0b21TaGVldCBmcm9tICcuLi9jb21tb24vQm90dG9tU2hlZXQnO1xuaW1wb3J0IFRyYW5zYWN0aW9uTGlzdCBmcm9tICcuL1RyYW5zYWN0aW9uTGlzdCc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbkRhdGVHcm91cCB9IGZyb20gJ0AvbGliL3R5cGVzJztcblxuaW50ZXJmYWNlIFRyYW5zYWN0aW9uQ29udGFpbmVyUHJvcHMge1xuICB0cmFuc2FjdGlvbkdyb3VwczogVHJhbnNhY3Rpb25EYXRlR3JvdXBbXTtcbn1cblxuY29uc3QgVHJhbnNhY3Rpb25Db250YWluZXI6IFJlYWN0LkZDPFRyYW5zYWN0aW9uQ29udGFpbmVyUHJvcHM+ID0gKHsgdHJhbnNhY3Rpb25Hcm91cHMgfSkgPT4ge1xuICBjb25zdCBbY3VycmVudFNuYXAsIHNldEN1cnJlbnRTbmFwXSA9IHVzZVN0YXRlKDEpOyAvLyBTdGFydCBhdCBtaWRkbGUgc25hcCBwb2ludFxuICBcbiAgLy8gRGVmaW5lIHNuYXAgcG9pbnRzIChzbWFsbCwgbWVkaXVtLCBsYXJnZSlcbiAgLy8gV2UgY2FuIGVpdGhlciB1c2UgYWJzb2x1dGUgcGl4ZWwgdmFsdWVzIG9yIHBlcmNlbnRhZ2VzICgwLTEpXG4gIGNvbnN0IHNuYXBQb2ludHMgPSBbMTUwLCAzNTAsIDAuNzVdOyAvLyBUaGUgbGFzdCBvbmUgaXMgNzUlIG9mIHZpZXdwb3J0IGhlaWdodFxuICBcbiAgY29uc3QgdG9nZ2xlRXhwYW5kZWQgPSAoKSA9PiB7XG4gICAgc2V0Q3VycmVudFNuYXAoY3VycmVudFNuYXAgPT09IDIgPyAxIDogMik7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8Qm90dG9tU2hlZXRcbiAgICAgIHNuYXBQb2ludHM9e3NuYXBQb2ludHN9XG4gICAgICBpbml0aWFsU25hcD17MX1cbiAgICAgIG9uU25hcD17c2V0Q3VycmVudFNuYXB9XG4gICAgICBib3R0b21PZmZzZXQ9ezgwfSAvLyBBY2NvdW50IGZvciBib3R0b20gbmF2aWdhdGlvblxuICAgICAgY2xhc3NOYW1lPVwiYmctWyMyMTIxMjFdXCJcbiAgICA+XG4gICAgICB7LyogSGVhZGVyIHdpdGggdGl0bGUgYW5kIGZ1bGwgcmVjb3JkcyBidXR0b24gKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBweC02IHB5LTJcIj5cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtd2hpdGUgdGV4dC14bCBmb250LW1lZGl1bVwiPlRyYW5zYWN0aW9uczwvaDI+XG4gICAgICAgIDxidXR0b24gXG4gICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTQwMCB0ZXh0LXNtIGhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUV4cGFuZGVkfVxuICAgICAgICA+XG4gICAgICAgICAge2N1cnJlbnRTbmFwID09PSAyID8gJ0NvbGxhcHNlJyA6ICdGdWxsIHJlY29yZHMnfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgICB7LyogVHJhbnNhY3Rpb24gbGlzdCAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNCBwYi0yMFwiPiBcbiAgICAgICAgPFRyYW5zYWN0aW9uTGlzdCB0cmFuc2FjdGlvbkdyb3Vwcz17dHJhbnNhY3Rpb25Hcm91cHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L0JvdHRvbVNoZWV0PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb25Db250YWluZXI7Il0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJCb3R0b21TaGVldCIsIlRyYW5zYWN0aW9uTGlzdCIsIlRyYW5zYWN0aW9uQ29udGFpbmVyIiwidHJhbnNhY3Rpb25Hcm91cHMiLCJjdXJyZW50U25hcCIsInNldEN1cnJlbnRTbmFwIiwic25hcFBvaW50cyIsInRvZ2dsZUV4cGFuZGVkIiwiaW5pdGlhbFNuYXAiLCJvblNuYXAiLCJib3R0b21PZmZzZXQiLCJjbGFzc05hbWUiLCJkaXYiLCJoMiIsImJ1dHRvbiIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/ui/transactions/TransactionContainer.tsx\n"));

/***/ })

});