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

var vuemain_page = new Vue({
    el: '#vuemain_page',
    data: {
        date: '',
        tasks: [],
    },

    mounted() {
        //Get request for tasks
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rows = JSON.parse(xhttp.responseText);
                vuemain_page.tasks = rows;
            }
        };

        xhttp.open("GET", "/hometasks", true);

        xhttp.send();
    },

    methods: {
        swal: function (ter) {
            swal(ter);
        }
    }
});


function updatetime() {
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + "  " + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    vuemain_page.date = date;
}

updatetime();

setInterval(updatetime, 1000);