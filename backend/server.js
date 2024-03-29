const express = require('express')
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const http = require('http');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const port = 4000;

var cors = require('cors');
app.use(cors());

var storage = multer.diskStorage(
    {
        destination: './data/uploads/',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);
var upload = multer({ storage: storage })   //destination of files
// var upload = multer({ dest: 'uploads/' })   //destination of files

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/upload/:id', upload.single('movie'), function (req, res, next) {   //movie is the name of <input>
    console.log(req.file, req.body);
    console.log(req.params.id);


    ffmpeg.setFfmpegPath(ffmpegInstaller.path);

    var dir = "data/movie/480p/" + req.params.id;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
    }

    var dir = "data/movie/1080p/" + req.params.id;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
    }

    var dir = "data/movie/4k/" + req.params.id;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
    }

    console.log("Start Transcoding...");

    //480p
    console.log("480p");

    ffmpeg('data/uploads/' + req.file.filename, { timeout: 432000 }).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls',
        '-s 852x480',
        '-aspect 852:480',
    ]).output('data/movie/480p/' + req.params.id + "/" + req.params.id + '.m3u8').on('end', () => {

        //1080p
        console.log("1080p");
        ffmpeg('data/uploads/' + req.file.filename, { timeout: 432000 }).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
            '-s 1920x1080',
            '-aspect 1920:1080',
        ]).output('data/movie/1080p/' + req.params.id + "/" + req.params.id + '.m3u8').on('end', () => {

            //4k
            console.log("4k");
            ffmpeg('data/uploads/' + req.file.filename, { timeout: 432000 }).addOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls',
                '-s 3840x2160',
                '-aspect 3840:2160',
            ]).output('data/movie/4k/' + req.params.id + "/" + req.params.id + '.m3u8').on('end', () => {

                console.log("End of Transcoding.");
                res.sendStatus(200);    //success message

            }).run();

        }).run();

    }).run();

});

app.post('/uploadSeries/:id/:ep', upload.single('series'), function (req, res, next) {   //series is the name of <input>
    console.log(req.file, req.body);
    console.log(req.params.id, req.params.ep);


    ffmpeg.setFfmpegPath(ffmpegInstaller.path);

    var dir = "data/series/480p/" + req.params.id + "/" + req.params.ep;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
    }

    var dir = "data/series/1080p/" + req.params.id + "/" + req.params.ep;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
    }

    var dir = "data/series/4k/" + req.params.id + "/" + req.params.ep;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
    }

    console.log("Start Transcoding...");

    //480p
    console.log("480p");

    ffmpeg('data/uploads/' + req.file.filename, { timeout: 432000 }).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls',
        '-s 852x480',
        '-aspect 852:480',
    ]).output('data/series/480p/' + req.params.id + "/" + req.params.ep + "/" + req.params.ep + '.m3u8').on('end', () => {

        //1080p
        console.log("1080p");
        ffmpeg('data/uploads/' + req.file.filename, { timeout: 432000 }).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
            '-s 1920x1080',
            '-aspect 1920:1080',
        ]).output('data/series/1080p/' + req.params.id + "/" + req.params.ep + "/" + req.params.ep + '.m3u8').on('end', () => {

            //4k
            console.log("4k");
            ffmpeg('data/uploads/' + req.file.filename, { timeout: 432000 }).addOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls',
                '-s 3840x2160',
                '-aspect 3840:2160',
            ]).output('data/series/4k/' + + req.params.id + "/" + req.params.ep + "/" + req.params.ep + '.m3u8').on('end', () => {

                console.log("End of Transcoding.");
                res.sendStatus(200);    //success message

            }).run();

        }).run();

    }).run();

});


app.get('/remove/:id', function (req, res) {

    console.log("Removing movie " + req.params.id);

    var dir = "data/movie/4k/" + req.params.id;

    if (fs.existsSync(dir)) {
        console.log("removing " + dir);
        fs.rmdirSync(dir, { recursive: true });
    }
    var dir = "data/movie/1080p/" + req.params.id;

    if (fs.existsSync(dir)) {
        console.log("removing " + dir);
        fs.rmdirSync(dir, { recursive: true });
    }
    var dir = "data/movie/480p/" + req.params.id;

    if (fs.existsSync(dir)) {
        console.log("removing " + dir);
        fs.rmdirSync(dir, { recursive: true });
    }

    console.log("Remove movie success");

    res.sendStatus(200);
    res.end();
});

app.use("/play", createProxyMiddleware({
    target: "http://localhost:8000/movie",
    changeOrigin: true,
    pathRewrite: {
        [`^/play`]: '',
    },
})
);

app.use("/playSeries", createProxyMiddleware({
    target: "http://localhost:8000/series",
    changeOrigin: true,
    pathRewrite: {
        [`^/playSeries`]: '',
    },
})
);

app.listen(port, () => {
    console.log("Upload server listening at http://localhost:4000")
})
//-------------------

http.createServer(function (request, response) {
    console.log(request.url + " request starting...");

    var filePath = './data/' + request.url;

    fs.readFile(filePath, function (error, content) {
        response.writeHead(200, { "Access-Control-Allow-Origin": "*" });    //permission for player
        if (error) {
            if (error.code == 'ENOENT') {
                // fs.readFile('./404.html', function (error, content) {
                //     response.end(content, 'utf-8');
                // });
            }
            else {
                response.writeHead(500);
                response.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
                response.end();
            }
        }
        else {
            response.end(content, 'utf-8');
        }
    });

}).listen(8000);
console.log("Upload server listening at http://localhost:8000");