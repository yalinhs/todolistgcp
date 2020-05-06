//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const _ = require("lodash");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://yalinhs_DB:test123@cluster0-xm11j.mongodb.net/todolistgcpDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const TodolistSchema = ({
  name: String,
});

const TodoItems = mongoose.model("Item", TodolistSchema);
const item1 = new TodoItems({
  name: "welcome to your todolist."
});
const item2 = new TodoItems({
  name: "Hit the + to add a new item."
});
const item3 = new TodoItems({
  name: "<== Hit this to delete the item."
});

const defaultItems = [item1, item2, item3];


const listSchema = {
  name: String,
  items: [TodolistSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  TodoItems.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      TodoItems.insertMany(defaultItems, function(err) {
        if (!err) {
          console.log("Successfully renew the document.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListedItems: foundItems
      });
      console.log("Successfully update the document.");
    };

  });
});


app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundLists) {
    if (!err) {
      if (!foundLists) {
        // creat new list
        const list = new List({
          name: customListName,
          items: defaultItems

        });
        list.save();
        res.redirect("/" + customListName);

      } else {
        //put in existing list
        res.render("list", {
          listTitle: foundLists.name,
          newListedItems: foundLists.items
        });

        ;
      }
    }
  });



});



app.post("/", function(req, res) {
  const itemNames = req.body.newItem;
  const listNames =req.body.list;

  const item = new TodoItems({
    name: itemNames
  });

if (listNames==="Today"){
  item.save();
  res.redirect("/");
} else{
  List.findOne({name:listNames},function(err,foundLists){
    foundLists.items.push(item);
    foundLists.save();
    res.redirect("/"+listNames);
  });
};


});


app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName==="Today"){
    TodoItems.findByIdAndRemove(checkedItem, function(err) {
      if (!err) {
        console.log("Successfully delete items.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name:listName},
      {$pull:{items:{_id:checkedItem}}},function(err,foundList){
        if(!err){
      res.redirect("/"+listName);
    }});
  };
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "work",
    newListedItems: defaultItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});


// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
});
// [END app]
