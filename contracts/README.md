# addressbook

## Version : 1.0.0

Dependencies:
* [eosio v1.8.x](https://github.com/EOSIO/eos/releases/tag/v1.7.3)
* [eosio.cdt v1.6.x](https://github.com/EOSIO/eosio.cdt/releases/tag/v1.6.1)

## 스마트 컨트랙트 빌드 환경 만들기 (Mac OS X의 환경)
    1 brew 설치 (Mac OS X용 패키지 관리 프로그램, 개발에 필요한 프로그램들을 쉽게 설치, 업데이트, 삭제등을 할 수 있게 해줌)
        _> /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        - 참조 사이트 : https://brew.sh/index_ko

    2 boost 설치 : contract의 unittest를 위해서 설치가 필요
        - Mac OS X Brew Install
            _> brew install boost

    3 eosio 설치 : contract의 unittest와 console에서 명력을 입력하기 위해서 설치가 필요 (cleos, nodeos)
        - Mac OS X Brew Install
            _> brew tap eosio/eosio
            _> brew install eosio
        - 참조 사이트 : https://github.com/EOSIO/eos

    4 eosio.cdt 설치 : contract를 직접적으로 빌드하기 위해서 설치가 필요
        - Mac OS X Brew Install
            _> brew install eosio.cdt
        - 참조 사이트 : https://github.com/EOSIO/eosio.cdt

## 3번 단계가 진행이 되었다면, 터미널에서 cleos를 이용해서 TestNet과 통신해보기
    - TestNet 정보 요청
        _> cleos -u http://jungle2.cryptolions.io get info
    - TestNet의 계정 정보 요청 : lioninjungle 계정의 정보를 요청 해봄
        _> cleos -u http://jungle2.cryptolions.io get account lioninjungle

## 폴더 구조
    1 build.sh : contract를 빌드(컴파일&링크)하기 위한 스크립트
    2 contracts : addressbook contracts 소스
        - addressbook
            - include
            - src
    3 build : build.sh을 실행하면, 빌드 관련 과일과 결과 파일이 저장 되는 폴더
        - contracts
            - addressbook : 빌드된 컨트랙트가 저장되는 폴더
                - addressbook.abi  : abi 파일
                - addressbook.wasm : contract 파일

## contract 빌드 행
    _> build.sh

## unittest 실행
    _> ./build/tests/unit_test --log_level=message

## contract 복사
    빌드가 완료 되면, build/contracts/addressbook의 abi, wasm파일을 backend/contract/addressbook으로 copy하고, deploy를 다시 실행




