/*global App, Ember */
(function () {
    'use strict';

    App.AppListController = Ember.ArrayController.extend({
        needs: ['App'],
        allApp: Ember.computed.alias('controllers.App'),
        itemController: 'todo',
        canToggle: function () {
            var anyApp = this.get('allApp.length');
            var isEditing = this.isAny('isEditing');

            return anyApp && !isEditing;
        }.property('allApp.length', '@each.isEditing')
    });
})();
