/*global Ember, App */
(function () {
    'use strict';

    App.Router.map(function () {
        this.resource('App', { path: '/' }, function () {
            this.route('active');
            this.route('completed');
        });
    });

    App.AppRoute = Ember.Route.extend({
        model: function () {
            return this.store.find('todo');
        }
    });

    App.AppIndexRoute = App.AppRoute.extend({
        templateName: 'todo-list',
        controllerName: 'App-list'
    });

    App.AppActiveRoute = App.AppIndexRoute.extend({
        model: function () {
            return this.store.filter('todo', function (todo) {
                return !todo.get('isCompleted');
            });
        }
    });

    App.AppCompletedRoute = App.AppIndexRoute.extend({
        model: function () {
            return this.store.filter('todo', function (todo) {
                return todo.get('isCompleted');
            });
        }
    });
})();
