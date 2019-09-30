
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
    1 index.js : 프로그램의 시작 코드
    2 config
        1 jungle.json : jungle testnet의 접속 정보
    3 contract
        1 addressbook : addressbook contract를 빌드의 결과 파일 (abi, wasm)
    4 files
        1 jungle : jungle testnet에서 사용할 계정 및 주소록 정보
            - account.json : jungle testnet에 생성한 계정의 private, and public key
            - upsert.json : 업데이트 혹은 추가할 주소록 정보
            - erase.json : 지울 주소록 정보
    4 external_apis
        - eos_api : eos chain과 rpc통신을 하기 위한 코드

## 실행
    1 npm 모듈 설치 : package 설치는 npm 대신에 yarn을 사용함.
        _> yarn
    2 contract deploy : 한번 deploy를 하게 되면, contract파일이 변경된 경우에만 deploy가 가능함.
        _> npm run startj -- -c deploy

    3 주소록 정보, 업데이트 또는 추가
        _> npm run startj -- -c upserts

    4 주소록 정보 삭제
        _> npm run startj -- -c erases

    5 주소록 정보 요청 : junglenet에서는 값을 불러 오지 못하고 있음
        _> npm run startj -- -c address -n <계정명>
        _> npm run startj -- -c address -n testuser111a



