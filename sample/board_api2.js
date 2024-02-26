const morgan = require('morgan');
const url = require('url');
const uuidAPIkey = require('uuid-apikey')

const express = require('express');
const app = express();

app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 테스트를 위한 API키
const key = {
    apiKey: 'RE728T7-E67MCQX-NAPTDJR-JCWX1S1',
    uuid: 'c38e2468-718f-465f-aaad-a6cb9339d0e4'
  }

// 테스트를 위한 게시글 데이터
let boardList = [];
let numOfBoard = 0;

app.get('/', (req, res) => {
    res.send('This is api.js');
});

app.get('/board', (req, res) => { 
    res.send(boardList);
});

app.post('/board', (req, res) =>{
    const board = {
        "id" : ++numOfBoard,
        "user_id" : req.body.user_id,
        "date" : new Date(),
        "title" : req.body.title,
        "content" : req.body.content
    };
    boardList.push(board);

    res.redirect('/board');
});

app.put('/board/:id', (req, res) =>{
    // req.params.id 값 찾아서 리스트에서 삭제
    const findItem = boardList.find((item) => {
        // +req.params.id 의 +는 형변환 
        // 앞의 타입과 맞춰준다.
        return item.id == +req.params.id
    })

    const idx = boardList.indexOf(findItem);
    boardList.splice(idx, 1);

    const board = {
        "id" : ++numOfBoard,
        "user_id" : req.body.user_id,
        "date" : new Date(),
        "title" : req.body.title,
        "content" : req.body.content
    };

    boardList.push(board);

    res.redirect('/board');
});

app.delete('/board/:id', (req, res) => {
    const findItem = boardList.find((item) => {
        return item.id == +req.params.id;
    });
    const idx = boardList.indexOf(findItem);
    boardList.splice(idx, 1);

    res.redirect('/board');
})

// 게시글 검색 API using uuid-key
app.get('/board/:apikey/:type', (req, res) => {
    let {type, apikey} = req.params;
    const queryData = url.parse(req.url, true).query;

    if(uuidAPIkey.isAPIKey(apikey) && uuidAPIkey.check(apikey, key.uuid)){
        if(type === 'search'){ // 키워드로 게시글 검색
            const keyword = queryData.keyword;
            const result = boardList.filter((e) => {
                return e.title.includes(keyword);
            })
            res.send(result);
        }
        else if(type === 'user'){
            const user_id = queryData.user_id;
            const result = boardList.filter((e) => {
                return e.user_id === user_id
            });
            res.send(result);
        }
        else{
            res.send('Wrong API Key');
        }
    }
})

app.listen(app.get('port'), () =>{
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
})