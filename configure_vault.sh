export VAULT_ADDR=
export VAULT_TOKEN=
# optional
export VAULT_SKIP_VERIFY=true
export VAULT_NAMESPACE=""

# enable the Socket audit device pointing to the Nodejs APP
vault audit enable socket address=127.0.0.1:9090 socket_type=tcp filter="path == \"secret/data/foo\" and operation == \"read\"" 

# add data to be read
vault kv put secret/foo username="test" password="hunter2"

#test the nodejs app
vault kv get secret/foo
