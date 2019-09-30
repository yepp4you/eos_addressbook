/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */

#include <addressbook/addressbook.hpp>

namespace eosio {

void addressbook::upsert(name user, std::string first_name, std::string last_name, std::string street, std::string city) {
   require_auth(user);

   address_index addresses(get_self(), get_first_receiver().value);
   auto iterator = addresses.find(user.value);
   if(iterator == addresses.end()) {
      addresses.emplace(user, [&]( auto& row ) {
         row.user = user;
         row.first_name = first_name;
         row.last_name = last_name;
         row.street = street;
         row.city = city;
      });
   } else {
      addresses.modify(iterator, user, [&]( auto& row ) {
         row.user = user;
         row.first_name = first_name;
         row.last_name = last_name;
         row.street = street;
         row.city = city;
      });
   }
}

void addressbook::erase(name user) {
   require_auth(user);

   address_index addresses(get_self(), get_first_receiver().value);
   auto iterator = addresses.find(user.value);
   check(iterator != addresses.end(), "Record does not exist");
   addresses.erase(iterator);
}

} /// namespace eosio

EOSIO_DISPATCH( eosio::addressbook, (upsert)(erase))