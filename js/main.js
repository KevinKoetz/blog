const site = {
  root: null,
  main: null,
  posts: null,

  init: async function (val) {
    this.root = window.location.origin;

    //Register Event Listener for clicks
    document.body.addEventListener("click", this.clickHandler.bind(this));

    //Save main element for later
    this.main = document.getElementById("main");

    //Get all Post Names
    const response = await this.getFileFromServer("/db/posts.json");
    this.posts = JSON.parse(response)["names"];

    //Load initial Posts
    this.resolveHashRoute(window.location.hash);
  },

  resolveHashRoute: async function (hash) {
    if("" === hash || "#/" === hash){
      let posts = await this.getPosts(this.posts.slice(0, 3));
      let content = "";
      for(const post of posts) content += post;
      this.loadContent(content,this.main);
    }

    if(/#\/posts\/\d*-\d*$/.test(hash)){
      /*TODO: Implement post loading with relative index "#/posts/0-2" should load the posts with index 0,1,2 in this.posts*/
    }

    if(/^#\/posts\//.test(hash)){
      let content = await this.getPosts([hash.match(/[^\/]*$/)])[0];
      this.loadContent(content, this.main);
    }

    if(/^#\/pages\//.test(hash)){
      let content = await this.getFileFromServer(`/pages/${hash.match(/[^\/]*$/)}`);
      this.loadContent(content, this.main);
    }
    
  },

  getPosts: async function (postNames){
    const responses = [];
    for (const postName of postNames) {
      responses.push(this.getFileFromServer(`/posts/${postName}`));
    }
    return await Promise.all(responses);
  },

  /*TODO: Dont use Element.innerHTML and do some sanitization of the conent */
  loadContent: async function(content, target = this.main){
    target.innerHTML = content;
  },

  clickHandler: function (event) {
    if (event.srcElement.tagName === "A") {
      this.resolveHashRoute(event.srcElement.hash);
    }
  },

  getFileFromServer: async function (path) {
    /*TODO: Implement relative Paths like "./file" or "../folder/file" */
    /*TODO: Status Code handling*/
    let url = null;
    if (path.startsWith("/")) url = this.root + window.location.pathname + path;
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