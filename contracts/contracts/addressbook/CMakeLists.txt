add_contract(addressbook addressbook ${CMAKE_CURRENT_SOURCE_DIR}/src/addressbook.cpp)

target_include_directories(addressbook
   PUBLIC
   ${CMAKE_CURRENT_SOURCE_DIR}/include)

set_target_properties(addressbook
   PROPERTIES
   RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}")
