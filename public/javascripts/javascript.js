function home() {
    location.href = "/home";
}

function profile() {
    location.href = "/profile";
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
    location.href = "/manage";
}

function login() {
    location.href = "/login";
}

function create_account_redirect() {
    location.href = "/create_account";
}

var vueinst = new Vue({
    el: '#vuemain',
    data: {
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
    vueinst.date = date;
}


updatetime();

setInterval(updatetime, 1000);

function login_check() {
    var uname = document.getElementById("username").value;
    var pword = document.getElementById("password").value;

    var message = "";
    var check = 0;

    if (uname == "") {
        message += "Please enter a username\n";
        check = 1;
    }

    if (pword == "") {
        message += "Please enter a password\n";
        check = 1;
    }

    if (check == 1) {
        swal(message);
    } else {
        login_auth();
    }
}

function create_account() {
    if (document.getElementById("username").value == "" || document.getElementById("password").value == "" || document.getElementById("first_name").value == "" || document.getElementById("last_name").value == "" || document.getElementById("date_of_birth").value == "" || document.getElementById("email").value == "") {
        swal("Please fill in all boxes");
    } else {
        create_account_auth();
    }
}