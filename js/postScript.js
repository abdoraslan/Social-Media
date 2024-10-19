let id = localStorage.getItem("id");
function getPost(id) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then(function (response) {
            toggle(false)
            // Handle success
            let post = response.data.data;
            let comments = response.data.data.comments;
            let postTitle = post.title || ""; // Simplified title assignment
            let commentContent = "";
            for (let comment of comments) { // Use 'let' here
                commentContent += `
                    <div class="p-3 border border-dark-subtle rounded">
                        <div class="person-info">
                            <img src="${comment.author.profile_image}" alt="">
                            <b>${comment.author.username}</b>
                        </div>
                        <div class="pt-2">
                            ${comment.body}
                        </div>    
                    </div>`;
            }

            let content = `<div id="post"  class="card shadow mb-5 mt-5">
                <div class="card-header">
                    <img  src="${post.author.profile_image}" alt="">
                    <b>@${post.author.username}</b>
                </div>
                <div class="card-body pb-0" style="cursor: auto;">
                    <img src="${post.image}" alt="">
                    <h6>${post.created_at}</h6>
                    <h5>${postTitle}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <i class="fa-regular fa-comment"></i>
                        <span>(${post.comments_count}) Comments</span>
                    </div>
                    <hr>
                </div>
                <div class="comments" id="comments">
                    ${commentContent}
                </div>
                <div id="input-group" class="input-group mb-3">
                    <input id="comment-input" type="text" class="form-control" placeholder="Add your comment.." aria-label="Add your comment.." aria-describedby="button-addon2">
                    <button onclick="makeComment()" class="btn btn-outline-primary" type="button" id="button-addon2">Send</button>
                </div>    
            </div>`;
            document.getElementById("post-details").innerHTML = `<h1>${post.author.username} Post</h1>`;
            document.getElementById("post-details").innerHTML += content;
            displayInput()
        })
        .catch(function (error) {
            toggle(false)
            // Handle error
            console.log(error);
        });
}

getPost(id);


function makeComment() {
    let comment = document.getElementById("comment-input").value.trim(); // Trim whitespace
    let token = localStorage.getItem("token"); // Corrected this line
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    toggle(true)
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, {
        "body": comment
    }, { "headers": headers })
        .then(function (response) {
            toggle(false)
            document.getElementById("comment-input").value = ""; // Clear the input field
            getPost(id)
            showAlert("The comment has been created successfully", "success")
        })
        .catch(function (error) {
            toggle(false)
            let message = error.response.data.message
            showAlert(message, "danger")
        });
}

function displayInput() {
    let token = localStorage.getItem("token");
    let inputGroup = document.getElementById("input-group");

    if (token != null) {
        inputGroup.style.visibility = "visible";
        inputGroup.style.opacity = "1";
        inputGroup.style.height = "auto"; // Ensures the input remains visible
    } else {
        inputGroup.style.visibility = "hidden";
        inputGroup.style.opacity = "0";
        inputGroup.style.height = "0"; // Collapses the height
    }
}

let user = JSON.parse(localStorage.getItem("user"));
document.getElementById("profileLink").href = user != null ? "profile.html" : "postDetails.html";

