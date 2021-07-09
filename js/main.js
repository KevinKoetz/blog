const site = {
  root: null,
  posts: null,

  init: async function () {
    this.root = window.location.href;

    //Get all Post Names
    const response = await this.getFileFromServer("/db/posts.json");
    this.posts = JSON.parse(response)["names"];

    //Load initial Posts

    this.loadPosts(this.posts.slice(0,2));
  },

  /*TODO: Dont use Element.innerHTML */
  loadPosts: async function (postNames, appendPosts = false) {
    const responses = [];
    for (const postName of postNames) {
      responses.push(this.getFileFromServer(`/posts/${postName}`));
    }
    if (appendPosts) {
      const postContents = await Promise.all(responses);
      const main = document.getElementsByTagName("main")[0];
      let combinedPostContent = "";
      for (const postContent of postContents) {
        combinedPostContent += postContent;
      }
      main.innerHTML += combinedPostContent;
    } else {
      const postContents = await Promise.all(responses);
      const main = document.getElementsByTagName("main")[0];
      let combinedPostContent = "";
      for (const postContent of postContents) {
        combinedPostContent += postContent;
      }
      main.innerHTML = combinedPostContent;
    }
  },

  getFileFromServer: async function (path) {
    /*TODO: Implement relative Paths like "./file" or "../folder/file" */
    /*TODO: Status Code handling*/
    let url = null;
    if(path.startsWith("/")) url = path.replace("/", this.root);
    return await new Promise((resolve, reject) => {
      const httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = () => {
        if(httpRequest.readyState === XMLHttpRequest.DONE){
          if(httpRequest.status === 200){
            resolve(httpRequest.responseText);
          }else {
            reject(`HTTP-status: ${httpRequest.status}`)
          }
        }
      }
      httpRequest.open("GET",url);
      httpRequest.send();
    })

    
  },

  getPostNames: async function () {
    const response = await this.getFileFromServer("/db/posts.json");
    return JSON.parse(response)["names"];
  },
};

window.addEventListener("onload", site.init());
