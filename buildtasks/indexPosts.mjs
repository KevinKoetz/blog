import fs from "fs";
let posts = {};
posts.names = fs.readdirSync("./posts/");
fs.writeFileSync("./db/posts.json", JSON.stringify(posts));
