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


var vuegroups = new Vue({
    el: '#vuegroups',
    data: {
        date: '',
        num_users: 0,
        num_tasks: 0,
        tasks: [],
        assignments: [],

    },

    mounted() {
        //Get request for all users and their groups of assignments to tasks

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rows = JSON.parse(xhttp.responseText);
                console.log(rows);
                vuegroups.tasks = rows;
                vuegroups.assignments = rows[2];
                vuegroups.num_tasks = rows[0].length;
                vuegroups.num_users = rows[1].length;
            }
        };

        xhttp.open("GET", "/groups_people", true);

        xhttp.send();
    },


    methods: {
        swal: function (ter) {
            swal(ter);
        },

        profile_redirect: function (id) {
            location.href = "/profile/" + id;
        }
    }
});

function updatetime() {
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + "  " + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    vuegroups.date = date;
}


updatetime();

setInterval(updatetime, 1000);