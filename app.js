const express = require("express")
const connect = require("./config/db");
const createHttpError = require("http-errors")
const mongoose = require("mongoose")
const path = require("path")
const ShortUrl = require("./models/url.model");
require("dotenv").config();


const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose
  .connect("mongodb+srv://pata_nahi:bhool_gaya@cluster0.lsvn5.mongodb.net/url-shortner?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("Error Connecting : ", error));

app.set("view engine","ejs")
app.get("/", async (req, res, next) => {
    res.render("index")
})

app.post("/", async (req, res, next) => {
    try {
        const { url } = req.body
        if (!url) {
            throw createHttpError.BadRequest("Provide a valid url  ")
        } 
        const { slug } = req.body;
        if (!slug) {
            throw createHttpError.BadRequest("Provide a valid name  ")
            
        }
        const urlExists = await ShortUrl.findOne({  $and: [{url} , {slug}]});
        console.log(urlExists);
        if (urlExists) {
            // const slugexist = await ShortUrl.findById()
            res.render("index", {
              short_url: `${urlExists.slug}`,
            //   short_url: `http://localhost:4000/${urlExists.slug}`,
            });
            // throw createHttpError.BadRequest("Name Already exists");
        }
        else {
            // console.log(req.body);
            const shortUrl = new ShortUrl({
              url: url,
              slug: slug,
            });
            // console.log(shortUrl.expireAt);
            // shortUrl.expireAt = shortUrl.expireAt + time;

            const result = await shortUrl.save()
            res.render("index", {
              short_url: `${result.slug}`
            //   short_url: `http://localhost:4000/${result.slug}`,
            });
        }
    }
    catch (error) {
        next(error)
    }
})

app.get("/:slug", async(req, res, next) =>{
   try {
        const { slug } = req.params;
        const result = await ShortUrl.findOne({ slug });
       if (!result) {
            throw createHttpError.NotFound("short url does not exist")
       }
       res.redirect(result.url)
   } catch (error) {
       next(error)
   }
})

app.use((req, res, next) => {
    next(createHttpError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.ststus || 500)
    res.render("index",{error:err.message})
})

// app.listen(4000, async (req, res) => {
//   try {
//     await connect();
//     console.log("Listening at 4000");
//   } catch (error) {
//     console.log(error.message);
//   }
// });
app.listen(process.env.PORT || 4000, () => console.log("Listining at 4000"));