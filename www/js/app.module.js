(function() {
    'use strict';

    angular
        .module('app', [
            'app.core',

            'starter.controllers',
            'app.beers',
            'app.auth',
            'app.verifybeer',
            'app.users',
            'app.beerlists',
            'app.account'
        ]);
})();
