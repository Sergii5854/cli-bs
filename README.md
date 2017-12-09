# cli-bs CLI utility to search

### Parameters order is not strict! Any order work! 

## Installation

``$ [sudo] npm install -g cli-bs``

## Usage:
    
### CLI   

    Usage:
        cli-bs [--OPTION]=[ARGUMENTS]
    
    Options: 
        --DIR (required) base lookup directory
        --TYPE (optional) [D|F] D - directory, F - file
        --PATTERN (optional) regular expression to test file/directory name
        --MIN-SIZE (optional) minimum file size [B|K|M|G], skipped for directories
        --MAX-SIZE (optional) maximum file size [B|K|M|G], skipped for directories 
        
    (B - bytes, K - kilobytes, M - megabytes, G - gigabytes) 
      
    
### Example:  

> The order of the parameters is NOT strict. 

``cli-bs  --PATTERN=\.mkv --DIR=/Users/root/Downloads --TYPE=F --MIN-SIZE=1K --MAX-SIZE=4G`` 

### License and Copyright
This software is released under the terms of the [ISC license](https://github.com/Sergii5854/cli-bs/blob/master/LICENSE.md).