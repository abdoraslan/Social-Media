// Function to get the logged-in user's info
function getUser() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user != null) {
        let username = user.username;
        let image = user.profile_image;
        document.getElementById("user").innerHTML = username;
        document.getElementById("user-image").src = image;
    }
}

// Set up the navigation bar based on user login status
setUpNavBar();

// Bootstrap modal instances for login and register modals
var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
var modal2 = new bootstrap.Modal(document.getElementById('exampleModal2'));

// Handle login event
document.getElementById("login").addEventListener("click", (event) => {
    event.preventDefault();
    let userName = document.getElementById("username").value;
    let passWord = document.getElementById("password").value;
    toggle(true)
    axios.post(`https://tarmeezacademy.com/api/v1/login`, {
        "username": userName,
        "password": passWord
    })
        .then(function (response) {
            toggle(false)
            let token = response.data.token;
            let user = response.data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            // Set alert message and type in localStorage
            localStorage.setItem("alertMessage", 'Logged in Successfully');
            localStorage.setItem("alertType", 'success');
            localStorage.setItem("reloadIndex", 'true'); // Set reload flag
            modal.hide();
            setUpNavBar();
            // Show input group
            document.getElementById("input-group").style.visibility = "visible";
            document.getElementById("input-group").style.height = "auto";
            document.getElementById("input-group").style.opacity = "1";
            handleIndexReload(); // Handle page reload
        })
        .catch(function (error) {
            toggle(false)
            let errorMessage = error.response.data.message;
            modal.hide();
            showAlert(errorMessage, 'danger');
        });
});

// Handle registration event
document.getElementById("register").addEventListener("click", (event) => {
    event.preventDefault();
    let name = document.getElementById("name-register").value;
    let userName = document.getElementById("username-register").value;
    let passWord = document.getElementById("password-register").value;
    let imageInput = document.getElementById("image-register").files;
    let image = imageInput[0];
    let formData = new FormData();
    formData.append("name", name);
    formData.append("username", userName);
    formData.append("password", passWord);
    formData.append("image", image);
    const headers = { 'Content-Type': 'multipart/form-data' };
    toggle(true)
    axios.post(`https://tarmeezacademy.com/api/v1/register`, formData, { "headers": headers })
        .then(function (response) {
            toggle(false)
            let token = response.data.token;
            let user = response.data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            // Set alert message and type in localStorage
            localStorage.setItem("alertMessage", 'New User Registered Successfully');
            localStorage.setItem("alertType", 'success');
            localStorage.setItem("reloadIndex", 'true'); // Set reload flag
            modal2.hide();
            setUpNavBar();
            // Show input group
            document.getElementById("input-group").style.visibility = "visible";
            document.getElementById("input-group").style.height = "auto";
            document.getElementById("input-group").style.opacity = "1";
            handleIndexReload(); // Handle page reload
        })
        .catch(function (error) {
            toggle(false)
            let errorMessage = error.response.data.message;
            modal2.hide();
            showAlert(errorMessage, 'danger');
        });
});

// Handle logout event
document.getElementById("logout-nav").addEventListener("click", () => {
   
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Set alert message and type in localStorage
    localStorage.setItem("alertMessage", 'Logged out Successfully');
    localStorage.setItem("alertType", 'success');
    localStorage.setItem("reloadIndex", 'true'); // Set reload flag
    setUpNavBar();

    // Hide input group when logging out
    document.getElementById("input-group").style.visibility = "hidden"; // Hide input group
    document.getElementById("input-group").style.height = "0"; // Optionally adjust height
    document.getElementById("input-group").style.opacity = "0"; // Optionally adjust opacit
    handleIndexReload(); // Handle page reload
});

// Function to show the alert
function showAlert(title, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    alertPlaceholder.innerHTML = '';

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        const alertElement = wrapper.firstChild;
        alertPlaceholder.append(alertElement);

        // Auto-remove the alert after 2 seconds
        return new Promise((resolve) => {
            setTimeout(() => {
                alertElement.classList.remove('show');
                setTimeout(() => {
                    alertElement.remove();
                    resolve(); // Resolve the promise after alert is removed
                }, 500);
            }, 2000);
        });
    };

    return appendAlert(title, type);
}

// Set up the navigation bar and user status
function setUpNavBar() {
    let token = localStorage.getItem("token");
    if (token != null) {
        document.getElementsByClassName("buttons")[0].style.display = "none";
        document.getElementsByClassName("buttons")[1].style.display = "block";
        if (window.location.pathname.endsWith("index.html")) {
            document.getElementById("add-post").style.visibility = "visible";
        }
        getUser();
    } else {
        document.getElementsByClassName("buttons")[0].style.display = "block";
        document.getElementsByClassName("buttons")[1].style.display = "none";
    }

    handleIndexReload(); // Handle page reload when needed
}

// Handle page reload and show alert
async function handleIndexReload() {
    if (window.location.pathname.endsWith("postDetail.html")) {
        if (localStorage.getItem("reloadIndex") === 'true') {
            axios.get('index.html').then(() => {
                localStorage.removeItem("reloadIndex"); // Clear reload flag
            });
        }
    } else if (window.location.pathname.endsWith("index.html")) {
        if (localStorage.getItem("reloadIndex") === 'true') {
            await showStoredAlert(); // Show stored alert before reload
            location.reload(); // Reload page
            localStorage.removeItem("reloadIndex"); // Clear reload flag
        } else {
            // Show stored alert after page load
            showStoredAlert();
        }
    } else {
        // Show alert after page load if exists in localStorage
        showStoredAlert();
    }
}

// Show stored alert after page reload
async function showStoredAlert() {
    const message = localStorage.getItem('alertMessage');
    const type = localStorage.getItem('alertType');
    if (message && type) {
        await showAlert(message, type); // Show alert and wait for it to finish
        localStorage.removeItem('alertMessage'); // Clear alert message from storage
        localStorage.removeItem('alertType'); // Clear alert type from storage
    }
}

document.getElementById("profileLink").addEventListener("click",function(){
    let user = JSON.parse(localStorage.getItem("user"))
    if(user){
        let id = user.id
        localStorage.setItem("id",id) 
    }
    
})

function toggle(display = true){
    if(display){
        document.getElementById("loader").style.visibility = "visible"
    }else {
         document.getElementById("loader").style.visibility = "hidden"
    }

}