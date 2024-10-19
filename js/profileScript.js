let id = 0
let user = JSON.parse(localStorage.getItem("user"))
let userId = localStorage.getItem("id")
function userInfo(id) {
    toggle(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
        .then(function (response) {
            toggle(false)
            let user = response.data.data
            let userInfo = `  <img id="image" class="rounded-circle m-4" src="${user.profile_image}" alt="">
                <div>
                    <p>${user.email}</p>
                    <p>${user.name}</p>
                    <p>${user.username}</p>
                </div>
                <div>
                    <div>
                        <b>${user.posts_count}</b>
                        <span>Posts</span>

                    </div>
                    <hr style="margin: 0;">
                    <div>
                        <b>${user.comments_count}</b>
                        <span>Comments</span>
                    </div>
                </div>
       `
            document.getElementById("user-info").innerHTML = userInfo
            document.getElementById("username-title").innerHTML = user.username + " " + "Posts"
        })
        .catch(function (error) {
            toggle(false)
            console.log(error);
        });
}


function getUserPosts(id) {
    toggle(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
        .then(function (response) {
            toggle(false)
            // handle success
            let posts = response.data.data;
            for (post of posts) {
                    let title = post.title;
                    let body = post.body;
                    let postId = post.id
                    let postTitle = "";
                    if (post.title != null) {
                       postTitle = post.title;
                    }
                    let editButton = ""
                    let deleteButton = ""
                    if (user != null && post.author.username === user.username) {
                       editButton = `<button title="edit post"  id="edit-button" onclick="editMyPost('${title}','${body}','${postId}')" data-bs-toggle="modal" data-bs-target="#edit-post" type="button" class="rounded-circle btn btn-secondary"><i class="fa-solid fa-pen"></i></i></button>`
                       deleteButton = `<button title="delete post" id="delete-button" onclick="deleteMyPost('${postId}')" type="button" class="rounded-circle btn btn-danger"><i class="fa-solid fa-trash"></i></i></button>`
                    }
                    let content = `
            <div class="card shadow mb-5" data-post-id="${post.id}">
               <div class="card-header d-flex justify-content-between" id="card-header">
                  <div> 
                       <img class="author-profile-image" src="${post.author.profile_image}" alt="">
                       <b>@${post.author.username}</b>
                  </div>

               <div>
                    ${editButton}
                    ${deleteButton}
               </div> 
            </div>         
               <div class="card-body" onclick="postDetails(${post.id})">
                   <img src="${post.image}" alt="">
                   <h6>${post.created_at}</h6>
                   <h5 class="post-title">${post.title || ''}</h5>
                   <p class="post-body">${post.body || ''}</p>
                   <hr>
                   <div>
                       <i class="fa-regular fa-comment"></i>
                      <span>(${post.comments_count}) Comments</span>
                   </div>
               </div>
         </div>`;
                    document.getElementById("user-posts").innerHTML += content;
               }
               
        })
        .catch(function (error) {
            toggle(false)
            // handle error
            console.log(error);
        });
}

userInfo(userId)
getUserPosts(userId)

function editMyPost(title, body, postId) {
  document.getElementById("edit-title").value = title;
  document.getElementById("edit-body").value = body;
  id = postId
}


function deleteMyPost(id) {
  const userConfirmed = confirm("Do you want to delete this post?");
  let token = localStorage.getItem("token")
  if (userConfirmed) {
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    toggle(true)
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, { headers: headers })
    .then(function (response) {
        toggle(false)
            document.getElementById("user-posts").innerHTML = ""
            userInfo(userId)
            getUserPosts(userId)
            showAlert("Post deleted successfully", "success");
    })
    .catch(function (error) {
        toggle(false)
            let errorMessage = error.response.data.message;
            showAlert(errorMessage, 'danger');
    });

 }
  else {
    console.log("Post deletion canceled.");
  }
}

var modal5 = new bootstrap.Modal(document.getElementById('edit-post'));
document.getElementById("edit").addEventListener("click", function () {
let title = document.getElementById("edit-title").value;
let body = document.getElementById("edit-body").value;
let imageInput = document.getElementById("edit-image");
let token = localStorage.getItem("token");
const image = imageInput.files[0]; // Get the selected file

// Create FormData to send the image and other data
let formData = new FormData();
formData.append("title", title);
formData.append("body", body);
formData.append("image", image);
formData.append("_method", "put");

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
};
toggle(true)
axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}`, formData, { headers: headers })
    .then(function (response) {
        toggle(false)
        modal5.hide();
        // Get the updated post data from the response
        let post = response.data.data;

        // Find the specific post in the DOM by its data-post-id
        let postElement = document.querySelector(`[data-post-id="${id}"]`);
        document.getElementById("user-posts").innerHTML = ""
        userInfo(userId)
        getUserPosts(userId)
        showAlert("Post updated successfully", "success");

        if (postElement) {
            // Update the title, body, and image directly in the DOM
            postElement.querySelector(".post-title").innerText = post.title || '';
            postElement.querySelector(".post-body").innerText = post.body || '';
            postElement.querySelector(".post-image").src = post.image


            // Update the author's profile image (check if the image is available and update it)
            let authorImageElement = postElement.querySelector(".author-profile-image");
            let user = JSON.parse(localStorage.getItem("user"));
            if (authorImageElement && user && user.profile_image) {
                authorImageElement.src = user.profile_image;
            }
        }


    })
    .catch(function (error) {
        toggle(false)
        let errorMessage = error.response.data.message;
        modal5.hide();
        showAlert(errorMessage, 'danger');
    });
});

function postDetails(id) {
localStorage.setItem("id", id)
window.location.href = "postDetails.html"
}

document.getElementById("logout-nav").addEventListener("click",function(){
if(userId == user.id){
    window.location.href = "index.html"
}
})