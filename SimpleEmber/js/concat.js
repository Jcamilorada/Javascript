/*global Ember, DS, App:true */
window.App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'App-emberjs'
});

/*global App, Ember */
(function () {
    'use strict';
    App.TodoController = Ember.ObjectController.extend({
        isEditing: false,

        // We use the bufferedTitle to store the original value of
        // the model's title so that we can roll it back later in the
        // `cancelEditing` action.
        bufferedTitle: Ember.computed.oneWay('title'),

        actions: {
            editTodo: function () {
                this.set('isEditing', true);
            },

            doneEditing: function () {
                var bufferedTitle = this.get('bufferedTitle').trim();

                if (Ember.isEmpty(bufferedTitle)) {
                    // The `doneEditing` action gets sent twice when the user hits
                    // enter (once via 'insert-newline' and once via 'focus-out').
                    //
                    // We debounce our call to 'removeTodo' so that it only gets
                    // made once.
                    Ember.run.debounce(this, 'removeTodo', 0);
                } else {
                    var todo = this.get('model');
                    todo.set('title', bufferedTitle);
                    todo.save();
                }

                // Re-set our newly edited title to persist its trimmed version
                this.set('bufferedTitle', bufferedTitle);
                this.set('isEditing', false);
            },

            cancelEditing: function () {
                this.set('bufferedTitle', this.get('title'));
                this.set('isEditing', false);
            },

            removeTodo: function () {
                this.removeTodo();
            }
        },

        removeTodo: function () {
            var todo = this.get('model');

            todo.deleteRecord();
            todo.save();
        },

        saveWhenCompleted: function () {
            this.get('model').save();
        }.observes('isCompleted')
    });
})();

/*global App, Ember */
(function () {
    'use strict';

    App.AppController = Ember.ArrayController.extend({
        actions: {
            createTodo: function () {
                var title, todo;

                // Get the todo title set by the "New Todo" text field
                title = this.get('newTitle').trim();
                if (!title) {
                    return;
                }

                // Create the new Todo model
                todo = this.store.createRecord('todo', {
                    title: title,
                    isCompleted: false
                });
                todo.save();

                // Clear the "New Todo" text field
                this.set('newTitle', '');
            },

            clearCompleted: function () {
                var completed = this.get('completed');
                completed.invoke('deleteRecord');
                completed.invoke('save');
            },
        },

        /* properties */

        remaining: Ember.computed.filterBy('model', 'isCompleted', false),
        completed: Ember.computed.filterBy('model', 'isCompleted', true),

        allAreDone: function (key, value) {
            if (value !== undefined) {
                this.setEach('isCompleted', value);
                return value;
            } else {
                var length = this.get('length');
                var completedLength = this.get('completed.length');

                return length > 0 && length === completedLength;
            }
        }.property('length', 'completed.length')
    });
})();

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

/*global Ember */
(function () {
    'use strict';

    Ember.Handlebars.helper('pluralize', function (singular, count) {
        /* From Ember-Data */
        var inflector = Ember.Inflector.inflector;

        return count === 1 ? singular : inflector.pluralize(singular);
    });
})();

/*global App, DS */
(function () {
    'use strict';

    App.Todo = DS.Model.extend({
        title: DS.attr('string'),
        isCompleted: DS.attr('boolean')
    });
})();

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

/*global App, Ember */
(function () {
    'use strict';

    App.TodoInputComponent = Ember.TextField.extend({
        focusOnInsert: function () {
            // Re-set input value to get rid of a reduntant text selection
            this.$().val(this.$().val());
            this.$().focus();
        }.on('didInsertElement')
    });
})();
