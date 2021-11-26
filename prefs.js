'use strict'


const ExtensionUtils = imports.misc.extensionUtils;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Me = ExtensionUtils.getCurrentExtension();

function init() {

}

function buildPrefsWidget() {
    // this needs to be in both the main file and the prefs file
    this.settings = ExtensionUtils.getSettings("ca.pfaj.showpath");

    // create a parent widget
    const prefsWidget = new Gtk.Grid({
        margin: 18,
        column_spacing: 12,
        row_spacing: 12,
        visible: true,
    });

    // add title
    const title = new Gtk.Label({
        label: `<b>${Me.metadata.name} Preferences</b>`,
        halign: Gtk.Align.START,
        visible: true,
        use_markup: true,
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    // add label and switch for "Show in folder"
    const showInFolderLabel = new Gtk.Label({
        label: "Show 'Show in folder'",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(showInFolderLabel, 0, 1, 1, 1);
    const showInFolderToggle = new Gtk.Switch({
        active: this.settings.get_boolean('show-show-in-folder'),
        halign: Gtk.Align.END,
        visible: true,
    });
    prefsWidget.attach(showInFolderToggle, 1, 1, 1, 1);

    // add label and switch for "Copy path"
    const copyPathLabel = new Gtk.Label({
        label: "Show 'Copy path'",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(copyPathLabel, 0, 2, 1, 1);
    const copyPathToggle = new Gtk.Switch({
        active: this.settings.get_boolean('show-copy-path'),
        halign: Gtk.Align.END,
        visible: true,
    });
    prefsWidget.attach(copyPathToggle, 1, 2, 1, 1);

    // add label and switch for "Show path"
    const showPathLabel = new Gtk.Label({
        label: "Show path",
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(showPathLabel, 0, 3, 1, 1);
    const showPathToggle = new Gtk.Switch({
        active: this.settings.get_boolean('show-path'),
        halign: Gtk.Align.END,
        visible: true,
    });
    prefsWidget.attach(showPathToggle, 1, 3, 1, 1);

    // bind toggles to config
    this.settings.bind('show-show-in-folder', showInFolderToggle, 'active', Gio.SettingsBindFlags.DEFAULT);
    this.settings.bind('show-copy-path', copyPathToggle, 'active', Gio.SettingsBindFlags.DEFAULT);
    this.settings.bind('show-path', showPathToggle, 'active', Gio.SettingsBindFlags.DEFAULT);

    return prefsWidget;
}