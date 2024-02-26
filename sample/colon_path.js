const morgan = require("morgan");

const express = require('express');
const app = express();

app.get('/:type', (req, res)=> {
    let {type} = req.params;

    res.send(type);
});

app.get('/:type/:type2', (req, res)=> {
    // js 구조분해할당 문법 참고
    let {type, type2} = req.params;

    let types = req.params;

    res.send(type);
});

app.listen(8080);

// 라우트 파라미터
// URI의 콜론(:) 뒤에 오는 path
// 들어온 변수는 req.params에 저장
