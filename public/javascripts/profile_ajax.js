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

var vue_profile = new Vue({
    el: '#vue_profile',
    data: {
        date: '',
        editing: false,
        current_user: '',
        user_data: []

    },

    mounted() {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var rows = JSON.parse(xhttp.responseText);
                vue_profile.current_user = rows[0];
                vue_profile.user_data = rows[1][0];
            }
        };

        var urlParams = window.location.pathname;
        var Q = urlParams.split('profile/')[1];

        xhttp.open("GET", "/profile_data/" + Q, true);

        xhttp.send();
    },

    methods: {
        swal: function (ter) {
            swal(ter);
        },

        edit_profile: function () {

            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    location.reload();
                }
            };

            xhttp.open("POST", "/editprofile", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                "bio": document.getElementById("profile_bio").value,
                "education": document.getElementById("profile_education").value,
                "hobbies": document.getElementById("profile_hobbies").value,
                "availability": document.getElementById("profile_availability").value
            }));

        }
    }
});

function updatetime() {
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + "  " + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    vue_profile.date = date;
}

updatetime();

setInterval(updatetime, 1000);
