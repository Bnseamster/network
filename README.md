# network
Using Python, JavaScript, HTML, and CSS, this app implements a social network that allows users to make posts, follow other users, and “like” posts

## Features

- **New Posts:** Users who are signed in are able to write a new post by filling in the text area and then clicking a button to submit the post.

- **All Posts:** The “All Posts” link in the navigation bar takes the user to a page where they can see all posts from all users, with the most recent posts first.
Each post should includes the username of the poster, the post content itself, the date and time at which the post was made, and the number of “likes” the post has.

- **Profile Page:** Clicking on a username loads that user’s profile page. 
  This page:
    - Displays the number of followers the user has, as well as the number of people that the user follows.
    - Displays all of the posts for that user, in reverse chronological order.
    - This page also displays a “Follow” or “Unfollow” button to logged in users.

- **Following:** “Following” in the navigation bar takes the user to a page where they see all posts made by users that the current user follows.

- **Pagination:** On any page that displays posts, up to 10 are displayed on a page at a time. If there are more than ten posts, the user can toggle between different pages with the pagination buttons at the bottom of the page.

- **Edit Post:** Users are able to edit their own post.
When a user clicks “Edit” for one of their own posts, the content of their post is be replaced with a textarea where the user can edit the content of their post.
The user is able to then save the edited post.

- **“Like” and “Unlike”:** Users are able to hit "like" on any post to toggle whether or not they “like” that post.
