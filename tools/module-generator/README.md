# Purpose
Save time generating similar code, follow a predefined folder structure, comply with guidelines. 

# Usage
1. Define how many modules you want to generate, and expected features for each module by modifying `config.ts` file
2. Run `yarn tool:generate` 

# Config a module 


# Contributing to the generator 
Each repo may have different opinions on folder organization and boilerplate codes. That's why this tool is not made as a npm package, but a script in the repo itself. To modify the module generator:
- Modify folder and files in the `/template` folder.
- In each file within template folder, add `//$feature_name//` infront of code line, so if a feature is enabled, the code line will be uncommented. For example, `//controller//` line will be uncommented if `controller` feature is turned on.
- 
