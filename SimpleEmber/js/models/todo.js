/*global App, DS */
(function () {
    'use strict';

    App.Todo = DS.Model.extend({
        title: DS.attr('string'),
        isCompleted: DS.attr('boolean')
    });
})();
