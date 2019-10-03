
## 프로그램 개발 환경 만들기
    1 nvm 설치 : nodejs의 버전을 관리해주는 프로그램
        > curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
        - 설치후, nvm 명령어를 찾을 수 없다는 에러가 나오면
            Note: On OS X, if you get nvm: command not found after running the install script, one of the following might be the reason:-
                * your system may not have a [.bash_profile file] where the command is set up. Simply create one with touch ~/.bash_profile and run the install script again
                * you might need to restart your terminal instance. Try opening a new tab/window in your terminal and retry.
        - 참조 사이트 : https://github.com/nvm-sh/nvm

    2 nvm을 이용해서 nodejs 설치
        _> nvm ls-remote
        _> nvm install v12.10.0
        _> nvm alias default v12.10.0
        _> nvm use default

    3 yarn 설치 : npm으로 yarn을 설치하고, npm모듈들을 yarn을 사용해서 관리함
        _> npm install -g yarn

## 폴더 구조
    1 app.js : 웹서버의 프로그램의 시작 코드
    2 bin
        1 www : 웹서버를 실행하는 코드 (기본적으로 3000포트로 실행)
    3 config
        1 jungle.json : jungle testnet의 설정 정보
        2 test.json : unit test를 하기 위한 설정 정보
    4 routes
        api
            address : address의 http request를 위한 route
    5 libs
        address.js : address의 CRUD를 실제로 처리하는 코드
        error.js : 에러를 정의
        log.js : 로그 파일을 처리하기 위한 코드
    6 contract
        addressbook : addressbook contract를 빌드의 결과 파일 (abi, wasm)
    7 files
        jungle : jungle testnet에서 사용할 계정 및 주소록 정보
            - account.json : jungle testnet에 생성한 계정의 private, and public key
            - upsert.json : 업데이트 혹은 추가할 주소록 정보
    8 external_apis
        - eos_api : eos chain과 rpc통신을 하기 위한 코드

## 실행
    ### contract 배포
        1 npm 모듈 설치 : package 설치는 npm 대신에 yarn을 사용함.
            _> yarn
        2 buyram bytes : contract를 deploy하기 전에 충분히 RAM을 구매 해 야 함.
            _> npm run toolsj -- -c buyram -b 119200
        3 contract deploy : 한번 deploy를 하게 되면, contract파일이 변경된 경우에만, deploy가 가능함.
            _> npm run toolsj -- -c deploy

    ### 웹서버 실행
        _> npm run startj

    ### Http 요청
        create
            uri : /api/1/users/address
            method : POST
            req :
            {
                "user" : key로 사용되기 때문에, a-z.12345의 만 사용이가능하고 최대 12자까지만 가능
                "first_name": 이름
                "last_name" : 성
                "street": 주소
                "city" : 도시
            }
            res : trx
            ex)
                _> curl -X POST -H "Content-Type: application/json" --data '{ "user" : "alice", "first_name": "Alice", "last_name" : "Williams", "street": "402, Hakdong-ro, Gangnam-gu", "city" : "SEOUL"}' http://localhost:3000/api/1/users/address

        get
            uri : /api/1/users/{name}/address
            params
                name : 주소록의 user 값
            method : GET
            res
                address
            ex)
                _> curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/1/users/alice/address

        gets
            uri : /api/1/users/addresses
            method : GET
            res
                addresses
            ex)
                _> curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/1/users/addresses

        update
            uri : /api/1/users/{name}/address
            params
                name : 주소록의 user 값
            method : PUT
            req :
            {
                "user" : key로 사용되기 때문에, a-z.12345의 만 사용이가능하고 최대 12자까지만 가능
                "first_name": 이름
                "last_name" : 성
                "street": 주소
                "city" : 도시
            }
            res : trx
            ex)
                _> curl -X PUT -H "Content-Type: application/json" --data '{ "user" : "alice", "first_name": "Alice2", "last_name" : "Williams2", "street": "402, Hakdong-ro, Gangnam-gu 2", "city" : "SEOUL2"}' http://localhost:3000/api/1/users/alice/address

        erase
            uri : /api/1/users/{name}/address
            params
                name : 주소록의 user 값
            method : DELETE
            res
                trx
            ex)
                _> curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/api/1/users/alice/address

## BlockChain에서 확인 방법
    1  아래의 사이트에서 계정명을 입력
        https://jungle.bloks.io/
    2 위의 사이트에서 계정에 대한 table정보를 확인해 볼 수 있음.
        https://jungle.bloks.io/contract?tab=Tables&account=testaddr111a&scope=testaddr111a&limit=100&table=contacts


