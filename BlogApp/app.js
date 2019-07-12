const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blogdb");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// schema
var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  content: String,
  created: {type:Date,default:Date.now},
});

var Blog = mongoose.model('blog',blogSchema);

//create a entry.

// Blog.create({
//   title: 'first blog post',
//   image: 'https://images.unsplash.com/photo-1562748544-8ac6ae0ece03?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
//   content:'cool blog is here',
// },function(err,blogpost){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(blogpost);
//   }
// });



//index route         - GET
//new                 - GET
//create              - POST
//show    /*/:id      - GET
//edit    /*/:id/edit -GET
//update  /*/:id      -PUT ?_method=PUT
//destroy  /*/:id     - DELETE ?_method=DELETE
//starting server at port 8000.

//index route         - GET
app.get("/",function(req,res){
  res.redirect("/blog");
});
app.get("/blog",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log(err);
    }else{
        res.render("index",{blogs:blogs});
    }
  })

});


//new                 - GET
app.get("/blog/new/",function(req,res){
  res.render("new");
})


//create              -POST
app.post("/blog",function(req,res){
  Blog.create(req.body.blog,function(err,data){
    if(err){
      console.log(err);
    }else{
      console.log(data);
      res.redirect("/");
    }
  })
});


//show route
app.get("/blog/:id",function(req,res){
  Blog.findById(req.params.id,function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render("show",{blog:data});
    }
  })
  // res.render("show");
})


//edit route
app.get("/blog/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,blog){
    if(err){
      res.redirect("/blog");
    }else{

      res.render("edit",{blog:blog});
    }
  })

})


//update route
app.put("/blog/:id",function(req,res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,data){
    if(err){
      console.log(err);

    }
    else{
      console.log(data);
      console.log("updated");
      res.redirect("/blog/"+data.id);
    }
  })
})

app.get("/blog/:id/delete",function(req,res){
  Blog.findById(req.params.id,function(err,blog){
    if(err){
      res.redirect("/blog");
    }else{

      res.render("delete",{blog:blog});
    }
  })
      // res.render("delete");
})

app.delete("/blog/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err,data){
    if(err){
      res.redirect("/blog/"+data.id);
    }else{
      res.redirect("/blog");
    }
  })
})


//listening on server port 8000;
app.listen(8000,function(){
  console.log("blog server has started running at port 8000");
});
