#! /bin/bash

printf "\t=========== Building addressbook contracts ===========\n\n"

#!/usr/bin/env bash
set -eo pipefail

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export REPO_ROOT="${SCRIPT_DIR}/../"

function execute() {
  $VERBOSE && echo "--- Executing: $@"
  $DRYRUN || "$@"
}
function usage() {
   printf "Usage: $0 OPTION...
  -e DIR      Directory where EOSIO is installed. (Default: $HOME/eosio/X.Y)
  -c DIR      Directory where EOSIO.CDT is installed. (Default: /usr/local/eosio.cdt)
  -y          Noninteractive mode (Uses defaults for each prompt.)
  -h          Print this help menu.
   \\n" "$0" 1>&2
   exit 1
}

if [ $# -ne 0 ]; then
  while getopts "e:c:yh" opt; do
    case "${opt}" in
      e )
        EOSIO_DIR_PROMPT=$OPTARG
      ;;
      c )
        CDT_DIR_PROMPT=$OPTARG
      ;;
      y )
        NONINTERACTIVE=true
        PROCEED=true
      ;;
      h )
        usage
      ;;
      ? )
        echo "Invalid Option!" 1>&2
        usage
      ;;
      : )
        echo "Invalid Option: -${OPTARG} requires an argument." 1>&2
        usage
      ;;
      * )
        usage
      ;;
    esac
  done
fi

# Source helper functions and variables.
. ./scripts/.environment
. ./scripts/helper.sh

# Prompt user for location of eosio.
eosio-directory-prompt

# Prompt user for location of eosio.cdt.
cdt-directory-prompt

# Ensure eosio version is appropriate.
nodeos-version-check

printf "\t=========== Building eosio.contracts ===========\n\n"
RED='\033[0;31m'
NC='\033[0m'
CPU_CORES=$(getconf _NPROCESSORS_ONLN)
mkdir -p build
pushd build &> /dev/null
cmake  -DEOSIO_INSTALL_DIR=${EOSIO_INSTALL_DIR} -DCDT_INSTALL_DIR=${CDT_INSTALL_DIR} -DCMAKE_FRAMEWORK_PATH=${CMAKE_FRAMEWORK_PATH} ${REPO_ROOT}
#execute bash -c "cmake -DEOSIO_INSTALL_DIR='${EOSIO_INSTALL_DIR}' -DCDT_INSTALL_DIR='${CDT_INSTALL_DIR}' -DCMAKE_FRAMEWORK_PATH='${CMAKE_FRAMEWORK_PATH}' '${REPO_ROOT}'"
make -j $CPU_CORES
popd &> /dev/null
