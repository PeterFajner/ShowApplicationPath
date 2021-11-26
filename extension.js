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
const { Clutter, Gio, GLib, GObject, Graphene, Meta, Shell, St } = imports.gi;
const File = Gio.File;
const Util = imports.misc.util;
const Main = imports.ui.main;

class Extension {
    constructor() {
    }

    enable() {
        this.settings = ExtensionUtils.getSettings("ca.pfaj.showpath");
        injectIntoAppMenu(this.settings);
    }

    disable() {
    }
}

function injectIntoAppMenu(settings) {
    myLog("Injecting into app menu...");
    const originalFunc = AppIconMenu.prototype._rebuildMenu;
    AppIconMenu.prototype._rebuildMenu = function() {
        // run the original _rebuildMenu()
        originalFunc.bind(this)();

        // get the app's file path
        const app = this._source.app;
        const appInfo = app.get_app_info();
        const filePath = appInfo.get_filename();
        const fileDirectory = File.new_for_path(filePath).get_parent().get_path();

        // get extension settings
        const showShowInFolder = settings.get_boolean("show-show-in-folder");
        const showCopyPath = settings.get_boolean("show-copy-path");
        const showPath = settings.get_boolean("show-path");

        // add our menu entries
        if (showShowInFolder || showCopyPath || showPath) {
            this._appendSeparator();
        }
        if (showShowInFolder) {
            this._show_in_folder = this._appendMenuItem("Show in folder" /* todo i10n support */);
            this._show_in_folder.connect("activate", () => {
                myLog(`Settings: ${settings}`);
                myLog(`Source: ${this._source}`);
                myLog(`App: ${app}`);
                myLog(`App id: ${this._source.app.get_id()}`);
                myLog(`App name: ${this._source.app.get_name()}`);
                //const appSys = Shell.AppSystem.get_default();
                //const app = appSys.lookup_app(this._source.app.get_id());
                myLog(`App info: ${appInfo}`);
                myLog(`App filepath: ${filePath}`);
                myLog(`App directory: ${fileDirectory}`);
                // open file manager at path
                const dbusCommand = `dbus-send --session --print-reply --dest=org.freedesktop.FileManager1 --type=method_call /org/freedesktop/FileManager1 org.freedesktop.FileManager1.ShowItems array:string:"file://${filePath}" string:""`
                //Util.spawn(["/bin/bash", "-c", `xdg-open ${fileDirectory}`]);
                Util.spawn(["/bin/bash", "-c", dbusCommand]);
                // hide overview
                Main.overview.hide();
            });
        }
        if (showCopyPath) {
            this._copy_path = this._appendMenuItem("Copy path" /* todo i10n support */);
            this._copy_path.connect("activate", () => {
                St.Clipboard.get_default().set_text(St.ClipboardType.PRIMARY, filePath);
                St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, filePath);
            });
        }
        if (showPath) {
            this._show_path = this._appendMenuItem(filePath);
            this._show_path.connect("activate", () => {
                St.Clipboard.get_default().set_text(St.ClipboardType.PRIMARY, filePath);
                St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, filePath);
            });
        }        
    };
}


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
