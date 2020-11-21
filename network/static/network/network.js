const postsTemplate = `<div onclick="show_post({{id}});return false;" value= "{{id}}" class="list-group-item list-group-item-action flex-column align-items-start">
                              <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">{{user}}</h5>
                                <small>{{time}}</small> 
                              </div>
                              <p class="mb-1">{{text}}</p>
                              <small id='like-{{id}}' value={{likes}}>Likes:{{likes}}</small>
                        </div>
                        <div class="list-group-item list-group-item flex-column align-items-end">
                              <div class="col-1 align-self-end"><button id="like-button" onclick="like_post({{id}}); return false;" class="btn btn-block btn-primary" ><i class="fa fa-thumbs-up">Like</i> </button> </div>
                        </div><br>`;

const singlePostTemplate = `
                                <div class="d-flex w-100 justify-content-between">
                                <a href='' onclick= "show_profile('{{user}}'); return false;" ><h5 class="mb-1">{{user}}</h5></a>
                                  <small>{{time}}</small>
                                </div>
                                <div class="d-flex w-100 justify-content-between">
                                <p class="mb-1" id='single-post-text' >{{text}}</p>
                                <small>Likes:{{likes}}</small>
                                </div>                                
                            `;

const profilePageTemplate = `<h1 class="display-4">{{user}}</h1>
                            <p class="lead" id="followers-following">Followers: {{followers}}   Following: {{following}}</p>
                            <hr class="my-4">
                            <p>This would be my bio... if I had one</p>
                            <p class="lead">
                            <a class="btn btn-primary btn-lg" id="follow-button" href="#" onclick="follow('{{user}}'); return false;" role="button">{{followUnfollow}}</a>
                            </p>`

const commentTemplate = `   <div href="#" class="list-group-item flex-column align-items-start">
                              <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1"><strong>{{user}}</strong></h5>
                                <small>{{timestamp}}</small>
                              </div>
                              <p class="mb-1">{{text}}</p>
                            </div>
                        `
const deleteButtonTemplate = `<button onclick= "delete_post(); load_all_posts();"type="button" id="delete-post" class="btn btn-danger" value={{id}}>Delete Post</button>`
//<button onclick= "edit_post()"type="button" id="edit-post" class="btn btn-light" value={{id}}>Edit Post</button>

const editButtonTemplate = `
<nav id='navbar' class="navbar navbar-expand-lg navbar-light bg-light" value="{{ user.username }}">
<button type="button" id="edit-post" value={{id}} type="button" data-toggle="collapse" data-target="#editPost" >
    <span class="btn btn-light">Edit Post</span>
</button>

<div class="collapse" id="editPost">
  <ul class="navbar-nav">
        <li class="nav-item">
            <form id="post-form" onsubmit="edit_post({{id}});;return false;">
                   
                    <div class="form-group" >
                      <label for="exampleFormControlTextarea1">Submit Edit</label>
                      <textarea class="form-control" id="edit-text" rows="3"></textarea>
                    </div>
                <input id="edit-button" name="edit" type="submit" class="btn btn-primary" value="Submit Edit">
            </form>
        </li>
  </ul>
</div>
</nav>                            
`

const paginationTemplate = `<a class="page-link" name="paginate-element" href="#" id="{{paginateElement}}" onclick="paginate({{paginateElement}},{{numOfPages}});window.scrollTo(0, 0); return false;">{{paginateElement}}</a>`;

document.addEventListener('DOMContentLoaded', function() {
    //document.querySelector('#all-posts-nav').addEventListener('click',() => load_all_posts);
    //document.querySelector('#post-button').addEventListener('click', load_all_posts);
    load_all_posts();
    document.getElementById('following-nav-button').addEventListener('click', load_following);

    const allPosts = document.querySelector('#all-posts');
    const indivPosts = allPosts.querySelectorAll('div')
    document.querySelector('#profile-page').style.display = 'none';
    
});


function load_all_posts() {
    document.querySelector('#all-posts').innerHTML='';
    fetch('/all')
    .then(response => response.json())
    
    .then(posts => {
               
        let x = 0
       
        posts.forEach(function(p){
            
            let newContent = document.createElement("div");
            newContent.setAttribute("name",'user-post');
            newContent.setAttribute("id",`user-posts-${x}`)
            newContent.setAttribute("class", "list-group")
            const templateFunction = Handlebars.compile(postsTemplate);
            newContent.innerHTML = templateFunction({ text: p.text, user: p.user, likes: p.likes, comments:p.comments, time: p.time, id: p.id });;
            let post = document.getElementById('all-posts');
            post.appendChild(newContent);
            x +=1
            
                    
        })
        
        let numberOfPosts = document.getElementsByName('user-post').length
        let numberOfPages = Math.trunc((numberOfPosts/10) + .9)
        
        //'pn' = pagenumber , it tells us what page number of the pagination we are on
        pn = 1;

        const paginateContainer = document.getElementById('pagination');
        paginateContainer.innerHTML = '';
        const paginationTemplateFunction = Handlebars.compile(paginationTemplate);
        
        while(pn <= numberOfPages){
            let newPage = document.createElement("li");
            newPage.setAttribute("class", "page-item");
            newPage.innerHTML = paginationTemplateFunction({ paginateElement: pn, numOfPages: numberOfPages });                                    
            paginateContainer.appendChild(newPage);
            pn +=1;
        }
        paginate(1,numberOfPages);

        document.querySelector('#show-post').style.display = 'none';
        document.querySelector('#all-posts').style.display = 'block';
        document.querySelector('#post-form').style.display = 'block';
        document.querySelector('#pagination').style.display = 'flex';
        document.getElementById('currently-following-posts').style.display = 'none';
    });    
}


function edit_post(id) {
    let newPostText =  document.getElementById('edit-text').value;
    
    fetch(`http://127.0.0.1:8000/edit_post/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            text: newPostText
        })
    })
    document.getElementById('single-post-text').innerHTML = newPostText;
    
    return false;
}

function submit_comment_form(id) { 
    
    create_comment(id);
    
    return false;
}

function create_post(){
   
    let postText = document.getElementById('post-text')
    fetch(`http://127.0.0.1:8000/create_post`, {
        method: 'POST',
        body: JSON.stringify({
            text: postText.value
        })
    })
    .then(response => response.json())
    .then(message => {
        clear_post();
        
        
        load_all_posts();
        postText.value = '';
    })
    return false;
}

function show_post(id){
    fetch(`http://127.0.0.1:8000/show_post/${id}`)
    .then(response => response.json())
    .then(posts => {

        let commentForm = document.getElementById('comment-form');
        commentForm.setAttribute("onsubmit",`submit_comment_form(${id});clear_post(); show_post(${id});return false;`)

        const comments = posts[0].comments
       
        
        posts.forEach(function(p){
            //clears previous individual post
            let post = document.getElementById('individual-post');
            post.innerHTML = '';

            let commentSection = document.getElementById('comment-section');
            commentSection.innerHTML = '';
            //displays post
            
            let newContent = document.createElement("div");
            newContent.setAttribute("class","list-group-item list-group-item-action flex-column align-items-start")
            const templateFunction = Handlebars.compile(singlePostTemplate);
            newContent.innerHTML = templateFunction({ text: p.text, user: p.user, likes: p.likes, comments:p.comments, time: p.time, id: p.id });
            
            //if user is owner displays delete button and edit button        
            const currentUser = p.currentUser
             
            if (currentUser === p.user){
                let deleteDiv = document.createElement("div");

                const deleteButtonFunction = Handlebars.compile(deleteButtonTemplate);
                deleteDiv.innerHTML = deleteButtonFunction({id: p.id});
                newContent.append(deleteDiv);

                let editDiv = document.createElement("div");
        
                const editButtonFunction = Handlebars.compile(editButtonTemplate);
                editDiv.innerHTML = editButtonFunction({id: p.id});
                newContent.append(editDiv);
            }

            
            post.appendChild(newContent);
            
            //displays comments
            comments.forEach(function(c){
                let newComment = document.createElement("div");
                newComment.setAttribute("class","list-group")
                const commentTemplateFunction = Handlebars.compile(commentTemplate);
                newComment.innerHTML = commentTemplateFunction({ text: c.text, user: c.user});
                
                commentSection.appendChild(newComment);
                

            })


        })
    });
    document.querySelector('#show-post').style.display = 'block';
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#post-form').style.display = 'none';
    document.querySelector('#pagination').style.display = 'none';
    document.getElementById('currently-following-posts').style.display = 'none';

    
    
}

function like_post(id){
    fetch(`http://127.0.0.1:8000/like_post/${id}`)
    .then(response => response.json())
    .then(posts => {
        document.getElementById(`like-${id}`).innerHTML = `Likes: ${posts[0].likes}`;
           
    });

}

function show_profile(user) {
    fetch(`/profile/${user}`)
    .then(response => response.json())
    
    .then(data => {
        //document.querySelector('#all-posts').innerHTML = '';       
        

        const userPosts = data.posts
        let post = document.getElementById('all-posts');
        post.innerHTML = '';
        let profileContainer = document.getElementById('profile-page')
        
        const templateFunction = Handlebars.compile(profilePageTemplate);
        profileContainer.innerHTML = templateFunction({ text: userPosts.text, user: user, likes: userPosts.likes, comments:userPosts.comments, time: userPosts.time, id: userPosts.id, followers: data.followers, following: data.following, followUnfollow: data.followUnfollow });
        
        
        if (data.currentUser === user){
            let element = document.getElementById('follow-button');
            element.parentNode.removeChild(element);                    
        }

        
        
        
        userPosts.forEach(function(p){
            let newContent = document.createElement("div");
            newContent.setAttribute("name","user-posts");
            newContent.setAttribute("class", "list-group")
            const templateFunction = Handlebars.compile(postsTemplate);
            newContent.innerHTML = templateFunction({ text: p.text, user: p.user, likes: p.likes, comments:p.comments, time: p.time, id: p.id, followers: data.followers, following: data.following });
            post.appendChild(newContent);        
        })
    });
    
    document.querySelector('#show-post').style.display = 'none';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#post-form').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'block';
    document.getElementById('currently-following-posts').style.display = 'none';
}

function follow(user){
    
    fetch(`http://127.0.0.1:8000/follow/${user}`)
    .then(response => response.json())
    .then(follow => {
        
        console.log(follow)
        let buttonVal = document.querySelector('#follow-button').innerHTML;
        document.querySelector('#followers-following').innerHTML = `Followers: ${follow.followers} Following: ${follow.following}`
        if (buttonVal == 'Unfollow'){
            document.querySelector('#follow-button').innerHTML = 'Follow';
        }
        else{
            document.querySelector('#follow-button').innerHTML = 'Unfollow';
        }        
    })
}

function create_comment(id){
    
    fetch(`http://127.0.0.1:8000/create_comment/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            text: document.getElementById('comment-text').value
        })
    })
    .then(response => response.json())
    .then(comment => {
        let commentSection = document.getElementById('comment-section');
        let newComment = document.createElement("div");
        newComment.setAttribute("class","list-group")
        const commentTemplateFunction = Handlebars.compile(commentTemplate);
        newComment.innerHTML = commentTemplateFunction({ text: comment.text, user: comment.user});
        
        commentSection.prepend(newComment);
    
    })
    
    
}

function delete_post(){
    
    fetch(`http://127.0.0.1:8000/delete_post`, {
        method: 'POST',
        body: JSON.stringify({
            postID: document.getElementById('delete-post').value
        })
    })
    
}

function clear_post(){
    clear = document.getElementById('individual-post');
    clear.innerHTML = '';
    return false;
}

function paginate(pageNumber, numberOfPages){
    
    let upperBound = (pageNumber*10) - 1
    let numberOfPosts = document.getElementsByName('user-post').length
    let lowerBound = (upperBound) - 9
    
    let postsContainer = document.getElementsByName(`user-post`)
        
    postsContainer.forEach(function(p,c){
        
        if (c < upperBound && c >= lowerBound ){
            p.style.display = 'block';
            
        }
        else{
            p.style.display = 'none';
        }                
    })
}


function load_following(){
    fetch(`http://127.0.0.1:8000/following_posts`)
    .then(response => response.json())
    
    .then(posts => {
        
        let x = 0
        document.getElementById('currently-following-posts').innerHTML = '';
        posts.forEach(function(p){
        
            let newContent = document.createElement("div");
            newContent.setAttribute("name",'following-post');
            newContent.setAttribute("id",`user-posts-${x}`)
            newContent.setAttribute("class", "list-group")
            const templateFunction = Handlebars.compile(postsTemplate);
            newContent.innerHTML = templateFunction({ text: p.text, user: p.user, likes: p.likes, comments:p.comments, time: p.time, id: p.id });;
            let post = document.getElementById('currently-following-posts');
            post.appendChild(newContent);
            x +=1
            
                    
        })
        
        let numberOfPosts = document.getElementsByName('following-post').length
        let numberOfPages = Math.trunc((numberOfPosts/10) + .9)
        
        //'pn' = pagenumber , it tells us what page number of the pagination we are on
        pn = 1;

        const paginateContainer = document.getElementById('pagination');
        paginateContainer.innerHTML = '';
        const paginationTemplateFunction = Handlebars.compile(paginationTemplate);
        
        while(pn <= numberOfPages){
            let newPage = document.createElement("li");
            newPage.setAttribute("class", "page-item");
            newPage.innerHTML = paginationTemplateFunction({ paginateElement: pn, numOfPages: numberOfPages });                                    
            paginateContainer.appendChild(newPage);
            pn +=1;
        }
        paginate(1,numberOfPages);

        document.getElementById('currently-following-posts').style.display = 'block';
        document.querySelector('#show-post').style.display = 'none';
        document.querySelector('#all-posts').style.display = 'none';
        document.querySelector('#post-form').style.display = 'block';
        document.querySelector('#pagination').style.display = 'block';
        document.querySelector('#profile-page').style.display = 'none';

        document.querySelector('#all-posts').innerHTML = '';
    });
}