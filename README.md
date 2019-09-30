# 준비 단계
### Testnet 페이지
    - https://monitor.jungletestnet.io/#home

### 테스트에 사용 할 계정 만들기
    1 키생성하기 : (꼭, 생성한 키는 반드시, 저장을 하고, 분실하면 안됨)
        - owner key로 사용 할 키를 생성
            - Testnet 페이지에서, Create Key 링크 클릭
            - 생성된 값을 Owner Public Key, Owner Private Key로 저장
        - active key로 사용 할 키를 생성
            - Testnet 페이지에서, Create Key 링크 클릭
            - 생성된 값을 Active Public Key, Active Private Key로 저장

    2 계정 생성
        - Create Account 링크 클릭
            - 생성 할 Account Name을 입력,  제약조건) a-z,1-5 are allowed only. Length 12
            - 1번 단계에서 만들어진, Owner Public Key, Active Public Key를 각각 copy & paste
            - Create 버튼 클릭

    3 EOS 코인 충전 : 테스트 넷에서는 테스트에 사용 할 EOS 코인을 충전 받을 수 있음. (한번 충전한 IP는 24시간후에 재충전 가능)
        - Faucet 링크 클릭
            - 2번 단계에서 생성한 계정 이름 입력
            - Send Coins 버튼 클릭

    4 계정 정보 확인 : 계정이 잘 만들어 졌는지 확인
        - Account Info 링크 클릭
            - 2번 단계에서 생성한 계정 이름 입력
            - Get 버튼 클릭

## 스마트 컨트랙트 빌드 환경 만들기 (Mac OS X의 환경)
    1 brew 설치 (Mac OS X용 패키지 관리 프로그램, 개발에 필요한 프로그램들을 쉽게 설치, 업데이트, 삭제등을 할 수 있게 해줌)
        _> /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        - 참조 사이트 : https://brew.sh/index_ko
