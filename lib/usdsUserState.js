// Helper object to simplify use of HTML5 storage

function UsdsUserState function() {
    var lastError = 'No error';

    this.state = function(persistence) {
        if (!Storage) {
            lastError = 'UsdsUserState.state(): HTML5 storage not present';
            return {};
        }
        if (persistence === 'session') {
            if (!sessionStorage.usdsUserState) {
                lastError = 'UsdsUserState.state(): No session storage saved';
                return {};
            }
            return JSON.parse(sessionStorage.usdsUserState);
        } else if (persistence === 'local') {
            if (!localStorage.usdsUserState) {
                lastError = 'UsdsUserState.state(): No local storage saved';
                return {};
            }
            return JSON.parse(localStorage.usdsUserState);
        } else if (persistence === 'any') {
            if (!sessionStorage.usdsUserState) {
                if (!localStorage.usdsUserState) {
                    lastError = 'UsdsUserState.state(): No storage saved';
                    return {};
                } else {
                    return JSON.parse(localStorage.usdsUserState);
                }
            } else {
                return JSON.parse(localStorage.usdsUserState);
            }
            return JSON.parse(localStorage.usdsUserState);
        } else {
            lastError = 'UsdsUserState.state(): illegal persistence value';
            return {};
        }
    }

    this.state = function(state, persistence) {
        if (!Storage) {
            lastError = 'UsdsUserState.state(): HTML5 storage not present';
        }
        if (persistence === 'session') {
            sessionStorage.usdsUserState =
                JSON.stringify(state);
        } else if (persistence === 'local') {
            localStorage.usdsUserState =
                JSON.stringify(state);
        } else if (persistence === 'all') {
            sessionStorage.usdsUserState =
                JSON.stringify(state);
            localStorage.usdsUserState =
                sessionStorage.usdsUserState;
        }
    }
}
