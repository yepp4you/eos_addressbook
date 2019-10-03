/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */

#include <addressbook/addressbook.hpp>

namespace eosio {

void addressbook::upsert(name owner, name user, const std::string& first_name, const std::string& last_name, const std::string& street, const std::string& city) {
   require_auth(owner);

   address_index addresses(get_self(), owner.value);
   auto iterator = addresses.find(user.value);
   if(iterator == addresses.end()) {
      addresses.emplace(owner, [&]( auto& row ) {
         row.user = user;
         row.first_name = first_name;
         row.last_name = last_name;
         row.street = street;
         row.city = city;
      });
   } else {
      addresses.modify(iterator, owner, [&]( auto& row ) {
         row.user = user;
         row.first_name = first_name;
         row.last_name = last_name;
         row.street = street;
         row.city = city;
      });
   }
}

void addressbook::erase(name owner, name user) {
   require_auth(owner);

   address_index addresses(get_self(), owner.value);
   auto iterator = addresses.find(user.value);
   check(iterator != addresses.end(), "Record does not exist");
   addresses.erase(iterator);
}

} /// namespace eosio

EOSIO_DISPATCH( eosio::addressbook, (upsert)(erase))