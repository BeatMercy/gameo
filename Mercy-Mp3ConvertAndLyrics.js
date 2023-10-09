// 提供批量更名能力
// 提供批量音频转换mp3能力

const fsPromise = require('fs/promises')
const fs = require('fs')
const { exec } = require('node:child_process');
const { exit } = require('process');
const http = require("http")

// const { debounce } = require('./MercyNodejsUtils')



const args = process.argv
const curPath = __dirname
console.log(curPath)

const exitWhenFinish = debounce(() => {
    console.log('');
    console.log('----------------------bye----------------------');
    exit()
}, 5000)

/**
 * arg0 node
 * arg1 script name
 * arg2 sript args
 * arg3 filename regex
 */
if (args[2] == 'convert') {
    scanFiles(curPath, (songFileName) => {
        const suffixStart = songFileName.lastIndexOf('.');
        const songName = curPath + '\\' + songFileName.substring(0, suffixStart)
        const suffix = songFileName.substring(suffixStart + 1)
        if (['m4a', 'flac', 'wav'].indexOf(suffix) == -1) {
            return;
        }
        exec(`ffmpeg -i "${songName}.${suffix}" -ab 128k -map_metadata 0 -id3v2_version 3 "${songName}.mp3"`)
        console.log(songName, 'success')
        exitWhenFinish();
    });
} else if (args[2] == 'lyrics') {
    scanFiles(curPath, (songFileName) => {
        const suffixStart = songFileName.lastIndexOf('.');
        const songName = curPath + '\\' + songFileName.substring(0, suffixStart)
        const suffix = songFileName.substring(suffixStart + 1)

        if (['m4a', 'flac', 'wav', 'mp3'].indexOf(suffix) == -1) {
            return;
        }

        let setLyrics = (lyricsContent) => {
            let cmd;
            if (lyricsContent) {
                cmd = `ffmpeg -i "${songName}.${suffix}" -ab 128k -metadata lyrics-="${lyricsContent}"  -metadata lyrics="" -map_metadata 0 -id3v2_version 3 "${songName}.mp3"`
                console.log(songName, 'convert with lyrics')
            } else {
                cmd = `ffmpeg -i "${songName}.${suffix}" -ab 128k -metadata -metadata lyrics="" -map_metadata 0 -id3v2_version 3 "${songName}.mp3"`
                console.log(songName, 'convert with NO lyrics')
            }
            exec(cmd, { 'shell': 'powershell.exe' }) // 使用powershell运行命令，解决歌词换行导致命令不可正确执行问题
            exitWhenFinish();
        }

        getSongTags(songFileName).then(tags => {
            let durationMill = tags.duration * 1000;
            console.log(tags.title, tags.artist, durationMill)
            getSyncedLyricsFromKugou(tags.title, tags.artist, durationMill)
                .then(setLyrics)
                .catch(() => {
                    getSyncedLyricsFrom163(tags.title, tags.artist, durationMill)
                        .then(setLyrics)
                        .catch(() => {
                            // no lyrics internet, use spotify inner
                            if (tags.lyrics) {
                                setLyrics(tags.lyrics)
                            }
                        })
                })
        })
    })

}
// -----------------------------End----------------------------------------


// -----------------------------Function Definition----------------------------------------
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function scanFiles(scanPath, handleFileFunc) {
    fsPromise.readdir(scanPath)
        .then(infos => {
            console.log(infos)
            infos.forEach(songFileName => {
                var result = fs.statSync(scanPath + '\\' + songFileName)
                if (result.isDirectory() && songFileName.lastIndexOf('.') == -1) {
                    return;
                } else if (args[3] && !new RegExp(args[3]).test(songFileName)) {
                    return;// 该文件，不符合正则范围
                }
                handleFileFunc(songFileName)
            })
        })
}

function getSongTags(songFilename) {
    return new Promise((reslove) => {
        getJsonMetadata(songFilename).then((metadata) => {
            let songTags;
            if (metadata && metadata.format && metadata.format.tags) {
                songTags = metadata.format.tags
                songTags.filename = metadata.format.filename
                songTags.duration = metadata.format.duration
                songTags.bit_rate = metadata.format.bit_rate
            }
            reslove(songTags)
        })
    })
}


function getJsonMetadata(songFilename) {
    return new Promise((reslove, reject) => {
        let probeCmdb = `ffprobe -loglevel error -print_format json -show_format "${songFilename}"`
        exec(probeCmdb, (err, stdout, stderr) => {
            let metadata = JSON.parse(stdout)
            // { format: tags: { lyrics: 'xxxxxxxxx' } }
            reslove(metadata)
        })
    })
}

function responseReslover(res) {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`);
    }
    //  else if (!/^application\/json/.test(contentType)) {
    //     error = new Error('Invalid content-type.\n' +
    //         `Expected application/json but received ${contentType}`);
    // }
    // if (error) {
    //     console.error(error.message);
    //     // Consume response data to free up memory
    //     res.resume();
    //     return;
    // }

    return new Promise((reslove, reject) => {

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                // console.log(parsedData);
                reslove(parsedData);
            } catch (e) {
                console.error(e.message);
                reject(e.message)
            }
        });
    })

}

function getSyncedLyricsFromKugou(songtitle, songArtist, songDuration) {
    // https://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword=OFFICIAL%20HIGE%20DANDISM%20-%20%E6%97%A5%E5%B8%B8
    // https://lyrics.kugou.com/download?fmt=lrc&charset=utf8&client=pc&ver=1&id=165206998&accesskey=729B622FC551524DE578932760493E5A
    return new Promise((reslove, reject) => {
        let searchKeyword = `${songtitle} - ${songArtist}`;
        let search = `ver=1&man=yes&client=pc&keyword=${searchKeyword}`;
        if (songDuration) {
            search += `&duration=${songDuration}`
        }
        let searchUrl = `http://lyrics.kugou.com:80/search?${search}`;
        console.log('kugou search url:', searchUrl)
        http.get(searchUrl, (res) => {
            responseReslover(res).then(results => {
                if (!results.candidates || results.candidates.length == 0) {
                    reject('kugou empty candidates')
                    return;
                }
                const songIdKugou = results.candidates[0].id;
                const songAkKugou = results.candidates[0].accesskey;
                let downloadUrl = `http://lyrics.kugou.com:80/download?fmt=lrc&charset=utf8&client=pc&ver=1&id=${songIdKugou}&accesskey=${songIdKugou}`;
                http.get(downloadUrl, (downResponse) => {
                    responseReslover(downResponse).then((downResult) => {
                        if (!downResult.content) {
                            reject('kugou empty lyric')
                            return;
                        }
                        console.log('kugou retrieve song ' + searchKeyword + ' lyrics success')
                        dataURLtoFile(downResult.content).text().then(ly => {
                            reslove(ly)
                        })
                    })
                })
            })
        }).on('error', e => {
            console.error(`Got error: ${e.message}`)
            reject(e)
        });
    })
}
function getSyncedLyricsFrom163(songtitle, songArtist, songDuration) {
    // http://music.163.com:80/api/search/get?offset=0&limit=1&type=1&s=Yuuri-%E8%8A%B1%E9%B3%A5%E9%A2%A8%E6%9C%88
    // http://music.163.com:80/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id=1905070117
    return new Promise((reslove, reject) => {
        let searchKeyword = `${songArtist}-${songtitle}`;
        let search = `offset=0&limit=5&type=1&s=${searchKeyword}`;
        if (songDuration) {
            search += `&duration=${songDuration}`
        }
        let searchUrl = `http://music.163.com:80/api/search/get?${search}`;
        console.log('163 search url:', searchUrl)
        http.get(searchUrl, (res) => {
            responseReslover(res).then(results => {
                if (!results.result || !results.result.songs || results.result.songs.length == 0) {
                    reject('163 empty candidates')
                    return;
                }
                const songId163 = results.result.songs[0].id;
                let downloadUrl = `http://music.163.com:80/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id=${songId163}`;
                http.get(downloadUrl, (downResponse) => {
                    responseReslover(downResponse).then((downResult) => {
                        if (!downResult.lrc || !downResult.lrc.lyric) {
                            reject('163 empty lyric')
                            return;
                        }
                        console.log('163 retrieve song ' + searchKeyword + ' lyrics success')
                        reslove(downResult.lrc.lyric)
                    })
                })
            })
        }).on('error', e => {
            console.error(`Got error: ${e.message}`)
            reject(e)
        });
    })
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}