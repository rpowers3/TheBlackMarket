# Imports all of the json files in the current directory into mongo.
Get-ChildItem | % { ..\..\..\Tools\MongoDB\mongoimport.exe -d TheBlackMarket -c Matches --file $_ }