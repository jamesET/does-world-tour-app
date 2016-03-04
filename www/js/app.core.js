(function() {
    'use strict';

    angular
        .module('app.core', [
            'ionic',
            'blocks.storage',
            'blocks.exception',
            'blocks.logger',
            'config'
        ])
        .constant('AUTH_EVENTS', {
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        });
})();
