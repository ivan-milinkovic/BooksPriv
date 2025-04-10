#! /bin/zsh

server_script="cd '$PWD/books-server' && pwd && npm run dev"
server_term_command="tell app \"Terminal\" to do script \"$server_script\""
osascript -e $server_term_command

client_script="cd '$PWD/books-client' && pwd && npm run dev"
client_term_command="tell app \"Terminal\" to do script \"$client_script\""
osascript -e $client_term_command
