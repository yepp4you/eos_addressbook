#include <boost/test/unit_test.hpp>
#include <eosio/testing/tester.hpp>
#include <eosio/chain/abi_serializer.hpp>

#include "Runtime/Runtime.h"

#include <fc/variant_object.hpp>

#include "contracts.hpp"

using namespace eosio::testing;
using namespace eosio;
using namespace eosio::chain;
using namespace eosio::testing;
using namespace fc;
using namespace std;

using mvo = fc::mutable_variant_object;

class addressbook_tester : public tester {
public:
   addressbook_tester() {
      produce_blocks( 1 );

      create_accounts( { N(alice), N(bob), N(carol), N(addressbook) } );
      produce_blocks( 1 );

      set_code( N(addressbook), contracts::addressbook_wasm() );
      set_abi( N(addressbook), contracts::addressbook_abi().data() );

      produce_blocks();

      const auto& accnt = control->db().get<account_object,by_name>( N(addressbook) );
      abi_def abi;
      BOOST_REQUIRE_EQUAL(abi_serializer::to_abi(accnt.abi, abi), true);
      abi_ser.set_abi(abi, abi_serializer_max_time);
   }

   action_result push_action( const account_name& signer, const action_name &name, const variant_object &data ) {
      string action_type_name = abi_ser.get_action_type(name);

      action act;
      act.account = N(addressbook);
      act.name    = name;
      act.data    = abi_ser.variant_to_binary( action_type_name, data,abi_serializer_max_time );
      return base_tester::push_action( std::move(act), uint64_t(signer));
   }

   fc::variant get_person( account_name user)
   {
      vector<char> data = get_row_by_account( N(addressbook),  N(addressbook), N(people), user.value);
      return data.empty() ? fc::variant() : abi_ser.binary_to_variant( "person", data, abi_serializer_max_time );
   }

   action_result upsert(name user, std::string first_name, std::string last_name, std::string street, std::string city) {
      return push_action( user, N(upsert), mvo()
           ( "user", user)
           ( "first_name", first_name)
           ( "last_name", last_name)
           ( "street", street)
           ( "city", city)
      );
   }

    action_result erase(name user) {
      return push_action( user, N(erase), mvo()
           ( "user", user)
      );
   }

   abi_serializer abi_ser;
};

BOOST_AUTO_TEST_SUITE(eosio_addressbook_tests)

BOOST_FIXTURE_TEST_CASE( upsert_tests, addressbook_tester ) try {

   upsert( N(alice), "alice", "kim", "kangnam", "seoul");
   produce_blocks(1);

   auto person_1 = get_person(N(alice));
   BOOST_TEST_MESSAGE(fc::json::to_pretty_string(person_1));
   REQUIRE_MATCHING_OBJECT( person_1, mvo()
      ( "user", "alice")
      ( "first_name", "alice")
      ( "last_name", "kim")
      ( "street", "kangnam")
      ( "city", "seoul")
   );

} FC_LOG_AND_RETHROW()


BOOST_FIXTURE_TEST_CASE( erase_tests, addressbook_tester ) try {

   upsert( N(alice), "alice", "kim", "kangnam", "seoul");
   produce_blocks(1);

   auto person_1 = get_person(N(alice));
   BOOST_TEST_MESSAGE(fc::json::to_pretty_string(person_1));
   REQUIRE_MATCHING_OBJECT( person_1, mvo()
      ( "user", "alice")
      ( "first_name", "alice")
      ( "last_name", "kim")
      ( "street", "kangnam")
      ( "city", "seoul")
   );

   erase( N(alice));
   auto person_2 = get_person(N(alice));
   //BOOST_TEST_MESSAGE(fc::json::to_pretty_string(person_2));
   BOOST_REQUIRE_EQUAL(person_2.is_null(), true);

} FC_LOG_AND_RETHROW()


BOOST_AUTO_TEST_SUITE_END()
