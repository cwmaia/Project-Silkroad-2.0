"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.firebaseConfig = void 0;
var app_1 = require("firebase/app");
exports.firebaseConfig = {
    apiKey: "AIzaSyArKXLe0Anb2-Hjo4NQfQ8oBwce8Ht5jOo",
    authDomain: "project-silkroad.firebaseapp.com",
    projectId: "project-silkroad",
    storageBucket: "project-silkroad.firebasestorage.app",
    messagingSenderId: "407212207739",
    appId: "1:407212207739:web:e9e823ce9d605d489d7cde",
    measurementId: "G-HE1WLB7VVM"
};
exports.app = (0, app_1.initializeApp)(exports.firebaseConfig);
