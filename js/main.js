const site = {
  root: null,
  main: null,
  posts: null,

  init: async function (val) {
    this.root = window.location.origin;

    //Register Event Listener for clicks
    document.body.addEventListener("click", this.clickHandler.bind(this));

    //Save main element for later
    this.main = document.getElementsByTagName("main")[0];

    //Get all Post Names
    const response = await this.getFileFromServer("./db/posts.json");
    this.posts = JSON.parse(response)["names"];

    //Load initial Posts
    if (window.location.hash === "" || window.location.hash === "#/") {
      this.loadContent(window.location.hash);
    } else {
      this.loadContent(window.location.hash);
    }
  },

  /*TODO: Dont use Element.innerHTML */
  loadPosts: async function (postNames, appendPosts = false) {
    const responses = [];
    for (const postName of postNames) {
      responses.push(this.getFileFromServer(`/posts/${postName}`));
    }
    if (appendPosts) {
      const postContents = await Promise.all(responses);
      let combinedPostContent = "";
      for (const postContent of postContents) {
        combinedPostContent += postContent;
      }
      this.main.innerHTML += combinedPostContent;
    } else {
      const postContents = await Promise.all(responses);
      let combinedPostContent = "";
      for (const postContent of postContents) {
        combinedPostContent += postContent;
      }
      this.main.innerHTML = combinedPostContent;
    }
  },

  loadContent: async function (hash) {
    const path = hash.replace(/^#/, "");
    if (path === "/" || path === "" || path === "./") {
      this.loadPosts(this.posts.slice(0, 2));
    } else {
      main.innerHTML = await this.getFileFromServer(path);
    }
  },

  clickHandler: function (event) {
    if (event.srcElement.tagName === "A") {
      this.loadContent(event.srcElement.hash);
    }
  },

  getFileFromServer: async function (path) {
    /*TODO: Implement relative Paths like "./file" or "../folder/file" */
    /*TODO: Status Code handling*/
    let url = null;
    if (path.startsWith("/")) url = this.root + path;
    if (path.startsWith("./")) url = this.root + window.location.pathname + path.replace(/^\//, "");
    return await new Promise((resolve, reject) => {
      const httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            resolve(httpRequest.responseText);
          } else {
            reject(`HTTP-status: ${httpRequest.status}`);
          }
        }
      };
      httpRequest.open("GET", url);
      httpRequest.send();
    });
  },

  getPostNames: async function () {
    const response = await this.getFileFromServer("/db/posts.json");
    return JSON.parse(response)["names"];
  },
};

window.addEventListener("load", site.init.bind(site));
