Get-ChildItem -recurse | Where-Object {$_.PSIsContainer -eq $True} | Where-Object {$_.GetFiles().Count -eq 0} | Select-Object FullName