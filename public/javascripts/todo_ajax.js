function home() {
    location.href = "/home";
}

function profile() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var user = xhttp.responseText;
            location.href = "/profile/" + user;
        }
    };

    xhttp.open("GET", "/current_user", true);

    xhttp.send();
}

function todo() {
    location.href = "/todo";
}

function groups() {
    location.href = "/groups";
}

function notifications() {
    location.href = "/notifications";
}

function manage() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            location.href = "/manage";
        }
        if (this.readyState == 4 && this.status == 403) {
            swal("Sorry, you do not have permissions to access this tab.");
        }
    };

    xhttp.open("GET", "/is_manager", true);

    xhttp.send();
}

function login() {
    location.href = "/login";
}

var vue_todo = new Vue({
    el: '#vue_todo',
    data: {
        date: '',
        tasks: []
    },

    mounted() {
        //GET request for logout

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rows = JSON.parse(xhttp.responseText);
                vue_todo.tasks = rows;
            }
        };

        xhttp.open("GET", "/todo_tasks", true);

        xhttp.send();
    },


    methods: {
        swal: function (ter) {
            swal(ter);
        },

        mark_complete: function (i) {

            this.tasks[i].progress = 1;

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vue_todo.swal("Marked as completed");
                }
            };

            xhttp.open("POST", "/mark_complete", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ "id": this.tasks[i].id }));
        },

        unmark_complete: function (i) {

            this.tasks[i].progress = 0;

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("unmarked task");
                }
            };

            xhttp.open("POST", "/unmark_complete", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ "id": this.tasks[i].id }));
        }
    }
});

function updatetime() {
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + "  " + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    vue_todo.date = date;
}


updatetime();

setInterval(updatetime, 1000);