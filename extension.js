/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const ExtensionUtils = imports.misc.extensionUtils;
const AppIconMenu = imports.ui.appDisplay.AppIconMenu;

class Extension {
    constructor() {
    }

    enable() {
        this.settings = ExtensionUtils.getSettings("ca.pfaj.showpath");
        injectIntoAppMenu();
    }

    disable() {
    }
}

function injectIntoAppMenu() {
    myLog("Injecting into app menu...");
    const originalFunc = AppIconMenu.prototype._rebuildMenu;
    AppIconMenu.prototype._rebuildMenu = function() {
        myLog(this);

        // run the original _rebuildMenu()
        originalFunc.bind(this)();

        // add our menu entries
        const _sampleEntry = this._appendMenuItem("Test entry" /* todo i10n support */);

        // log something
        myLog("Hello from the _rebuildMenu method!");
    };
}

/*
function injectToFunction(parent, name, func) {
	let origin = parent[name];
	parent[name] = function() {
		let ret;
		ret = origin.apply(this, arguments);
			if (ret === undefined)
				ret = func.apply(this, arguments);
			return ret;
		}
	return origin;
}
*/

/**
 * Base logging function that logs to log, stdout, or stderr with date prefix.
 * 
 * @param {function} printFunction 
 * @param {string} msg 
 */
function baseLog(printFunction, msg) {
    const formattedMsg = `[${new Date().toISOString()} showpath] ${msg}`;
    printFunction(formattedMsg);
}

function myLog(msg) {
    baseLog(log, msg);
}

function myErr(msg) {
    baseLog(printerr, msg);
}

function myPrint(msg) {
    baseLog(print, msg);
}

function init() {
    return new Extension();
}
