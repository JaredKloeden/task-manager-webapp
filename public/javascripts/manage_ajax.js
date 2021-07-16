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

var manage_main = new Vue({
    el: '#manage_main',
    data: {
        date: '',
        create_new_press: false,
        manage_press: false,
        users: [],
        completed_tasks: []
    },

    mounted() {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rows = JSON.parse(xhttp.responseText);
                manage_main.users = rows[0];
                manage_main.completed_tasks = rows[1];
            }
        };

        xhttp.open("GET", "/manage_users", true);

        xhttp.send();
    },

    methods: {
        swal: function (ter) {
            swal(ter);
        },

        delete_task: function (i) {

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    manage_main.swal("Task successfully removed from database");
                    document.getElementById(i).style.visibility = "hidden";
                }
            };

            xhttp.open("POST", "/delete_post", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({ "id": i }));

        }
    }
});

function getSelectedOptions(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

function post_check() {
    var inputs = document.getElementById("new_post_form").elements;
    var missing = [0, 0, 0, 0, 0];
    var fail = 0;
    for (i = 0; i < 5; i++) {
        if (inputs[i].value == "") {
            missing[i] = i + 1;
            fail = 1;
        }
    }

    var message = "";

    if (fail == 1) {
        for (i = 0; i < 5; i++) {
            if (missing[i] == 1) {
                message += "Please include task name\n";
            } if (missing[i] == 2) {
                message += "Please include short description\n";
            } if (missing[i] == 3) {
                message += "Please include long description\n";
            } if (missing[i] == 4) {
                message += "Please include due date\n";
            } if (missing[i] == 5) {
                message += "Please include assigned people\n";
            }
        }

        swal(message);
    }


    if (fail == 0) {
        create_new();
    }
}

function updatetime() {
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + "  " + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    manage_main.date = date;
}


updatetime();

setInterval(updatetime, 1000);