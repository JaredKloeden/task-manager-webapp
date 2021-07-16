function create_new() {
    //Post request for when a new task is created

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        swal("Task created");
    }
  };

    var people=[];
    x=document.getElementById("myid");
    for (var i=0; i<x.options.length; i++){
        if (x.options[i].selected==true){
            people.push(x.options[i].value);
        }
    }

  xhttp.open("POST","/createpost",true);
    //Need to send information from form inputs on create new page
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({
      details: {
      "task_name": document.getElementById("task_name").value,
      "short_description":document.getElementById("short_description").value,
      "long_description":document.getElementById("long_description").value,
      "due_date":document.getElementById("due_date").value
            },

      people: {
        people,
      }
  }));
}

function logout() {
    //GET request for logout

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        location.href = "/login";
    }
  };

  xhttp.open("GET","/logout",true);

  xhttp.send();
}

function login_auth() {

    var xhttp2 = new XMLHttpRequest();

    xhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        location.href=("/home");
    }else if(this.readyState == 4 && this.status == 401){
        swal("Incorrect username or password");
    }
    };

    xhttp2.open("POST", "/login_auth", true);
    xhttp2.setRequestHeader("Content-type", "application/json");
    xhttp2.send(JSON.stringify({ "user": document.getElementById("username").value, "pass": document.getElementById("password").value }));
}

function create_account_auth() {

    var xhttp2 = new XMLHttpRequest();

    xhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
        location.href=("/login");
    }else if(this.readyState == 4 && this.status == 401){
        swal("Username already in use");
    }
    };

    xhttp2.open("POST", "/create_account_auth", true);
    xhttp2.setRequestHeader("Content-type", "application/json");
    xhttp2.send(JSON.stringify({ "username": document.getElementById("username").value, "password": document.getElementById("password").value, "first_name": document.getElementById("first_name").value, "last_name": document.getElementById("last_name").value, "date_of_birth": document.getElementById("date_of_birth").value, "email": document.getElementById("email").value,  }));
}