/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#pragma once

#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

#include <string>

namespace eosiosystem {
   class system_contract;
}

namespace eosio {

   using std::string;

   class [[eosio::contract("addressbook")]] addressbook : public contract {
      public:
         using contract::contract;

         [[eosio::action]]
         void upsert(name owner, name user, const std::string& first_name, const std::string& last_name, const std::string& street, const std::string& city);

         [[eosio::action]]
         void erase(name owner, name user);

      private:
         struct [[eosio::table]] person {
            name user;
            std::string first_name;
            std::string last_name;
            std::string street;
            std::string city;
            uint64_t primary_key() const { return user.value;}
         };

         typedef eosio::multi_index<"contacts"_n, person> address_index;
   };

} /// namespace eosio
